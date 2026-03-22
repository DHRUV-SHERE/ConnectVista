const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
  
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  
  bookingTime: {
    type: String,
    required: [true, 'Booking time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time in HH:MM format']
  },
  
  priority: {
    type: String,
    enum: ['normal', 'urgent'],
    default: 'normal'
  },
  
  // Service Address
  serviceAddress: {
    sameAsSeeker: {
      type: Boolean,
      default: true
    },
    street: String,
    city: String,
    state: String,
    pinCode: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  
  additionalNote: {
    type: String,
    trim: true,
    maxlength: [500, 'Note cannot exceed 500 characters']
  },
  // Pricing Details
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },

  visitingCharge: {
    type: Number,
    default: 0,
    min: [0, 'Visiting charge cannot be negative']
  },

  extraCharge: {
    type: Number,
    default: 0,
    min: [0, 'Extra charge cannot be negative']
  },

  platformFee: {
    type: Number,
    default: 0,
    min: [0, 'Platform fee cannot be negative']
  },

  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },

  // Payment Status
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially-refunded', 'visiting-paid', 'fully-paid'],
    default: 'pending'
  },

  paymentMethod: {
    type: String,
    enum: ['stripe', 'razorpay', 'cash', 'bank-transfer', 'online'],
    default: 'stripe'
  },

  paymentId: String,

  // Booking Status
  status: {
    type: String,
    enum: [
      'pending',           // Initial state
      'accepted',          // Provider accepted
      'rejected',          // Provider rejected
      'confirmed',         // Seeker confirmed
      'in-progress',       // Work started
      'completed',         // Work completed
      'cancelled',         // Cancelled by either party
      'disputed'           // Dispute raised
    ],
    default: 'pending'
  },

  rejectionReason: String,

  cancellationReason: String,
  
  cancelledBy: {
    type: String,
    enum: ['seeker', 'provider', 'system', 'admin']
  },
  
  // Completion Details
  completedAt: Date,
  
  finalWorkDetails: [{
    description: String,
    amount: Number
  }],

  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },

  providerNotes: String,
  
  seekerFeedback: String,

  isReviewed: {
    type: Boolean,
    default: false
  },

  reviewReminderDate: Date,
  
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

// Indexes for efficient queries
bookingSchema.index({ seekerId: 1 });
bookingSchema.index({ providerId: 1 });
bookingSchema.index({ serviceId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ 'serviceAddress.coordinates': '2dsphere' });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
