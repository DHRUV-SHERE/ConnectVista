const mongoose = require('mongoose');

const providerPortfolioSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  
  caption: {
    type: String,
    trim: true,
    maxlength: [200, 'Caption cannot exceed 200 characters']
  },
  
  category: {
    type: String,
    enum: ['before', 'after', 'work-in-progress', 'certification', 'other'],
    default: 'other'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
providerPortfolioSchema.index({ providerId: 1 });
providerPortfolioSchema.index({ createdAt: -1 });

const ProviderPortfolio = mongoose.model('ProviderPortfolio', providerPortfolioSchema);
module.exports = ProviderPortfolio;