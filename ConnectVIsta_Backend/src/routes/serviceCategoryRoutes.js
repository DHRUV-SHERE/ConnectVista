const express = require('express');
const router = express.Router();
const { getCategories, getSubServices } = require('../controllers/serviceCategoryController');

// Get all categories with provider counts
router.get('/categories', getCategories);

// Get sub-services for a category
router.get('/categories/:categoryId/sub-services', getSubServices);

module.exports = router;