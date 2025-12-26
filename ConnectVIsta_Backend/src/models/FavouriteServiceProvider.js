const mongoose = require('mongoose');

const favoriteServiceProviderSchema = new mongoose.Schema({
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceSeeker',
    required: true
  },
  
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure unique combination
favoriteServiceProviderSchema.index({ seekerId: 1, providerId: 1 }, { unique: true });
favoriteServiceProviderSchema.index({ seekerId: 1 });
favoriteServiceProviderSchema.index({ providerId: 1 });

const FavoriteServiceProvider = mongoose.model('FavoriteServiceProvider', favoriteServiceProviderSchema);
module.exports = FavoriteServiceProvider;