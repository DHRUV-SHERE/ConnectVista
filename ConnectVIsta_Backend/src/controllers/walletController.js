const ServiceProvider = require('../models/ServiceProvider');
const WalletTransaction = require('../models/WalletTransaction');
const PayoutRequest = require('../models/PayoutRequest');
const catchAsync = require('../utils/catchAsync'); // Assuming this exists, if not use try-catch

// Get wallet balance and transactions
exports.getWalletDetails = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    const transactions = await WalletTransaction.find({ providerId: provider._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: {
        walletBalance: provider.walletBalance,
        pendingEarnings: provider.pendingEarnings,
        bankDetails: provider.bankDetails,
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Top up wallet (Pre-paid credit for cash payments)
exports.topUpWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    // In a real app, this is where payment gateway logic happens
    // For dummy, we just add it
    provider.walletBalance += parseFloat(amount);
    await provider.save();

    const transaction = await WalletTransaction.create({
      providerId: provider._id,
      type: 'topup',
      amount: parseFloat(amount),
      balanceAfter: provider.walletBalance,
      description: 'Wallet top-up (Dummy Payment)'
    });

    res.status(200).json({
      success: true,
      message: 'Wallet topped up successfully',
      data: {
        newBalance: provider.walletBalance,
        transaction
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Bank Details
exports.updateBankDetails = async (req, res) => {
  try {
    const { accountHolder, accountNumber, bankName, ifscCode } = req.body;
    
    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    provider.bankDetails = { accountHolder, accountNumber, bankName, ifscCode };
    await provider.save();

    res.status(200).json({
      success: true,
      message: 'Bank details updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Manual Payout Request
exports.requestPayout = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    if (provider.pendingEarnings <= 0) {
      return res.status(400).json({ success: false, message: 'No pending earnings to withdraw' });
    }

    if (!provider.bankDetails || !provider.bankDetails.accountNumber) {
      return res.status(400).json({ success: false, message: 'Please update bank details first' });
    }

    const amount = provider.pendingEarnings;
    
    // Create payout request
    const payout = await PayoutRequest.create({
      providerId: provider._id,
      amount,
      bankDetails: provider.bankDetails,
      status: 'pending'
    });

    // Deduct from pending earnings
    provider.pendingEarnings = 0;
    await provider.save();

    // Create wallet transaction record for payout
    await WalletTransaction.create({
      providerId: provider._id,
      type: 'payout',
      amount: -amount,
      balanceAfter: provider.walletBalance, // Note: Payout comes from pendingEarnings, not walletBalance
      description: `Payout request created for ₹${amount}`
    });

    res.status(200).json({
      success: true,
      message: 'Payout request submitted successfully',
      data: payout
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
