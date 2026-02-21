const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  plan: { type: String, required: true },
  duration: { type: String, enum: ['monthly', 'yearly'], required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet'], required: true },
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
  transactionId: { type: String, unique: true },
  cardLast4: String,
  cardType: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
