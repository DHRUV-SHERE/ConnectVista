const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const subscriptionController = require('../controllers/subscriptionController');

router.post('/subscribe', auth(['provider']), subscriptionController.createSubscription);
router.get('/my-subscription', auth(['provider']), subscriptionController.getProviderSubscription);
router.post('/cancel', auth(['provider']), subscriptionController.cancelSubscription);
router.get('/all', auth(['admin']), subscriptionController.getAllSubscriptions);

// Manual test endpoint for cron job (for testing/debugging)
router.get('/test-cron', async (req, res) => {
  try {
    console.log('🧪 Manual subscription cron test triggered');
    const cronModule = require('../services/subscriptionCron');
    await cronModule.checkExpiringSubscriptions();
    res.json({ 
      success: true, 
      message: 'Subscription cron job executed manually. Check server logs for details.' 
    });
  } catch (error) {
    console.error('❌ Error running manual cron:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error executing cron job',
      error: error.message 
    });
  }
});

module.exports = router;
