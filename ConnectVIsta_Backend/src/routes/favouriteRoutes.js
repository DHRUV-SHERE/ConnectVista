const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favouriteController');
const auth = require('../middleware/auth');

// All routes require authentication and seeker role
router.use(auth(['seeker']));

// Get all favorite providers for logged-in seeker
router.get('/', favouriteController.getFavoriteProviders);

// Add a provider to favorites
router.post('/', favouriteController.addFavoriteProvider);

// Remove a provider from favorites
router.delete('/:providerId', favouriteController.removeFavoriteProvider);

// Check if a specific provider is favorited
router.get('/check/:providerId', favouriteController.isFavorite);

// Bulk check favorite statuses for multiple providers
router.post('/check-bulk', favouriteController.getFavoriteStatuses);

module.exports = router;
