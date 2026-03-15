const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const ServiceSeeker = require('../models/ServiceSeeker');
const Booking = require('../models/Booking');
const Subscription = require('../models/Subscription');
const ProviderVerification = require('../models/ProviderVerification');
const ProviderService = require('../models/ProviderService');

const getDashboardStats = async (req, res) => {
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
      { $match: { status: 'completed', paymentStatus: { $in: ['paid', 'fully-paid', 'visiting-paid'] } } },
      { $group: { _id: null, total: { $sum: '$platformFee' } } }
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
};

const getAllUsers = async (req, res) => {
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

    const userIds = users.map(u => u._id);
    const providers = await ServiceProvider.find({ userId: { $in: userIds } })
      .populate('userId', 'email phone');

    const seekers = await ServiceSeeker.find({ userId: { $in: userIds } })
      .populate('userId', 'email phone');

    const enrichedUsers = users.map(user => {
      const provider = providers.find(p => {
        const pUserId = p.userId._id || p.userId;
        return pUserId.toString() === user._id.toString();
      });
      const seeker = seekers.find(s => {
        const sUserId = s.userId._id || s.userId;
        return sUserId.toString() === user._id.toString();
      });
      
      return {
        ...user.toObject(),
        profile: provider ? provider.toObject() : (seeker ? seeker.toObject() : null)
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
};

const getAllProviders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.verificationStatus = status;

    const providers = await ServiceProvider.find(query)
      .populate('userId', 'email phone isActive createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get services for each provider
    const providerIds = providers.map(p => p._id);
    const providerServices = await ProviderService.find({ providerId: { $in: providerIds } });

    const formattedProviders = providers.map(p => {
      const provider = p.toObject();
      const service = providerServices.find(s => s.providerId.toString() === p._id.toString());
      provider.service = service?.mainService?.name || 'N/A';
      return provider;
    });

    const total = await ServiceProvider.countDocuments(query);

    res.json({
      success: true,
      data: formattedProviders,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllSeekers = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    
    // We want to filter by status (User.isActive) and search (ServiceSeeker.name or User.email)
    // For simplicity, we fetch seekers and populate user, then we can filter
    // If we want efficient filtering, we should use aggregation or filter users first
    
    let userQuery = {};
    if (status) {
      userQuery.isActive = status === 'active';
    }

    // First find matching users if status or search-by-email is provided
    let matchedUserIds = null;
    if (status || (search && search.includes('@'))) {
      if (search && search.includes('@')) {
        userQuery.email = { $regex: search, $options: 'i' };
      }
      const users = await User.find(userQuery).select('_id');
      matchedUserIds = users.map(u => u._id);
    }

    let seekerQuery = {};
    if (matchedUserIds) {
      seekerQuery.userId = { $in: matchedUserIds };
    }
    if (search && !search.includes('@')) {
      seekerQuery.name = { $regex: search, $options: 'i' };
    }

    const seekers = await ServiceSeeker.find(seekerQuery)
      .populate('userId', 'email phone isActive createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get booking counts for each seeker
    const seekerIds = seekers.map(s => s._id);
    const bookingCounts = await Booking.aggregate([
      { $match: { seekerId: { $in: seekerIds } } },
      { $group: { _id: '$seekerId', count: { $sum: 1 } } }
    ]);

    const seekersWithBookings = seekers.map(seeker => {
      const bookingData = bookingCounts.find(b => b._id.toString() === seeker._id.toString());
      const seekerObj = seeker.toObject();
      
      return {
        ...seekerObj,
        totalBookings: bookingData?.count || 0
      };
    });

    const total = await ServiceSeeker.countDocuments(seekerQuery);

    res.json({
      success: true,
      data: seekersWithBookings,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get seekers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserStatus = async (req, res) => {
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
};

const getAllBookings = async (req, res) => {
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
};

const getRevenueData = async (req, res) => {
  try {
    const { period = '6months' } = req.query;

    let dateFilter = new Date();
    if (period === '7days') dateFilter.setDate(dateFilter.getDate() - 7);
    else if (period === '30days') dateFilter.setMonth(dateFilter.getMonth() - 1);
    else if (period === '6months') dateFilter.setMonth(dateFilter.getMonth() - 6);
    else dateFilter.setFullYear(dateFilter.getFullYear() - 1);

    // 1. Booking Revenue (Completed & Paid - platform gets the platformFee)
    const bookingRevenue = await Booking.aggregate([
      { $match: { status: 'completed', paymentStatus: { $in: ['paid', 'fully-paid', 'visiting-paid'] }, createdAt: { $gte: dateFilter } } },
      { $group: { _id: null, total: { $sum: '$platformFee' }, count: { $sum: 1 } } }
    ]);

    // 2. Subscription Revenue
    const subscriptionRevenue = await Subscription.aggregate([
      { $match: { createdAt: { $gte: dateFilter } } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // 3. Monthly Revenue (Combined Bookings and Subscriptions)
    const monthlyBookings = await Booking.aggregate([
      { $match: { status: 'completed', paymentStatus: { $in: ['paid', 'fully-paid', 'visiting-paid'] }, createdAt: { $gte: dateFilter } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$platformFee' },
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlySubscriptions = await Subscription.aggregate([
      { $match: { createdAt: { $gte: dateFilter } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Merge monthly data
    const months = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.getMonth() + 1);
    }
    
    const combinedMonthly = months.map(month => {
      const b = monthlyBookings.find(m => m._id === month) || { total: 0, count: 0 };
      const s = monthlySubscriptions.find(m => m._id === month) || { total: 0, count: 0 };
      return {
        _id: month,
        total: b.total + s.total,
        bookings: b.total,
        subscriptions: s.total,
        bookingsCount: b.count,
        subsCount: s.count
      };
    }).sort((a, b) => a._id - b._id);

    // 4. Top Providers by Earnings (Jobs + Subscriptions - wait, usually just jobs)
    const topProviders = await ServiceProvider.find()
      .populate('userId', 'email')
      .sort({ totalEarnings: -1 })
      .limit(5);

    // 5. Recent Transactions (Combined)
    const recentBookings = await Booking.find({ paymentStatus: { $in: ['paid', 'fully-paid', 'visiting-paid'] } })
      .populate('providerId', 'businessName email phone city')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentSubs = await Subscription.find()
      .populate('providerId', 'businessName email phone city')
      .sort({ createdAt: -1 })
      .limit(10);

    const transactions = [
      ...recentBookings.map(b => ({
        _id: b._id,
        type: 'booking',
        amount: b.platformFee,
        status: b.status,
        providerId: b.providerId,
        paymentDetails: {
          transactionId: `BK-${b._id.toString().slice(-6)}`,
          method: 'online'
        },
        createdAt: b.createdAt
      })),
      ...recentSubs.map(s => ({
        _id: s._id,
        type: 'subscription',
        amount: s.amount,
        status: s.status,
        plan: s.plan,
        duration: s.duration,
        providerId: s.providerId,
        paymentDetails: s.paymentDetails,
        startDate: s.startDate,
        endDate: s.endDate,
        createdAt: s.createdAt
      }))
    ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 15);

    // 6. Plan Distribution
    const planDist = await Subscription.aggregate([
      { $group: { _id: '$plan', value: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue: (bookingRevenue[0]?.total || 0),
        subscriptionRevenue: (subscriptionRevenue[0]?.total || 0),
        monthlyRevenue: combinedMonthly,
        topProviders,
        recentTransactions: transactions,
        planDistribution: planDist.map(p => ({ name: p._id, value: p.value }))
      }
    });
  } catch (error) {
    console.error('Revenue Data Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVerifications = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.overallStatus = status;

    const verifications = await ProviderVerification.find(query)
      .populate({
        path: 'providerId',
        select: 'businessName name userId',
        populate: { path: 'userId', select: 'email phone' }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get services for providers
    const providerIds = verifications.map(v => v.providerId?._id).filter(Boolean);
    const providerServices = await ProviderService.find({ providerId: { $in: providerIds } });

    const formattedVerifications = verifications.map(v => {
      const obj = v.toObject();
      const service = providerServices.find(s => s.providerId.toString() === v.providerId?._id.toString());
      return {
        ...obj,
        service: service?.mainService?.name || 'N/A',
        submittedAt: v.createdAt,
        status: v.overallStatus
      };
    });

    const total = await ProviderVerification.countDocuments(query);

    res.json({
      success: true,
      data: formattedVerifications,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get verifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateVerification = async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    const verification = await ProviderVerification.findByIdAndUpdate(
      req.params.id,
      { 
        overallStatus: status,
        rejectionReason: reason,
        reviewedBy: req.user.id,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('providerId');

    if (!verification) {
      return res.status(404).json({ success: false, message: 'Verification not found' });
    }

    await ServiceProvider.findByIdAndUpdate(verification.providerId._id, {
      verificationStatus: status,
      isVerified: status === 'approved'
    });

    res.json({ success: true, data: verification });
  } catch (error) {
    console.error('Update verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllProviders,
  getAllSeekers,
  updateUserStatus,
  getAllBookings,
  getRevenueData,
  getVerifications,
  updateVerification
};
