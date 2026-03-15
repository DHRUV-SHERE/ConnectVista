const mongoose = require('mongoose');

const payoutRequestSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  payoutDate: {
    type: Date
  },
  transactionReference: {
    type: String // To store bank transaction ID
  },
  remarks: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('PayoutRequest', payoutRequestSchema);
