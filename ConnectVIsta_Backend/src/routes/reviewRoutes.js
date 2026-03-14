const express = require('express');
const {
  createReview,
  getProviderReviews,
  getReviewByBooking,
  replyToReview,
  setReviewReminder
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private (seeker only)
 */
router.post('/', auth(['seeker']), createReview);

/**
 * @route   GET /api/reviews/provider/:providerId
 * @desc    Get reviews for a provider
 * @access  Public
 */
router.get('/provider/:providerId', getProviderReviews);

/**
 * @route   GET /api/reviews/booking/:bookingId
 * @desc    Get review for a specific booking
 * @access  Private
 */
router.get('/booking/:bookingId', auth(), getReviewByBooking);

/**
 * @route   PATCH /api/reviews/:id/reply
 * @desc    Reply to a review
 * @access  Private (provider only)
 */
router.patch('/:id/reply', auth(['provider']), replyToReview);

/**
 * @route   PATCH /api/reviews/reminder/:bookingId
 * @desc    Set reminder for a review
 * @access  Private (seeker only)
 */
router.patch('/reminder/:bookingId', auth(['seeker']), setReviewReminder);

module.exports = router;
