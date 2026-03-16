const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const socketManager = require('../utils/socketManager');

/**
 * Get user's notifications
 * @route GET /api/notifications
 * @access Private
 */
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, isRead } = req.query;
    const userId = req.user.id;

    const query = { userId };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .populate('bookingId', 'bookingDate bookingTime status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get unread notification count
 * @route GET /api/notifications/unread-count
 * @access Private
 */
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.countDocuments({
      userId,
      isRead: false
    });

    res.json({
      success: true,
      data: { unreadCount: count }
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count'
    });
  }
};

/**
 * Get category-specific unread counts
 * @route GET /api/notifications/category-counts
 * @access Private
 */
const getCategoryCounts = async (req, res) => {
  try {
    const userId = req.user.id;

    const counts = await Notification.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), isRead: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countsMap = {
      total: 0,
      booking: 0,
      payment: 0,
      verification: 0,
      system: 0,
      promotion: 0,
      review: 0
    };

    counts.forEach(c => {
      countsMap[c._id] = c.count;
      countsMap.total += c.count;
    });

    res.json({
      success: true,
      data: countsMap
    });

  } catch (error) {
    console.error('Get category counts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category counts'
    });
  }
};

/**
 * Mark all notifications in a category as read
 * @route PATCH /api/notifications/read-category/:category
 * @access Private
 */
const markByCategoryAsRead = async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user.id;

    await Notification.updateMany(
      { userId, category, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    // Get updated counts for all categories
    const counts = await Notification.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), isRead: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countsMap = {
      total: 0,
      booking: 0,
      payment: 0,
      verification: 0,
      system: 0,
      promotion: 0,
      review: 0
    };

    counts.forEach(c => {
      countsMap[c._id] = c.count;
      countsMap.total += c.count;
    });

    // Emit updated counts to user
    socketManager.emitToUser(userId.toString(), 'notification:counts', countsMap);

    res.json({
      success: true,
      message: `Notifications in ${category} marked as read`,
      data: countsMap
    });

  } catch (error) {
    console.error('Mark by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark category as read'
    });
  }
};

/**
 * Mark a notification as read
 * @route PATCH /api/notifications/:id/read
 * @access Private
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({ _id: id, userId });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();

      // Get updated unread count and emit to user
      const unreadCount = await Notification.countDocuments({
        userId,
        isRead: false
      });
      socketManager.emitToUser(userId.toString(), 'notification:count', { count: unreadCount });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

/**
 * Mark all notifications as read
 * @route PATCH /api/notifications/read-all
 * @access Private
 */
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    // Emit updated count (0) to user
    socketManager.emitToUser(userId.toString(), 'notification:count', { count: 0 });

    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      data: { modifiedCount: result.modifiedCount }
    });

  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
};

/**
 * Delete a notification
 * @route DELETE /api/notifications/:id
 * @access Private
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({ _id: id, userId });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  getCategoryCounts,
  markByCategoryAsRead,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
