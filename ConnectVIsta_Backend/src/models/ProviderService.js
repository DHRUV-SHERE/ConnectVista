const mongoose = require('mongoose');

const providerServiceSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  
  specialization: {
    type: String,
    trim: true
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
  
  // Pricing type
  pricingType: {
    type: String,
    enum: ['hourly', 'fixed', 'square-feet', 'project'],
    default: 'fixed'
  },
  
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure unique provider-service combination
providerServiceSchema.index({ providerId: 1, serviceId: 1 }, { unique: true });

const ProviderService = mongoose.model('ProviderService', providerServiceSchema);
module.exports = ProviderService;