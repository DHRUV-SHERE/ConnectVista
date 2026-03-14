const express = require('express');
const {
  createBooking,
  getSeekerBookings,
  getProviderBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  completeBooking
} = require('../controllers/bookingController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking request
 * @access  Private (seeker only)
 */
router.post('/', auth(['seeker']), createBooking);

/**
 * @route   GET /api/bookings/seeker
 * @desc    Get seeker's booking history
 * @access  Private (seeker only)
 * @query   status - Filter by status (optional)
 * @query   page - Page number for pagination
 * @query   limit - Results per page
 */
router.get('/seeker', auth(['seeker']), getSeekerBookings);

/**
 * @route   GET /api/bookings/provider
 * @desc    Get provider's booking requests
 * @access  Private (provider only)
 * @query   status - Filter by status (optional)
 * @query   page - Page number for pagination
 * @query   limit - Results per page
 */
router.get('/provider', auth(['provider']), getProviderBookings);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking by ID
 * @access  Private (booking owner - seeker or provider)
 */
router.get('/:id', auth(), getBookingById);

/**
 * @route   PATCH /api/bookings/:id/accept
 * @desc    Accept a pending booking
 * @access  Private (provider only)
 */
router.patch('/:id/accept', auth(['provider']), acceptBooking);

/**
 * @route   PATCH /api/bookings/:id/reject
 * @desc    Reject a pending booking
 * @access  Private (provider only)
 * @body    reason - Optional rejection reason
 */
router.patch('/:id/reject', auth(['provider']), rejectBooking);

/**
 * @route   PATCH /api/bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Private (seeker or provider - booking owner)
 * @body    reason - Optional cancellation reason
 */
router.patch('/:id/cancel', auth(), cancelBooking);

/**
 * @route   PATCH /api/bookings/:id/complete
 * @desc    Complete a booking
 * @access  Private (provider only)
 * @body    providerNotes - Optional completion notes
 */
router.patch('/:id/complete', auth(['provider']), completeBooking);

module.exports = router;
