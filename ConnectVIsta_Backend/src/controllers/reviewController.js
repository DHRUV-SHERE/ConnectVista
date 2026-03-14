const Review = require('../models/Review');
const Booking = require('../models/Booking');
const ServiceProvider = require('../models/ServiceProvider');
const Notification = require('../models/Notification');
const socketManager = require('../utils/socketManager');
const ServiceSeeker = require('../models/ServiceSeeker');
const mongoose = require('mongoose');

/**
 * Create a new review
 * @route POST /api/reviews
 * @access Private (seeker only)
 */
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, reviewText } = req.body;

    // Get seeker profile
    const seeker = await ServiceSeeker.findOne({ userId: req.user.id });
    if (!seeker) {
      return res.status(404).json({
        success: false,
        message: 'Seeker profile not found'
      });
    }

    // Validate booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking belongs to this seeker
    if (booking.seekerId.toString() !== seeker._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this booking'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed services can be reviewed'
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this service'
      });
    }

    // Create review
    const review = new Review({
      bookingId,
      seekerId: seeker._id,
      providerId: booking.providerId,
      rating,
      reviewText
    });

    await review.save();

    // Update booking status
    booking.isReviewed = true;
    await booking.save();

    // Update provider rating
    const provider = await ServiceProvider.findById(booking.providerId);
    if (provider) {
      const currentAvg = provider.rating.average || 0;
      const currentCount = provider.rating.count || 0;
      
      const newCount = currentCount + 1;
      const newAvg = (currentAvg * currentCount + rating) / newCount;
      
      provider.rating.average = parseFloat(newAvg.toFixed(1));
      provider.rating.count = newCount;
      
      // Update breakdown
      const starKey = rating.toString();
      if (!provider.rating.breakdown) {
        provider.rating.breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      provider.rating.breakdown[starKey] = (provider.rating.breakdown[starKey] || 0) + 1;
      
      await provider.save();

      // Notify provider
      const notification = new Notification({
        userId: provider.userId,
        title: 'New Review Received',
        message: `You received a ${rating}-star review from ${seeker.name}`,
        category: 'review',
        type: 'info',
        actionUrl: `/service-provider/reviews`,
        metadata: {
          reviewId: review._id,
          rating,
          seekerName: seeker.name
        }
      });
      await notification.save();

      // Socket event
      socketManager.emitToUser(provider.userId.toString(), 'review:new', {
        review: {
          id: review._id,
          rating,
          reviewText,
          seekerName: seeker.name
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review'
    });
  }
};

/**
 * Get reviews for a provider
 * @route GET /api/reviews/provider/:providerId
 * @access Public
 */
const getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ providerId })
        .populate('seekerId', 'name profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ providerId })
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get provider reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};

/**
 * Get review for a specific booking
 * @route GET /api/reviews/booking/:bookingId
 * @access Private
 */
const getReviewByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const review = await Review.findOne({ bookingId });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Get review by booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review'
    });
  }
};

/**
 * Reply to a review
 * @route PATCH /api/reviews/:id/reply
 * @access Private (provider only)
 */
const replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyText } = req.body;

    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Verify review belongs to this provider
    if (review.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reply to this review'
      });
    }

    review.providerReply = {
      text: replyText,
      repliedAt: new Date()
    };
    await review.save();

    res.json({
      success: true,
      message: 'Reply submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Reply to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit reply'
    });
  }
};

/**
 * Set reminder date for a review
 * @route PATCH /api/reviews/reminder/:bookingId
 * @access Private (seeker only)
 */
const setReviewReminder = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Set reminder for 7 days later
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 7);

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { reviewReminderDate: reminderDate },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Reminder set successfully',
      data: { reminderDate: booking.reviewReminderDate }
    });
  } catch (error) {
    console.error('Set review reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set reminder'
    });
  }
};

module.exports = {
  createReview,
  getProviderReviews,
  getReviewByBooking,
  replyToReview,
  setReviewReminder
};
