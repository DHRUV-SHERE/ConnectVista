const express = require('express');
const router = express.Router();
const { generateInvoice, getProviderInvoices, getSeekerInvoices } = require('../controllers/invoiceController');
const auth = require('../middleware/auth');

// Provider Invoice Routes
router.post('/generate', auth(['provider']), generateInvoice);
router.get('/provider', auth(['provider']), getProviderInvoices);

// Seeker Invoice Routes
router.get('/seeker', auth(['seeker']), getSeekerInvoices);

module.exports = router;
