const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true
  },
  
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true
  },
  
  category: {
    type: String,
    enum: ['booking', 'payment', 'verification', 'system', 'promotion', 'review'],
    default: 'system'
  },
  
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  
  isRead: {
    type: Boolean,
    default: false
  },
  
  readAt: Date,
  
  actionUrl: String,
  
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
notificationSchema.index({ userId: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ category: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;