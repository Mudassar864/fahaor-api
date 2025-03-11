const express = require('express');
const StripeApiKey = require('../models/StripeApiKey');
const auth = require('../middleware/auth'); // Use authentication middleware to protect routes
const router = express.Router();

// Route to get the current Stripe API keys
router.get('/stripe-keys', async (req, res) => {
    try {
      const keys = await StripeApiKey.findOne({});
      if (keys) {
        return res.status(200).json(keys);
      } else {
        return res.status(404).json({ message: 'Stripe API keys not found' });
      }
    } catch (error) {
      console.error('Error fetching Stripe API keys:', error.message);
      res.status(500).json({ message: 'Error fetching Stripe API keys' });
    }
  });
// Route to add or update the Stripe API keys
router.post('/stripe-keys', async (req, res) => {
  const { stripeSecretKey, stripePublishableKey } = req.body;

  if (!stripeSecretKey || !stripePublishableKey) {
    return res.status(400).json({ message: 'Stripe secret key and publishable key are required' });
  }

  try {
    let keys = await StripeApiKey.findOne({});

    if (keys) {
      // If keys already exist, update them
      keys.stripeSecretKey = stripeSecretKey;
      keys.stripePublishableKey = stripePublishableKey;
      keys.updatedAt = new Date();
      await keys.save();
    } else {
      // If no keys exist, create new entry
      keys = new StripeApiKey({ stripeSecretKey, stripePublishableKey });
      await keys.save();
    }

    return res.status(200).json({ message: 'Stripe API keys updated successfully' });
  } catch (error) {
    console.error('Error updating Stripe API keys:', error.message);
    res.status(500).json({ message: 'Error updating Stripe API keys' });
  }
});

module.exports = router;
