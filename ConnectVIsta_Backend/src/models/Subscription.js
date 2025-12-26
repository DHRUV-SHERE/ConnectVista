const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subscription name is required'],
    trim: true,
    unique: true
  },
  
  description: {
    type: String,
    trim: true
  },
  
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  durationDays: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 day']
  },
  
  // Benefits
  rankBoost: {
    type: Number,
    default: 0,
    min: [0, 'Rank boost cannot be negative']
  },
  
  maxPortfolioImages: {
    type: Number,
    default: 10
  },
  
  maxServices: {
    type: Number,
    default: 5
  },
  
  analyticsAccess: {
    type: Boolean,
    default: false
  },
  
  prioritySupport: {
    type: Boolean,
    default: false
  },
  
  featuredListing: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
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
subscriptionSchema.index({ price: 1 });
subscriptionSchema.index({ isActive: 1 });
subscriptionSchema.index({ rankBoost: -1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;