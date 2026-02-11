const express = require('express');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/notifications
 * @desc    Get user's notifications
 * @access  Private
 * @query   page - Page number for pagination
 * @query   limit - Results per page
 * @query   category - Filter by category (booking, payment, verification, system, promotion, review)
 * @query   isRead - Filter by read status (true/false)
 */
router.get('/', auth(), getNotifications);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get count of unread notifications
 * @access  Private
 */
router.get('/unread-count', auth(), getUnreadCount);

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.patch('/read-all', auth(), markAllAsRead);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a single notification as read
 * @access  Private
 */
router.patch('/:id/read', auth(), markAsRead);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete('/:id', auth(), deleteNotification);

module.exports = router;
