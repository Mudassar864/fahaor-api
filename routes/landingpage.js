const express = require("express");
const mongoose = require("mongoose");
const LandingPage = require("../models/LandingPage"); // Adjust the path to your model file
const router = express.Router();

// Create a new pricing plan
router.post("/pricing", async (req, res) => {
  const { name, description, monthlyPrice, yearlyPrice, monthlyUrl, yearlyUrl, badge, ops } = req.body;
  console.log('get data'+ req.body.name)
  try {
    const landingPage = await LandingPage.findOne(); // Find the first LandingPage document (assuming only one document)
    if (!landingPage) {
      return res.status(404).json({ message: "Landing page not found" });
    }

    const newPlan = {
      name,
      description,
      monthlyPrice,
      yearlyPrice,
      monthlyUrl,
      yearlyUrl,
      badge,
      ops,
    };

    landingPage.pricing.push(newPlan);
    await landingPage.save();

    res.status(201).json(landingPage.pricing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create pricing plan" });
  }
});

// Get all pricing plans
router.get("/pricing", async (req, res) => {
  console.log('its hit')
  try {
    const landingPage = await LandingPage.findOne();
    if (!landingPage) {
      return res.status(404).json({ message: "Landing page not found" });
    }

    res.json(landingPage.pricing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve pricing plans" });
  }
});

// Update a pricing plan
router.put("/pricing/:planId", async (req, res) => {
  const { planId } = req.params;
  const { name, description, monthlyPrice, yearlyPrice, monthlyUrl, yearlyUrl, badge, ops } = req.body;

  try {
    const landingPage = await LandingPage.findOne();
    if (!landingPage) {
      return res.status(404).json({ message: "Landing page not found" });
    }

    const planIndex = landingPage.pricing.findIndex((plan) => plan._id.toString() === planId);
    if (planIndex === -1) {
      return res.status(404).json({ message: "Pricing plan not found" });
    }

    landingPage.pricing[planIndex] = {
      ...landingPage.pricing[planIndex],
      name,
      description,
      monthlyPrice,
      yearlyPrice,
      monthlyUrl,
      yearlyUrl,
      badge,
      ops,
    };

    await landingPage.save();
    res.json(landingPage.pricing[planIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update pricing plan" });
  }
});

// Delete a pricing plan
router.delete("/pricing/:planId", async (req, res) => {
  const { planId } = req.params;

  try {
    const landingPage = await LandingPage.findOne();
    if (!landingPage) {
      return res.status(404).json({ message: "Landing page not found" });
    }

    const planIndex = landingPage.pricing.findIndex((plan) => plan._id.toString() === planId);
    if (planIndex === -1) {
      return res.status(404).json({ message: "Pricing plan not found" });
    }

    landingPage.pricing.splice(planIndex, 1);
    await landingPage.save();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete pricing plan" });
  }
});

module.exports = router;
