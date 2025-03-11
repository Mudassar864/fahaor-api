// routes/pricing.js
const express = require('express')
const PricingPlan = require('../models/PricingPlan') // Assuming the model path is correct
const router = express.Router()

// Create a new pricing plan
router.post('/pricing', async (req, res) => {
  const { name, description, ops, priceId, monthlyPrice } = req.body

  try {
    const newPlan = new PricingPlan({
      name,
      description,
      ops,
      priceId,
      monthlyPrice,
    })

    await newPlan.save()
    res.status(201).json(newPlan)
  } catch (error) {
    console.error('Error creating pricing plan:', error)
    res.status(500).json({ message: 'Failed to create pricing plan' })
  }
})

// Get all pricing plans
// routes/pricing.js
// routes/pricing.js
router.get('/pricing', async (req, res) => {
    try {
      const plans = await PricingPlan.find();  // Fetch pricing plans
      console.log('Fetched plans:', plans);    // Log the data to check what is returned
      res.status(200).json(plans);              // Send the plans as JSON response
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      res.status(500).json({ message: 'Failed to retrieve pricing plans', error: error.message });
    }
  });
  
  
// Update a pricing plan
router.put('/pricing/:planId', async (req, res) => {
  const { planId } = req.params
  const { name, description, ops, priceId, monthlyPrice } = req.body

  try {
    const updatedPlan = await PricingPlan.findByIdAndUpdate(
      planId,
      { name, description, ops, priceId, monthlyPrice },
      { new: true }
    )
    res.status(200).json(updatedPlan)
  } catch (error) {
    console.error('Error updating pricing plan:', error)
    res.status(500).json({ message: 'Failed to update pricing plan' })
  }
})

// Delete a pricing plan
router.delete('/pricing/:planId', async (req, res) => {
  const { planId } = req.params

  try {
    await PricingPlan.findByIdAndDelete(planId)
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting pricing plan:', error)
    res.status(500).json({ message: 'Failed to delete pricing plan' })
  }
})

module.exports = router
