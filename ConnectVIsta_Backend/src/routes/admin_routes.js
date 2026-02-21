const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/admin_controller');

router.get('/dashboard/stats', auth(['admin']), adminController.getDashboardStats);

router.get('/users', auth(['admin']), adminController.getAllUsers);

router.get('/providers', auth(['admin']), adminController.getAllProviders);

router.get('/seekers', auth(['admin']), adminController.getAllSeekers);

router.patch('/users/:id/status', auth(['admin']), adminController.updateUserStatus);

router.get('/bookings', auth(['admin']), adminController.getAllBookings);

router.get('/revenue', auth(['admin']), adminController.getRevenueData);

router.get('/verifications', auth(['admin']), adminController.getVerifications);

router.patch('/verifications/:id', auth(['admin']), adminController.updateVerification);

module.exports = router;
