const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  plan: {
    type: String,
    enum: ['Basic', 'Professional', 'Business', 'Enterprise'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  paymentDetails: {
    transactionId: String,
    method: String,
    cardLast4: String,
    cardType: String
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

subscriptionSchema.index({ providerId: 1 });
subscriptionSchema.index({ status: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
