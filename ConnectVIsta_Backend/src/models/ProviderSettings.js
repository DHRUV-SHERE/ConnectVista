const mongoose = require('mongoose');

const providerSettingsSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true,
    unique: true
  },
  
  // Notification Settings
  notifications: {
    newBooking: { type: Boolean, default: true },
    bookingUpdate: { type: Boolean, default: true },
    paymentReceived: { type: Boolean, default: true },
    newReview: { type: Boolean, default: true },
    promotional: { type: Boolean, default: false },
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  
  // Booking Settings
  autoAcceptBooking: {
    type: Boolean,
    default: false
  },
  
  maxDailyBookings: {
    type: Number,
    default: 5,
    min: [1, 'Must accept at least 1 booking per day']
  },
  
  // Privacy Settings
  showPhone: {
    type: Boolean,
    default: false
  },
  
  showEmail: {
    type: Boolean,
    default: false
  },
  
  showExactAddress: {
    type: Boolean,
    default: false
  },
  
  // Display Settings
  showRatings: {
    type: Boolean,
    default: true
  },
  
  showPortfolio: {
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

const ProviderSettings = mongoose.model('ProviderSettings', providerSettingsSchema);
module.exports = ProviderSettings;