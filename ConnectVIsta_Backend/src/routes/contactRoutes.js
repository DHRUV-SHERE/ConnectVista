const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middleware/auth');

// Public endpoint - submit contact form
router.post('/', contactController.submitContact);

// Admin endpoints
router.get('/stats', auth('admin'), contactController.getContactStats);
router.get('/', auth('admin'), contactController.getAllContacts);
router.get('/:id', auth('admin'), contactController.getContactById);
router.patch('/:id', auth('admin'), contactController.updateContact);
router.delete('/:id', auth('admin'), contactController.deleteContact);

module.exports = router;
