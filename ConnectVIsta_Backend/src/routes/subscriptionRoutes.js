const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const subscriptionController = require('../controllers/subscriptionController');

router.post('/subscribe', auth(['provider']), subscriptionController.createSubscription);
router.get('/my-subscription', auth(['provider']), subscriptionController.getProviderSubscription);
router.post('/cancel', auth(['provider']), subscriptionController.cancelSubscription);
router.get('/all', auth(['admin']), subscriptionController.getAllSubscriptions);

module.exports = router;
