const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true
  },
  
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceSeeker',
    required: true
  },
  
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  reviewText: {
    type: String,
    trim: true,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  
  // Like/Dislike system for reviews
  likes: {
    type: Number,
    default: 0
  },
  
  dislikes: {
    type: Number,
    default: 0
  },
  
  // Provider can reply to review
  providerReply: {
    text: String,
    repliedAt: Date
  },
  
  // Status tracking
  isReadByProvider: {
    type: Boolean,
    default: false
  },
  
  isEdited: {
    type: Boolean,
    default: false
  },
  
  editedAt: Date,
  
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
reviewSchema.index({ providerId: 1 });
reviewSchema.index({ seekerId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ providerId: 1, rating: 1 });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;