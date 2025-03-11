const express = require("express");
const stripe = require("stripe") // This should be the secret key
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth"); // Middleware for authentication
const StripeApiKey = require('../models/StripeApiKey'); // Import the StripeApiKey model

// Route to create a Stripe Checkout Session
router.post("/create-checkout-session", auth(["parent"]), async (req, res) => {
  const { priceId, subscriptionPlan } = req.body; // Expecting priceId and subscriptionPlan from frontend

  try {
    // Fetch the Stripe API keys from the database
    const apiKeys = await StripeApiKey.findOne({});
    if (!apiKeys) {
      return res.status(500).json({ error: "Stripe API keys are not configured" });
    }

    const stripeInstance = stripe(apiKeys.stripeSecretKey); // Use the secret key from DB

    const userId = req.user.id;
    console.log("User ID from auth middleware:", userId);

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId.toString(),
        subscriptionPlan: subscriptionPlan || "unknown", // Store the plan selected by the user
      },
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    console.log("Stripe Checkout session created successfully:", session.id);
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});
router.get("/session/:sessionId", auth(["parent"]), async (req, res) => {
  const { sessionId } = req.params;
  console.log("Received request to fetch session details for session ID:", sessionId);

  try {
    // Fetch the Stripe API keys from the database
    const apiKeys = await StripeApiKey.findOne({});
    if (!apiKeys) {
      return res.status(500).json({ error: "Stripe API keys are not configured" });
    }

    // Initialize Stripe with the secret key from the database
    const stripeInstance = stripe(apiKeys.stripeSecretKey);
    console.log("Using Stripe Secret Key from DB");

    // Fetch the session details from Stripe using the sessionId
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
    console.log("Stripe session details retrieved:", session);

    if (!session || !session.subscription) {
      return res.status(400).json({ error: "No subscription associated with this session." });
    }

    // Fetch subscription details from Stripe
    const subscription = await stripeInstance.subscriptions.retrieve(session.subscription);
    console.log("Stripe subscription details retrieved:", subscription);

    // Extract plan details
    const plan = subscription.items.data[0].plan;
    const price = (plan.amount / 100).toFixed(2); // Convert from cents to currency
    const interval = plan.interval; // monthly or yearly
    const nickname = plan.nickname || "Unknown Plan";

    // Create a descriptive subscription detail
    const subscriptionDetail = `${price} € Billed ${interval} (${nickname})`;

    // Update the user's subscription in the database
    const userId = session.metadata.userId;
    await User.findByIdAndUpdate(userId, {
      subscriptionStatus: "active",
      subscriptionExpiry: new Date(subscription.current_period_end * 1000), // Convert Unix timestamp to JS Date
      subscriptionPlan: subscriptionDetail,
    });

    console.log("User subscription updated successfully for user ID:", userId);

    // Return subscription details to the client
    res.status(200).json({
      success: true,
      subscription: {
        detail: subscriptionDetail,
        expiry: new Date(subscription.current_period_end * 1000),
      },
    });
  } catch (error) {
    console.error("Error fetching session details or updating user subscription:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch session details or update subscription" });
  }
});
  
// Webhook route to handle Stripe events

  

module.exports = router;
