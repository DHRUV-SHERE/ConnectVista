const cron = require('node-cron');
const ServiceProvider = require('../models/ServiceProvider');
const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');

/**
 * Subscription Expiry Notification Cron Job
 * Runs daily at midnight to check for expiring subscriptions
 * 
 * Installation: npm install node-cron
 */

// Check subscriptions expiring soon and mark expired ones
async function checkExpiringSubscriptions() {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    console.log('🔍 Checking for expiring subscriptions...');

    // Find all active subscriptions
    const activeSubscriptions = await Subscription.find({
      status: 'active'
    }).populate('providerId');

    let notificationsCount = 0;
    let expiredCount = 0;

    for (const subscription of activeSubscriptions) {
      const expiryDate = new Date(subscription.endDate);
      const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

      // Handle expired subscriptions
      if (daysUntilExpiry < 0) {
        // Mark subscription as expired
        await Subscription.findByIdAndUpdate(subscription._id, { status: 'expired' });
        
        // Remove discount from provider profile (clear currentPlan and planExpiresAt)
        await ServiceProvider.findByIdAndUpdate(subscription.providerId._id, {
          currentPlan: null,
          planExpiresAt: null
        });
        
        expiredCount++;
        console.log(`⏱️  Subscription expired for provider: ${subscription.providerId.user}`);
        continue;
      }

      // Send notification 7 days before expiry
      if (daysUntilExpiry >= 6 && daysUntilExpiry <= 8) {
        await createExpiryNotification(
          subscription.providerId.user,
          subscription.plan,
          expiryDate,
          '7 days'
        );
        notificationsCount++;
        console.log(`📧 Sent 7-day expiry notice for plan: ${subscription.plan}`);
      }

      // Send notification 1 day before expiry
      if (daysUntilExpiry >= 0 && daysUntilExpiry <= 2) {
        await createExpiryNotification(
          subscription.providerId.user,
          subscription.plan,
          expiryDate,
          '1 day',
          true // urgent
        );
        notificationsCount++;
        console.log(`📧 Sent 1-day expiry notice for plan: ${subscription.plan}`);
      }
    }

    console.log(`✅ Subscription check complete. Sent ${notificationsCount} notifications, marked ${expiredCount} as expired.`);
  } catch (error) {
    console.error('❌ Error checking expiring subscriptions:', error);
  }
}

// Create expiry notification
async function createExpiryNotification(userId, plan, expiryDate, timeframe, isUrgent = false) {
  try {
    const notification = new Notification({
      user: userId,
      type: 'system',
      message: `Your ${plan} subscription expires in ${timeframe}!`,
      relatedId: null,
      isRead: false,
      metadata: {
        plan: plan,
        expiryDate: expiryDate,
        urgent: isUrgent,
        action: 'renew_subscription',
        link: '/service-provider/subscription'
      }
    });

    await notification.save();
    
    // TODO: Send email notification if email service is configured
    // await sendExpiryEmail(userId, plan, expiryDate, timeframe);
    
  } catch (error) {
    console.error('Error creating expiry notification:', error);
  }
}

// Start the cron job
function startSubscriptionCron() {
  // Run every day at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running subscription expiry check...');
    await checkExpiringSubscriptions();
  });

  console.log('✅ Subscription expiry cron job started');
  console.log('📅 Scheduled: Daily at 00:00 (midnight)');
}

// Manual trigger for testing
async function manualCheckSubscriptions() {
  console.log('🔧 Manual subscription check triggered...');
  await checkExpiringSubscriptions();
}

module.exports = {
  startSubscriptionCron,
  manualCheckSubscriptions,
  checkExpiringSubscriptions
};
