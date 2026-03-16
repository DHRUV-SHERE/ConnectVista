const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const ServiceProvider = require('../models/ServiceProvider');
const WalletTransaction = require('../models/WalletTransaction');

// Create Invoice and finalize booking
exports.generateInvoice = async (req, res) => {
  console.log('📄 Generating invoice for booking:', req.body.bookingId);
  const { bookingId, items, paymentMethod } = req.body;

  const booking = await Booking.findById(bookingId).populate('seekerId');
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  const provider = await ServiceProvider.findOne({ userId: req.user.id });
  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found' });
  }

  // Calculate totals
  const subTotal = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const visitingCharge = booking.visitingCharge || 0;
  const grandTotal = subTotal + visitingCharge;
  const platformFee = grandTotal * 0.02; // 2% platform fee
  const netEarnings = grandTotal - platformFee;

  // Check Wallet for Cash Payment
  if (paymentMethod === 'cash') {
    if (provider.walletBalance < 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wallet balance low. Top up at least ₹100 to accept cash payments.' 
      });
    }
    if (provider.walletBalance < platformFee) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient wallet balance for platform fee (₹${platformFee.toFixed(2)}).` 
      });
    }
  }

  // Create Invoice
  const invoice = await Invoice.create({
    bookingId,
    providerId: provider._id,
    seekerId: booking.seekerId._id,
    items,
    visitingCharge,
    subTotal,
    platformFee,
    grandTotal,
    netEarnings,
    paymentMethod,
    paymentStatus: paymentMethod === 'cash' ? 'paid' : 'pending'
  });

  // Update Booking
  booking.status = 'completed';
  booking.paymentMethod = paymentMethod;
  booking.paymentStatus = paymentMethod === 'cash' ? 'fully-paid' : 'pending';
  booking.totalPrice = grandTotal;
  booking.platformFee = platformFee;
  booking.finalWorkDetails = items;
  booking.invoiceId = invoice._id;
  booking.completedAt = Date.now();
  await booking.save();

  // Financial Transaction Logic
  if (paymentMethod === 'cash') {
    // Deduct 2% from provider's prepaid wallet
    provider.walletBalance -= platformFee;
    provider.totalEarnings += grandTotal;
    provider.platformEarnings += platformFee;
    provider.totalJobsCompleted += 1;
    await provider.save();

    // Record transaction
    await WalletTransaction.create({
      providerId: provider._id,
      type: 'commission_deduction',
      amount: -platformFee,
      balanceAfter: provider.walletBalance,
      bookingId: booking._id,
      invoiceId: invoice._id,
      description: `Platform fee (2%) deducted for Cash Payment (Invoice ${invoice.invoiceNumber})`
    });
  }

  res.status(201).json({
    success: true,
    message: 'Invoice generated successfully',
    data: invoice
  });
};

// Complete Online Payment (Simulated)
exports.completeOnlinePayment = async (req, res) => {
  console.log('💳 Completing online payment for invoice:', req.params.invoiceId);
  const { invoiceId } = req.params;

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    return res.status(404).json({ success: false, message: 'Invoice not found' });
  }

  if (invoice.paymentStatus === 'paid') {
    return res.status(400).json({ success: false, message: 'Invoice already paid' });
  }

  const provider = await ServiceProvider.findById(invoice.providerId);
  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found' });
  }

  const booking = await Booking.findById(invoice.bookingId);

  // Update Invoice
  invoice.paymentStatus = 'paid';
  await invoice.save();

  // Update Booking
  if (booking) {
    booking.paymentStatus = 'fully-paid';
    await booking.save();
  }

  // Update Provider Stats & Earnings
  // For online payment, net earnings go to pendingEarnings for weekly transfer
  provider.pendingEarnings += invoice.netEarnings;
  provider.totalEarnings += invoice.grandTotal;
  provider.platformEarnings += invoice.platformFee;
  provider.totalJobsCompleted += 1;
  await provider.save();

  // Record Transaction
  await WalletTransaction.create({
    providerId: provider._id,
    type: 'online_earning',
    amount: invoice.netEarnings,
    balanceAfter: provider.walletBalance, // Wallet balance remains same as this is pending earnings
    bookingId: invoice.bookingId,
    invoiceId: invoice._id,
    description: `Online payment received (Net: ₹${invoice.netEarnings.toFixed(2)}) for Invoice ${invoice.invoiceNumber}. Will be transferred weekly.`
  });

  res.status(200).json({
    success: true,
    message: 'Payment completed successfully',
    data: invoice
  });
};

// Get Invoices for Provider
exports.getProviderInvoices = async (req, res) => {
  const provider = await ServiceProvider.findOne({ userId: req.user.id });
  const invoices = await Invoice.find({ providerId: provider._id })
    .populate('seekerId', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: invoices
  });
};

// Get Invoices for Seeker
exports.getSeekerInvoices = async (req, res) => {
  const ServiceSeeker = require('../models/ServiceSeeker');
  const seeker = await ServiceSeeker.findOne({ userId: req.user.id });
  if (!seeker) {
    return res.status(404).json({ success: false, message: 'Seeker profile not found' });
  }

  const invoices = await Invoice.find({ seekerId: seeker._id })
    .populate('providerId', 'name businessName')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: invoices
  });
};
