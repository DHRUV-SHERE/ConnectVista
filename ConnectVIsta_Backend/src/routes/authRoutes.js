const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { signupValidation, loginValidation } = require('../middleware/validation');

// Public routes
router.post('/signup', signupValidation, authController.signup);
router.post('/login', loginValidation, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes

router.get('/profile', auth(), authController.getProfile);
router.put('/profile', auth(), authController.updateProfile);
router.put('/change-password', auth(), authController.changePassword);

// Admin only route
router.get('/admin/users', auth(['admin']), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

module.exports = router;