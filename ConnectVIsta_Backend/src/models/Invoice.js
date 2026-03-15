const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceSeeker',
    required: true
  },
  items: [{
    description: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
  visitingCharge: {
    type: Number,
    default: 0
  },
  subTotal: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    required: true // 2% of grand total
  },
  grandTotal: {
    type: Number,
    required: true
  },
  netEarnings: {
    type: Number, // grandTotal - platformFee
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  pdfUrl: {
    type: String
  }
}, { timestamps: true });

// Generate unique invoice number before saving
const generateInvoiceNumber = function(doc) {
  if (!doc.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    doc.invoiceNumber = `CV-${year}${month}-${random}`;
  }
};

invoiceSchema.pre('validate', function(next) {
  generateInvoiceNumber(this);
  if (typeof next === 'function') next();
});

invoiceSchema.pre('save', function(next) {
  generateInvoiceNumber(this);
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
