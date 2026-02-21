const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const ProviderSettings = require('../models/ProviderSettings');
const bcrypt = require('bcryptjs');

// Get provider settings
const getProviderSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const provider = await ServiceProvider.findOne({ userId: req.user.id });
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

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        provider: {
          businessName: provider.businessName,
          businessAddress: provider.businessAddress
        },
        settings
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

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-password');

    if (businessLocation) {
      await ServiceProvider.findOneAndUpdate(
        { userId: req.user.id },
        { 'businessAddress.street': businessLocation }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
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

    const user = await User.findById(req.user.id);
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

module.exports = {
  getProviderSettings,
  updateProfileInfo,
  changePassword,
  updateNotifications,
  updatePrivacy
};
