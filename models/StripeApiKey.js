const mongoose = require('mongoose');

const StripeApiKeySchema = new mongoose.Schema({
  stripeSecretKey: {
    type: String,
    required: true,
  },
  stripePublishableKey: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const StripeApiKey = mongoose.model('StripeApiKey', StripeApiKeySchema);

module.exports = StripeApiKey;
