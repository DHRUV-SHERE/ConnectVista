const Message = require('../models/Message');
const Booking = require('../models/Booking');
const socketManager = require('../utils/socketManager');
const catchAsync = require('../utils/catchAsync');

/**
 * Get messages for a specific booking
 */
exports.getMessages = catchAsync(async (req, res) => {
  const { bookingId } = req.params;

  // Verify booking exists and user is part of it
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Check if user is seeker or provider for this booking
  // We need to find the seeker and provider profiles to compare with req.user.id
  // But wait, the booking model stores seekerId and providerId which are profile IDs, not user IDs.
  // We need to populate them to check the userId.
  
  const populatedBooking = await Booking.findById(bookingId)
    .populate('seekerId', 'userId')
    .populate('providerId', 'userId');

  const isSeeker = populatedBooking.seekerId.userId.toString() === req.user.id;
  const isProvider = populatedBooking.providerId.userId.toString() === req.user.id;

  if (!isSeeker && !isProvider) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view messages for this booking'
    });
  }

  const messages = await Message.find({ bookingId })
    .sort({ createdAt: 1 })
    .populate('senderId', 'name profileImage');

  res.status(200).json({
    success: true,
    data: messages
  });
});

/**
 * Send a message
 */
exports.sendMessage = catchAsync(async (req, res) => {
  const { bookingId, message, attachments } = req.body;

  const booking = await Booking.findById(bookingId)
    .populate('seekerId', 'userId')
    .populate('providerId', 'userId');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  const isSeeker = booking.seekerId.userId.toString() === req.user.id;
  const isProvider = booking.providerId.userId.toString() === req.user.id;

  if (!isSeeker && !isProvider) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to send messages for this booking'
    });
  }

  const receiverId = isSeeker ? booking.providerId.userId : booking.seekerId.userId;

  const newMessage = await Message.create({
    bookingId,
    senderId: req.user.id,
    receiverId,
    message,
    attachments
  });

  // Emit socket event to receiver
  socketManager.emitToUser(receiverId.toString(), 'chat:message', {
    bookingId,
    message: newMessage,
    senderName: req.user.name
  });

  res.status(201).json({
    success: true,
    data: newMessage
  });
});

/**
 * Get all conversations for the current user
 */
exports.getConversations = catchAsync(async (req, res) => {
  // Find all bookings where user is seeker or provider
  // This is a bit complex because we need to check both seekerId and providerId
  // which are references to different models.
  
  // Actually, it's easier to find the profile first.
  const ServiceSeeker = require('../models/ServiceSeeker');
  const ServiceProvider = require('../models/ServiceProvider');

  const seekerProfile = await ServiceSeeker.findOne({ userId: req.user.id });
  const providerProfile = await ServiceProvider.findOne({ userId: req.user.id });

  const query = [];
  if (seekerProfile) query.push({ seekerId: seekerProfile._id });
  if (providerProfile) query.push({ providerId: providerProfile._id });

  if (query.length === 0) {
    return res.status(200).json({
      success: true,
      data: []
    });
  }

  const bookings = await Booking.find({ $or: query })
    .populate('seekerId', 'name profileImage userId')
    .populate('providerId', 'name businessName profileImage userId')
    .sort({ updatedAt: -1 });

  // For each booking, get the last message
  const conversations = await Promise.all(bookings.map(async (booking) => {
    const lastMessage = await Message.findOne({ bookingId: booking._id })
      .sort({ createdAt: -1 });
    
    // Only return bookings that have messages OR are active
    if (!lastMessage && !['pending', 'accepted', 'confirmed', 'in-progress'].includes(booking.status)) {
      return null;
    }

    const otherUser = req.user.id === booking.seekerId.userId.toString() 
      ? { name: booking.providerId.businessName || booking.providerId.name, profileImage: booking.providerId.profileImage, userId: booking.providerId.userId }
      : { name: booking.seekerId.name, profileImage: booking.seekerId.profileImage, userId: booking.seekerId.userId };

    return {
      bookingId: booking._id,
      status: booking.status,
      otherUser,
      lastMessage: lastMessage ? lastMessage.message : 'No messages yet',
      lastMessageTime: lastMessage ? lastMessage.createdAt : booking.updatedAt,
      unreadCount: 0 // TODO: Implement unread count
    };
  }));

  res.status(200).json({
    success: true,
    data: conversations.filter(c => c !== null)
  });
});
