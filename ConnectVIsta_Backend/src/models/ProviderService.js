const mongoose = require('mongoose');

const providerServiceSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },

  mainService: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }
  },

  subServices: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }
  }],

  customService: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },

  minPrice: {
    type: Number,
    required: [true, 'Minimum price is required'],
    min: [0, 'Price cannot be negative']
  },

  maxPrice: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },

  pricingType: {
    type: String,
    enum: ['hourly', 'fixed', 'square-feet', 'project'],
    default: 'fixed'
  },

  isAvailable: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

providerServiceSchema.index({ providerId: 1 }, { unique: true });
providerServiceSchema.index({ 'mainService.name': 1 });
providerServiceSchema.index({ isAvailable: 1 });

const ProviderService = mongoose.model('ProviderService', providerServiceSchema);
module.exports = ProviderService;