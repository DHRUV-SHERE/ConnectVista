const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const ServiceSeeker = require('../models/ServiceSeeker');
const Booking = require('../models/Booking');
const ProviderVerification = require('../models/ProviderVerification');
const auth = require('../middleware/auth');

// Get dashboard stats
router.get('/dashboard/stats', auth(['admin']), async (req, res) => {
  try {
    const [
      totalUsers,
      totalProviders,
      totalSeekers,
      totalBookings,
      completedBookings,
      pendingVerifications
    ] = await Promise.all([
      User.countDocuments({ role: { $in: ['seeker', 'provider'] } }),
      ServiceProvider.countDocuments(),
      ServiceSeeker.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'completed' }),
      ProviderVerification.countDocuments({ status: 'pending' })
    ]);

    const revenue = await Booking.aggregate([
      { $match: { status: 'completed', paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProviders,
        totalSeekers,
        totalBookings,
        completedBookings,
        pendingVerifications,
        totalRevenue: revenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users (seekers and providers)
router.get('/users', auth(['admin']), async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (status) query.isActive = status === 'active';

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Get additional info for providers
    const userIds = users.map(u => u._id);
    const providers = await ServiceProvider.find({ userId: { $in: userIds } })
      .populate('userId', 'email phone');

    const seekers = await ServiceSeeker.find({ userId: { $in: userIds } })
      .populate('userId', 'email phone');

    const enrichedUsers = users.map(user => {
      const provider = providers.find(p => p.userId.toString() === user._id.toString());
      const seeker = seekers.find(s => s.userId.toString() === user._id.toString());
      
      return {
        ...user.toObject(),
        profile: provider || seeker || null
      };
    });

    res.json({
      success: true,
      data: enrichedUsers,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get service providers with details
router.get('/providers', auth(['admin']), async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.verificationStatus = status;

    const providers = await ServiceProvider.find(query)
      .populate('userId', 'email phone isActive createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ServiceProvider.countDocuments(query);

    res.json({
      success: true,
      data: providers,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get service seekers with details
router.get('/seekers', auth(['admin']), async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    
    const userQuery = { role: 'seeker' };
    if (status) userQuery.isActive = status === 'active';

    const seekers = await ServiceSeeker.find()
      .populate('userId', 'email phone isActive createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ServiceSeeker.countDocuments();

    res.json({
      success: true,
      data: seekers,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user status (activate/deactivate)
router.patch('/users/:id/status', auth(['admin']), async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all bookings
router.get('/bookings', auth(['admin']), async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const bookings = await Booking.find(query)
      .populate('seekerId', 'name email phone')
      .populate('providerId', 'businessName')
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get revenue data
router.get('/revenue', auth(['admin']), async (req, res) => {
  try {
    const { period = '6months' } = req.query;

    let dateFilter = new Date();
    if (period === '7days') dateFilter.setDate(dateFilter.getDate() - 7);
    else if (period === '30days') dateFilter.setMonth(dateFilter.getMonth() - 1);
    else if (period === '6months') dateFilter.setMonth(dateFilter.getMonth() - 6);
    else dateFilter.setFullYear(dateFilter.getFullYear() - 1);

    // Revenue by bookings
    const bookingRevenue = await Booking.aggregate([
      { $match: { status: 'completed', paymentStatus: 'paid', createdAt: { $gte: dateFilter } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Revenue by month
    const monthlyRevenue = await Booking.aggregate([
      { $match: { status: 'completed', paymentStatus: 'paid', createdAt: { $gte: dateFilter } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$amount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top earning providers
    const topProviders = await ServiceProvider.find()
      .populate('userId', 'email')
      .sort({ totalEarnings: -1 })
      .limit(5);

    // Recent transactions
    const recentTransactions = await Booking.find({ paymentStatus: 'paid' })
      .populate('providerId', 'businessName')
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Plan distribution (mock - would need subscription model)
    const planDistribution = [
      { name: 'Basic', value: 150 },
      { name: 'Professional', value: 85 },
      { name: 'Business', value: 42 },
      { name: 'Enterprise', value: 15 }
    ];

    res.json({
      success: true,
      data: {
        totalRevenue: bookingRevenue[0]?.total || 0,
        monthlyRevenue,
        topProviders,
        recentTransactions,
        planDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get verifications
router.get('/verifications', auth(['admin']), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const verifications = await ProviderVerification.find(query)
      .populate('providerId', 'businessName service')
      .populate('providerId.userId', 'email phone')
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ProviderVerification.countDocuments(query);

    res.json({
      success: true,
      data: verifications,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update verification status
router.patch('/verifications/:id', auth(['admin']), async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    const verification = await ProviderVerification.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        reason,
        reviewedBy: req.user.id,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('providerId');

    if (!verification) {
      return res.status(404).json({ success: false, message: 'Verification not found' });
    }

    // Also update provider status
    await ServiceProvider.findByIdAndUpdate(verification.providerId._id, {
      verificationStatus: status,
      isVerified: status === 'approved'
    });

    res.json({ success: true, data: verification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
