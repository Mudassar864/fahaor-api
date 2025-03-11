const mongoose = require("mongoose");

const PricingPlanSchema = new mongoose.Schema({
  name: String,
  description: String,
  monthlyPrice: String,
  yearlyPrice: String,
  monthlyUrl: String,
  yearlyUrl: String,
  badge: String,
  ops: [String], // This can be an array of operations
});

const LandingPageSchema = new mongoose.Schema({
  pricing: [PricingPlanSchema],
  // other fields for landing page if needed
});

const LandingPage = mongoose.model("LandingPage", LandingPageSchema);

module.exports = LandingPage;
