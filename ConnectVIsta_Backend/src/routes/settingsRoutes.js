const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/auth');

// Get settings - Authenticated users only
router.get('/', auth(), settingsController.getSettings);

// Update settings - Admin only
router.patch('/', auth('admin'), settingsController.updateSettings);

module.exports = router;
