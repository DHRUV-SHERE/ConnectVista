const GlobalSettings = require('../models/GlobalSettings');
const catchAsync = require('../utils/catchAsync');

/**
 * Get global settings
 */
exports.getSettings = catchAsync(async (req, res) => {
  let settings = await GlobalSettings.findOne();
  
  if (!settings) {
    // Create default settings if not exists
    settings = await GlobalSettings.create({});
  }

  res.status(200).json({
    success: true,
    data: settings
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
