const mongoose = require('mongoose');

const providerSupportRequestSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: [true, 'Provider ID is required']
  },

  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },

  category: {
    type: String,
    enum: ['technical', 'billing', 'account', 'booking', 'verification', 'other'],
    default: 'other'
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  attachments: [{
    url: String,
    filename: String
  }],

  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },

  adminNotes: {
    type: String,
    trim: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  resolvedAt: {
    type: Date
  }
});

// Index for better query performance
providerSupportRequestSchema.index({ providerId: 1, status: 1 });
providerSupportRequestSchema.index({ createdAt: -1 });
providerSupportRequestSchema.index({ priority: 1, status: 1 });

// Update updatedAt before saving
providerSupportRequestSchema.pre('save', async function() {
  this.updatedAt = Date.now();
  if (this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = Date.now();
  }
});

const ProviderSupportRequest = mongoose.model('ProviderSupportRequest', providerSupportRequestSchema);
module.exports = ProviderSupportRequest;
