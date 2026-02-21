const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const ServiceSeeker = require('../models/ServiceSeeker');
const Booking = require('../models/Booking');
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
    
    const seekers = await ServiceSeeker.find()
      .populate('user', 'email phone isActive createdAt')
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
      return {
        ...seeker.toObject(),
        totalBookings: bookingData?.count || 0
      };
    });

    const total = await ServiceSeeker.countDocuments();

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

    const bookingRevenue = await Booking.aggregate([
      { $match: { status: 'completed', paymentStatus: 'paid', createdAt: { $gte: dateFilter } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

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

    const topProviders = await ServiceProvider.find()
      .populate('userId', 'email')
      .sort({ totalEarnings: -1 })
      .limit(5);

    const recentTransactions = await Booking.find({ paymentStatus: 'paid' })
      .populate('providerId', 'businessName')
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

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
