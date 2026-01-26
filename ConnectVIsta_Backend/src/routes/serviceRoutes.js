const express = require('express');
const {
  getCategories,
  getSubServices,
  getProviderService,
  saveProviderService,
  deleteProviderService
} = require('../controllers/serviceController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all active categories (with optional provider counts)
router.get('/categories', getCategories);

// Get sub-services by category
router.get('/categories/:categoryId/sub-services', getSubServices);

// Provider service management routes (protected)
router.get('/provider/service', auth(['provider']), getProviderService);
router.post('/provider/service', auth(['provider']), saveProviderService);
router.delete('/provider/service', auth(['provider']), deleteProviderService);

module.exports = router;
