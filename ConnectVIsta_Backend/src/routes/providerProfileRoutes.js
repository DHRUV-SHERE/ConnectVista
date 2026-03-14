const express = require('express');
const router = express.Router();
const {
  getProviderProfile,
  updateProviderProfile,
  updateProviderServices,
  uploadBusinessImages,
  deleteBusinessImage,
  getNearbyProviders,
  getProviderDashboardStats,
  getRecentServices
} = require('../controllers/providerProfileController');
const auth = require('../middleware/auth');

// Import the CORRECT upload middleware
const uploadBusinessImagesMiddleware = require('../middleware/uploadBusinessImages');

// Get provider profile
router.get('/provider', auth(['provider']), getProviderProfile);

// Update provider profile
router.put('/provider', auth(['provider']), updateProviderProfile);

// Update provider services
router.put('/provider/services', auth(['provider']), updateProviderServices);

// Upload business images - use the Cloudinary middleware
router.post('/provider/images', 
  auth(['provider']), 
  uploadBusinessImagesMiddleware.array('images', 10), 
  uploadBusinessImages
);

// Delete business image
router.delete('/provider/images/:imageIndex', auth(['provider']), deleteBusinessImage);

// NEW: Get nearby providers (accessible by seekers)
router.get('/nearby', auth(['seeker']), getNearbyProviders);

// Dashboard routes
router.get('/dashboard/stats', auth(['provider']), getProviderDashboardStats);
router.get('/dashboard/recent-services', auth(['provider']), getRecentServices);

module.exports = router;