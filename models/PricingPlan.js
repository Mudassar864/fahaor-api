// models/PricingPlan.js
const mongoose = require('mongoose')

const pricingPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ops: { type: [String], required: true },
  priceId: { type: String, required: true },  // Stripe Price ID
  monthlyPrice: { type: String, required: true },  // Monthly price in string format (e.g., '4,99 €')
})

const PricingPlan = mongoose.model('PricingPlan', pricingPlanSchema)

module.exports = PricingPlan
