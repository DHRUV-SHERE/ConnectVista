const mongoose = require('mongoose');

const globalSettingsSchema = new mongoose.Schema({
  commissionPercentage: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  minPayoutAmount: {
    type: Number,
    default: 500,
    min: 0
  },
  visitingFee: {
    type: Number,
    default: 200
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const GlobalSettings = mongoose.model('GlobalSettings', globalSettingsSchema);

module.exports = GlobalSettings;
