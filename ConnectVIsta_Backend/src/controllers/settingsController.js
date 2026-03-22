const GlobalSettings = require('../models/GlobalSettings');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const ProviderSettings = require('../models/ProviderSettings');
const catchAsync = require('../utils/catchAsync');

/**
 * Get user/provider-specific settings along with global settings
 */
exports.getSettings = catchAsync(async (req, res) => {
  const userId = req.user.id;
  
  // Fetch user data
  const user = await User.findById(userId).select('email phone');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Fetch provider data if user is a provider
  const provider = await ServiceProvider.findOne({ userId }).select(
    'name businessName businessAddress businessRegistration'
  );

  // Fetch provider settings
  let providerSettings = null;
  if (provider) {
    providerSettings = await ProviderSettings.findOne({ providerId: provider._id });
    
    // Create default provider settings if not exists
    if (!providerSettings) {
      providerSettings = await ProviderSettings.create({ providerId: provider._id });
    }
  }

  // Fetch global settings
  let globalSettings = await GlobalSettings.findOne();
  if (!globalSettings) {
    globalSettings = await GlobalSettings.create({});
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        email: user.email,
        phone: user.phone
      },
      provider: provider || {},
      settings: providerSettings || {},
      billing: {
        currentPlan: provider?.currentPlan || null,
        paymentMethod: null,
        recentInvoices: []
      },
      global: globalSettings
    }
  });
});

/**
 * Update global settings (Admin only)
 */
exports.updateSettings = catchAsync(async (req, res) => {
  const { commissionPercentage, minPayoutAmount, visitingFee } = req.body;
  
  let settings = await GlobalSettings.findOne();
  
  if (!settings) {
    settings = new GlobalSettings();
  }

  if (commissionPercentage !== undefined) settings.commissionPercentage = commissionPercentage;
  if (minPayoutAmount !== undefined) settings.minPayoutAmount = minPayoutAmount;
  if (visitingFee !== undefined) settings.visitingFee = visitingFee;
  
  settings.updatedBy = req.user.id;
  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Global settings updated successfully',
    data: settings
  });
});
