const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const ProviderSettings = require('../models/ProviderSettings');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const bcrypt = require('bcryptjs');

// Get provider settings
const getProviderSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    let settings = await ProviderSettings.findOne({ providerId: provider._id });

    if (!settings) {
      settings = await ProviderSettings.create({
        providerId: provider._id,
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        privacy: {
          profileVisibility: 'public'
        }
      });
    }

    // Get billing info
    const currentSubscription = await Subscription.findOne({ 
      providerId: provider._id, 
      status: 'active' 
    });

    const recentInvoices = await Payment.find({ 
      userId: req.user.id 
    }).sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        user: {
          email: user.email,
          phone: user.phone
        },
        provider: {
          name: provider.name,
          businessName: provider.businessName,
          businessAddress: provider.businessAddress,
          businessRegistration: provider.businessRegistration
        },
        settings,
        billing: {
          currentPlan: currentSubscription ? {
            plan: currentSubscription.plan,
            amount: currentSubscription.amount,
            duration: currentSubscription.duration,
            endDate: currentSubscription.endDate
          } : null,
          paymentMethod: currentSubscription && currentSubscription.paymentDetails ? {
            cardLast4: currentSubscription.paymentDetails.cardLast4,
            cardType: currentSubscription.paymentDetails.cardType
          } : null,
          recentInvoices
        }
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
};

// Update profile information
const updateProfileInfo = async (req, res) => {
  try {
    const { name, phone, businessLocation } = req.body;

    // Update user phone
    await User.findByIdAndUpdate(
      req.user.id,
      { phone },
      { new: true, runValidators: true }
    );

    // Update provider name and location
    const updateData = {};
    if (name) updateData.name = name;
    if (businessLocation) updateData['businessAddress.street'] = businessLocation;

    await ServiceProvider.findOneAndUpdate(
      { userId: req.user.id },
      updateData
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

// Update notification settings
const updateNotifications = async (req, res) => {
  try {
    const { email, sms, push } = req.body;
    const provider = await ServiceProvider.findOne({ userId: req.user.id });

    const settings = await ProviderSettings.findOneAndUpdate(
      { providerId: provider._id },
      {
        'notifications.email': email,
        'notifications.sms': sms,
        'notifications.push': push
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Notification settings updated',
      data: settings
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications'
    });
  }
};

// Update privacy settings
const updatePrivacy = async (req, res) => {
  try {
    const { profileVisibility } = req.body;
    const provider = await ServiceProvider.findOne({ userId: req.user.id });

    const settings = await ProviderSettings.findOneAndUpdate(
      { providerId: provider._id },
      { 'privacy.profileVisibility': profileVisibility },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Privacy settings updated',
      data: settings
    });
  } catch (error) {
    console.error('Update privacy error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update privacy'
    });
  }
};

// Download all user data
const downloadData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    const settings = await ProviderSettings.findOne({ providerId: provider._id });
    const subscriptions = await Subscription.find({ providerId: provider._id });
    const payments = await Payment.find({ userId: req.user.id });

    const data = {
      account: user,
      profile: provider,
      settings: settings,
      subscriptions: subscriptions,
      billingHistory: payments,
      downloadDate: new Date()
    };

    res.json(data);
  } catch (error) {
    console.error('Download data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to prepare data for download'
    });
  }
};

module.exports = {
  getProviderSettings,
  updateProfileInfo,
  changePassword,
  updateNotifications,
  updatePrivacy,
  downloadData
};
