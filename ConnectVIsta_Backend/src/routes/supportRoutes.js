const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const auth = require('../middleware/auth');

// Provider routes
router.post('/', auth('provider'), supportController.createSupportRequest);
router.get('/my-requests', auth('provider'), supportController.getProviderSupportRequests);
router.get('/my-requests/:id', auth('provider'), supportController.getSupportRequestById);

// Admin routes
router.get('/stats', auth('admin'), supportController.getSupportStats);
router.get('/', auth('admin'), supportController.getAllSupportRequests);
router.get('/:id', auth('admin'), supportController.getSupportRequestById);
router.patch('/:id', auth('admin'), supportController.updateSupportRequest);
router.delete('/:id', auth('admin'), supportController.deleteSupportRequest);

module.exports = router;
