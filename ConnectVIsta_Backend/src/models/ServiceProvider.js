const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },

  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },

  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },

  experienceYears: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    default: 0
  },

  // Business Address
  businessAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pinCode: {
      type: String,
      required: [true, 'Pin code is required'],
      trim: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0] // [longitude, latitude]
      }
    }
  },

  languages: [{
    type: String,
    trim: true
  }],

  // Ratings
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    breakdown: {
      '1': { type: Number, default: 0 },
      '2': { type: Number, default: 0 },
      '3': { type: Number, default: 0 },
      '4': { type: Number, default: 0 },
      '5': { type: Number, default: 0 }
    }
  },

  // Pricing
  startingPrice: {
    type: Number,
    required: [true, 'Starting price is required'],
    min: [0, 'Price cannot be negative']
  },

  emergencyCharge: {
    type: Number,
    default: 0,
    min: [0, 'Emergency charge cannot be negative']
  },

  extraChargeNote: {
    type: String,
    trim: true
  },

  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },

  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // Stats
  totalJobsCompleted: {
    type: Number,
    default: 0
  },

  totalEarnings: {
    type: Number,
    default: 0
  },

  platformEarnings: {
    type: Number,
    default: 0
  },
// Add this to your ServiceProvider schema
businessImages: [{
  url: {
    type: String,
    required: true
  },
  filename: {
    type: String
  },
  originalName: {
    type: String
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}],

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

// Indexes for geospatial queries and search
serviceProviderSchema.index({ 'businessAddress.coordinates': '2dsphere' });
// serviceProviderSchema.index({ userId: 1 });
serviceProviderSchema.index({ isVerified: 1 });
serviceProviderSchema.index({ rating: -1 });
serviceProviderSchema.index({ businessName: 'text', description: 'text' });
serviceProviderSchema.index({ 'businessAddress.city': 1 });
serviceProviderSchema.index({ 'businessAddress.state': 1 });

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
module.exports = ServiceProvider;