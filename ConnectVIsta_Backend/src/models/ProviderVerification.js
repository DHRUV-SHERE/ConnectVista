const mongoose = require('mongoose');

const providerVerificationSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  
  documents: [{
    documentType: {
      type: String,
      enum: ['business-registration', 'government-id', 'address-proof', 'tax-certificate', 'insurance'],
      required: true
    },
    documentUrl: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: Date,
    rejectionReason: String
  }],
  
  overallStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Admin user
  },
  
  reviewedAt: Date,
  
  rejectionReason: String,
  
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

// Indexes
providerVerificationSchema.index({ providerId: 1 });
providerVerificationSchema.index({ overallStatus: 1 });
providerVerificationSchema.index({ reviewedBy: 1 });

const ProviderVerification = mongoose.model('ProviderVerification', providerVerificationSchema);
module.exports = ProviderVerification;