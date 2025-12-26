const mongoose = require('mongoose');

const providerScheduleSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true,
    unique: true
  },
  
  responseTime: {
    type: String,
    enum: ['within-30-min', 'within-1-hour', 'within-2-hours', 'within-4-hours', 'next-day'],
    default: 'within-2-hours'
  },
  
  serviceAreaRadius: {
    type: Number,
    default: 10, // kilometers
    min: [1, 'Service area radius must be at least 1km'],
    max: [100, 'Service area radius cannot exceed 100km']
  },
  
  weeklySchedule: {
    monday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    tuesday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    wednesday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    thursday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    friday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' }
    },
    saturday: {
      isAvailable: { type: Boolean, default: false },
      startTime: { type: String, default: '10:00' },
      endTime: { type: String, default: '16:00' }
    },
    sunday: {
      isAvailable: { type: Boolean, default: false },
      startTime: { type: String, default: '10:00' },
      endTime: { type: String, default: '14:00' }
    }
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

const ProviderSchedule = mongoose.model('ProviderSchedule', providerScheduleSchema);
module.exports = ProviderSchedule;