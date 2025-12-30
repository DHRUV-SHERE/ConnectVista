const mongoose = require('mongoose');

const serviceSeekerSchema = new mongoose.Schema({
  user: {
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
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  // Consolidated address structure
  address: {
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
        default: null // Allow null - won't create Point unless we have real coordinates
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: null // Allow null - no default coordinates
      }
    }
  },
  profileImage: {
    type: String,
    default: 'default-avatar.png'
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    emailUpdates: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for location-based searches
serviceSeekerSchema.index({ 'address.city': 1, 'address.state': 1 });
// Remove or modify this index since coordinates might be null
// serviceSeekerSchema.index({ 'address.coordinates': '2dsphere' });

const ServiceSeeker = mongoose.model('ServiceSeeker', serviceSeekerSchema);
module.exports = ServiceSeeker;