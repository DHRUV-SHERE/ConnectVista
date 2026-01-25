const express = require('express');
const { getServices, createService, getAllServices, addProviderService, getProvidersByService, getProviderProfile } = require('../controllers/serviceController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get services with active providers (for user service page)
router.get('/', getServices);

// Get all services (for provider dropdown)
router.get('/all', getAllServices);

// Create new service (for providers)
router.post('/', auth(['provider']), createService);

// Add provider service (for providers to offer services)
router.post('/provider', auth(['provider']), addProviderService);

// Get providers by service
router.get('/:serviceId/providers', getProvidersByService);

// Get provider profile details
router.get('/provider/:providerId', getProviderProfile);

module.exports = router;