const mongoose = require('mongoose');

const providerSubscriptionSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true
  },
  
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  endDate: {
    type: Date,
    required: true
  },
  
  paymentId: String,
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  autoRenew: {
    type: Boolean,
    default: false
  },
  
  cancelledAt: Date,
  
  cancellationReason: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
providerSubscriptionSchema.index({ providerId: 1 });
providerSubscriptionSchema.index({ isActive: 1 });
providerSubscriptionSchema.index({ endDate: 1 });
providerSubscriptionSchema.index({ providerId: 1, isActive: 1 });

const ProviderSubscription = mongoose.model('ProviderSubscription', providerSubscriptionSchema);
module.exports = ProviderSubscription;