const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    unique: true
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'plumbing', 'electrical', 'carpentry', 'cleaning', 
      'painting', 'appliance-repair', 'moving', 'gardening',
      'pest-control', 'renovation', 'other'
    ]
  },
  
  icon: {
    type: String,
    default: 'default-service-icon.png'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Popularity metrics
  totalProviders: {
    type: Number,
    default: 0
  },
  
  totalBookings: {
    type: Number,
    default: 0
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

// Indexes
serviceSchema.index({ name: 'text', description: 'text' });
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ totalProviders: -1 });

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;