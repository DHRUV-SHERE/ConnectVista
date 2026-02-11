const express = require('express');
const {
  getServicesWithPriceRange,
  getNearbyProviders,
  getProviderDetails
} = require('../controllers/seekerServiceController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/seeker/services
 * @desc    Get all service categories with aggregated price ranges
 * @access  Protected (seeker only)
 */
router.get('/services', auth(['seeker']), getServicesWithPriceRange);

/**
 * @route   GET /api/seeker/services/:categoryId/providers
 * @desc    Get nearby providers for a specific service category
 * @access  Protected (seeker only)
 * @query   lat - Seeker latitude (required)
 * @query   lng - Seeker longitude (required)
 * @query   radius - Search radius in km (default: 15, max: 50)
 * @query   sortBy - Sort order: distance|rating|price-low|price-high|experience
 * @query   page - Page number for pagination
 * @query   limit - Results per page (max: 50)
 */
router.get('/services/:categoryId/providers', auth(['seeker']), getNearbyProviders);

/**
 * @route   GET /api/seeker/providers/:providerId
 * @desc    Get detailed provider profile with portfolio, reviews, and schedule
 * @access  Protected (seeker only)
 */
router.get('/providers/:providerId', auth(['seeker']), getProviderDetails);

module.exports = router;
