const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const ServiceSeeker = require('../models/ServiceSeeker');
const ServiceProvider = require('../models/ServiceProvider');
const ProviderService = require('../models/ProviderService');
const ProviderSchedule = require('../models/ProviderSchedule');
const socketManager = require('../utils/socketManager');

/**
 * Create a new booking request
 * @route POST /api/bookings
 * @access Private (seeker only)
 */
const createBooking = async (req, res) => {
  try {
    const {
      providerId,
      serviceId,
      bookingDate,
      bookingTime,
      priority,
      serviceAddress,
      additionalNote,
      contactPhone
    } = req.body;

    // Get seeker profile or create one if it doesn't exist
    let seeker = await ServiceSeeker.findOne({ userId: req.user.id });
    if (!seeker) {
      // Create a basic seeker profile
      seeker = new ServiceSeeker({
        userId: req.user.id,
        name: req.user.name || 'User',
        address: {
          street: '',
          city: '',
          state: '',
          pinCode: ''
        }
      });
      await seeker.save();
    }

    // Validate provider exists and is verified
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    if (!provider.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Provider is not verified'
      });
    }

    // Get provider's service details
    const providerService = await ProviderService.findOne({ providerId: providerId });
    if (!providerService || !providerService.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Provider service not available'
      });
    }

    // Check if seeker already has an active booking for this service category
    if (serviceId) {
      const activeBookingInCategory = await Booking.findOne({
        seekerId: seeker._id,
        serviceId: serviceId,
        status: { $nin: ['completed', 'cancelled', 'rejected'] }
      });

      if (activeBookingInCategory) {
        return res.status(400).json({
          success: false,
          message: 'You already have an active booking for this service category. Please complete or cancel it before booking another.'
        });
      }
    }

    // Validate booking date is in the future
    const bookingDateObj = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDateObj < today) {
      return res.status(400).json({
        success: false,
        message: 'Booking date must be in the future'
      });
    }

    // Check for duplicate booking (same provider, date, time)
    const existingBooking = await Booking.findOne({
      providerId,
      bookingDate: bookingDateObj,
      bookingTime,
      status: { $nin: ['rejected', 'cancelled'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Validate against provider's schedule
    const schedule = await ProviderSchedule.findOne({ providerId });
    if (schedule) {
      const dayOfWeek = bookingDateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const daySchedule = schedule.weeklySchedule[dayOfWeek];

      if (daySchedule && !daySchedule.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Provider is not available on ${dayOfWeek}s`
        });
      }

      // Check if booking time is within working hours
      if (daySchedule) {
        const bookingTimeNum = parseInt(bookingTime.replace(':', ''));
        const startTimeNum = parseInt(daySchedule.startTime.replace(':', ''));
        const endTimeNum = parseInt(daySchedule.endTime.replace(':', ''));

        if (bookingTimeNum < startTimeNum || bookingTimeNum >= endTimeNum) {
          return res.status(400).json({
            success: false,
            message: `Provider is only available between ${daySchedule.startTime} and ${daySchedule.endTime}`
          });
        }
      }
    }

    // Calculate pricing
    const basePrice = providerService.minPrice || provider.startingPrice || 500;
    const visitingCharge = provider.startingPrice || 200; // Use provider's starting price as visiting fee
    const priorityMultiplier = priority === 'urgent' ? 1.5 : 1;
    const extraCharge = priority === 'urgent' ? basePrice * 0.5 : 0;
    
    // Platform fee calculation: 5% of visiting charge (for now)
    const platformFee = Math.round(visitingCharge * 0.05); 
    
    // Seeker pays visitingCharge upfront
    const totalPrice = Math.round(visitingCharge + platformFee); 

    // Build service address
    const finalAddress = serviceAddress || {
      sameAsSeeker: true,
      street: seeker.address?.street || '',
      city: seeker.address?.city || '',
      state: seeker.address?.state || '',
      pinCode: seeker.address?.pinCode || ''
    };

    // Create booking
    const booking = new Booking({
      seekerId: seeker._id,
      providerId,
      serviceId: serviceId || new mongoose.Types.ObjectId(), // Use provided serviceId or generate new one
      bookingDate: bookingDateObj,
      bookingTime,
      priority: priority || 'normal',
      serviceAddress: finalAddress,
      additionalNote,
      basePrice,
      visitingCharge,
      extraCharge,
      platformFee,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await booking.save();

    // Create notification for provider
    const notification = new Notification({
      userId: provider.userId,
      bookingId: booking._id,
      title: 'New Booking Request',
      message: `You have a new ${priority === 'urgent' ? 'URGENT ' : ''}booking request for ${bookingDateObj.toLocaleDateString()}`,
      category: 'booking',
      type: priority === 'urgent' ? 'warning' : 'info',
      actionUrl: `/service-provider/bookings`,
      metadata: {
        bookingId: booking._id,
        seekerName: seeker.name,
        bookingDate: bookingDate,
        bookingTime: bookingTime,
        priority: priority
      }
    });

    await notification.save();

    // Emit socket event to provider
    socketManager.emitToUser(provider.userId.toString(), 'booking:new', {
      booking: {
        id: booking._id,
        seekerName: seeker.name,
        date: bookingDate,
        time: bookingTime,
        priority: priority,
        totalPrice: totalPrice
      },
      notification: {
        id: notification._id,
        title: notification.title,
        message: notification.message
      }
    });

    // Populate booking for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('providerId', 'name businessName')
      .populate('seekerId', 'name');

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      data: populatedBooking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get seeker's bookings
 * @route GET /api/bookings/seeker
 * @access Private (seeker only)
 */
const getSeekerBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const seeker = await ServiceSeeker.findOne({ userId: req.user.id });
    if (!seeker) {
      return res.status(404).json({
        success: false,
        message: 'Seeker profile not found'
      });
    }

    const query = { seekerId: seeker._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('providerId', 'name businessName businessAddress rating')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get seeker bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
};

/**
 * Get provider's bookings
 * @route GET /api/bookings/provider
 * @access Private (provider only)
 */
const getProviderBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const query = { providerId: provider._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate({
          path: 'seekerId',
          select: 'name address profileImage',
          populate: {
            path: 'userId',
            select: 'email phone'
          }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(query)
    ]);

    // Get stats
    const stats = await Booking.aggregate([
      { $match: { providerId: provider._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalPrice', 0] } }
        }
      }
    ]);

    const statsMap = {
      total: 0,
      pending: 0,
      accepted: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0
    };

    stats.forEach(s => {
      statsMap[s._id] = s.count;
      statsMap.total += s.count;
      statsMap.totalRevenue += s.revenue;
    });

    res.json({
      success: true,
      data: {
        bookings,
        stats: statsMap,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get provider bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
};

/**
 * Get single booking by ID
 * @route GET /api/bookings/:id
 * @access Private
 */
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    const booking = await Booking.findById(id)
      .populate('providerId', 'name businessName businessAddress rating experienceYears')
      .populate({
        path: 'seekerId',
        select: 'name address profileImage',
        populate: {
          path: 'userId',
          select: 'email phone'
        }
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user has access to this booking
    const seeker = await ServiceSeeker.findOne({ userId: req.user.id });
    const provider = await ServiceProvider.findOne({ userId: req.user.id });

    const isSeekerOwner = seeker && booking.seekerId._id.toString() === seeker._id.toString();
    const isProviderOwner = provider && booking.providerId._id.toString() === provider._id.toString();

    if (!isSeekerOwner && !isProviderOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking'
    });
  }
};

/**
 * Accept a booking request
 * @route PATCH /api/bookings/:id/accept
 * @access Private (provider only)
 */
const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const booking = await Booking.findById(id)
      .populate('seekerId', 'name userId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify booking belongs to this provider
    if (booking.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Verify booking is pending
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept booking with status '${booking.status}'`
      });
    }

    // Update booking status
    booking.status = 'accepted';
    booking.updatedAt = new Date();
    await booking.save();

    // Get seeker's user ID for notification
    const seekerDoc = await ServiceSeeker.findById(booking.seekerId._id);

    // Create notification for seeker
    const notification = new Notification({
      userId: seekerDoc.userId,
      bookingId: booking._id,
      title: 'Booking Accepted',
      message: `Your booking for ${new Date(booking.bookingDate).toLocaleDateString()} has been accepted by ${provider.businessName}`,
      category: 'booking',
      type: 'success',
      actionUrl: `/user/bookings`,
      metadata: {
        bookingId: booking._id,
        providerName: provider.businessName,
        status: 'accepted'
      }
    });

    await notification.save();

    // Emit socket event to seeker
    socketManager.emitToUser(seekerDoc.userId.toString(), 'booking:accepted', {
      booking: {
        id: booking._id,
        status: 'accepted',
        providerName: provider.businessName,
        date: booking.bookingDate,
        time: booking.bookingTime
      },
      notification: {
        id: notification._id,
        title: notification.title,
        message: notification.message
      }
    });

    res.json({
      success: true,
      message: 'Booking accepted successfully',
      data: booking
    });

  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept booking'
    });
  }
};

/**
 * Reject a booking request
 * @route PATCH /api/bookings/:id/reject
 * @access Private (provider only)
 */
const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const booking = await Booking.findById(id)
      .populate('seekerId', 'name userId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify booking belongs to this provider
    if (booking.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Verify booking is pending
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject booking with status '${booking.status}'`
      });
    }

    // Update booking status
    booking.status = 'rejected';
    booking.cancellationReason = reason || 'Provider declined the booking';
    booking.cancelledBy = 'provider';
    booking.updatedAt = new Date();
    await booking.save();

    // Get seeker's user ID for notification
    const seekerDoc = await ServiceSeeker.findById(booking.seekerId._id);

    // Create notification for seeker
    const notification = new Notification({
      userId: seekerDoc.userId,
      bookingId: booking._id,
      title: 'Booking Rejected',
      message: `Your booking for ${new Date(booking.bookingDate).toLocaleDateString()} has been rejected${reason ? ': ' + reason : ''}`,
      category: 'booking',
      type: 'error',
      actionUrl: `/user/bookings`,
      metadata: {
        bookingId: booking._id,
        providerName: provider.businessName,
        status: 'rejected',
        reason: reason
      }
    });

    await notification.save();

    // Emit socket event to seeker
    socketManager.emitToUser(seekerDoc.userId.toString(), 'booking:rejected', {
      booking: {
        id: booking._id,
        status: 'rejected',
        providerName: provider.businessName,
        reason: reason
      },
      notification: {
        id: notification._id,
        title: notification.title,
        message: notification.message
      }
    });

    res.json({
      success: true,
      message: 'Booking rejected',
      data: booking
    });

  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject booking'
    });
  }
};

/**
 * Cancel a booking
 * @route PATCH /api/bookings/:id/cancel
 * @access Private (seeker or provider)
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking can be cancelled
    if (['cancelled', 'completed', 'rejected'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status '${booking.status}'`
      });
    }

    // Determine who is cancelling
    const seeker = await ServiceSeeker.findOne({ userId: req.user.id });
    const provider = await ServiceProvider.findOne({ userId: req.user.id });

    let cancelledBy;
    let notifyUserId;
    let notifyUserName;

    if (seeker && booking.seekerId.toString() === seeker._id.toString()) {
      cancelledBy = 'seeker';
      // Notify provider
      const providerDoc = await ServiceProvider.findById(booking.providerId);
      notifyUserId = providerDoc.userId;
      notifyUserName = seeker.name;
    } else if (provider && booking.providerId.toString() === provider._id.toString()) {
      cancelledBy = 'provider';
      // Notify seeker
      const seekerDoc = await ServiceSeeker.findById(booking.seekerId);
      notifyUserId = seekerDoc.userId;
      notifyUserName = provider.businessName;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Update booking
    booking.status = 'cancelled';
    booking.cancellationReason = reason || 'Booking cancelled';
    booking.cancelledBy = cancelledBy;
    booking.updatedAt = new Date();
    await booking.save();

    // Create notification
    const notification = new Notification({
      userId: notifyUserId,
      bookingId: booking._id,
      title: 'Booking Cancelled',
      message: `Booking for ${new Date(booking.bookingDate).toLocaleDateString()} has been cancelled by ${cancelledBy === 'seeker' ? 'the customer' : 'the provider'}${reason ? ': ' + reason : ''}`,
      category: 'booking',
      type: 'warning',
      actionUrl: cancelledBy === 'seeker' ? '/service-provider/bookings' : '/user/bookings',
      metadata: {
        bookingId: booking._id,
        cancelledBy: cancelledBy,
        reason: reason
      }
    });

    await notification.save();

    // Emit socket event
    socketManager.emitToUser(notifyUserId.toString(), 'booking:cancelled', {
      booking: {
        id: booking._id,
        status: 'cancelled',
        cancelledBy: cancelledBy,
        reason: reason
      },
      notification: {
        id: notification._id,
        title: notification.title,
        message: notification.message
      }
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
};

/**
 * Complete a booking
 * @route PATCH /api/bookings/:id/complete
 * @access Private (provider only)
 */
const completeBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { providerNotes } = req.body;

    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify booking belongs to this provider
    if (booking.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Check if booking can be completed
    if (!['accepted', 'confirmed', 'in-progress'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot complete booking with status '${booking.status}'`
      });
    }

    // Update booking
    booking.status = 'completed';
    booking.completedAt = new Date();
    booking.providerNotes = providerNotes;
    booking.updatedAt = new Date();
    await booking.save();

    // Get seeker's user ID for notification
    const seekerDoc = await ServiceSeeker.findById(booking.seekerId);

    // Create notification for seeker
    const notification = new Notification({
      userId: seekerDoc.userId,
      bookingId: booking._id,
      title: 'Service Completed',
      message: `Your service for ${new Date(booking.bookingDate).toLocaleDateString()} has been marked as completed by ${provider.businessName}. Please provide your feedback.`,
      category: 'booking',
      type: 'success',
      actionUrl: `/user/bookings`,
      metadata: {
        bookingId: booking._id,
        providerName: provider.businessName,
        status: 'completed'
      }
    });

    await notification.save();

    // Emit socket event to seeker
    socketManager.emitToUser(seekerDoc.userId.toString(), 'booking:completed', {
      booking: {
        id: booking._id,
        status: 'completed',
        providerName: provider.businessName
      },
      notification: {
        id: notification._id,
        title: notification.title,
        message: notification.message
      }
    });

    res.json({
      success: true,
      message: 'Booking marked as completed',
      data: booking
    });

  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete booking'
    });
  }
};

module.exports = {
  createBooking,
  getSeekerBookings,
  getProviderBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  completeBooking
};
