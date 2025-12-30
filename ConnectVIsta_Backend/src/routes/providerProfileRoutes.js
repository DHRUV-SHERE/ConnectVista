const express = require('express');
const router = express.Router();
const {
  getProviderProfile,
  updateProviderProfile,
  uploadBusinessImages,
  deleteBusinessImage,
  getNearbyProviders
} = require('../controllers/providerProfileController');
const auth = require('../middleware/auth');

// Import the CORRECT upload middleware
const uploadBusinessImagesMiddleware = require('../middleware/uploadBusinessImages');

// Get provider profile
router.get('/provider', auth(['provider']), getProviderProfile);

// Update provider profile
router.put('/provider', auth(['provider']), updateProviderProfile);

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

module.exports = router;