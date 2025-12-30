// routes/seekerRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const seekerController = require('../controllers/seekerProfileController');

// Get seeker profile
router.get('/profile', auth(['seeker']), seekerController.getSeekerProfile);

// Create or update seeker profile
router.put('/profile', auth(['seeker']), seekerController.updateSeekerProfile);

// Update live location coordinates
router.post('/location', auth(['seeker']), seekerController.updateLocation);

// Clear location (optional)
router.delete('/location', auth(['seeker']), seekerController.clearLocation);

module.exports = router;