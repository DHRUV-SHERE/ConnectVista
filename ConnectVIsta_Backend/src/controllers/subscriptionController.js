const Subscription = require('../models/Subscription');
const ServiceProvider = require('../models/ServiceProvider');
const Payment = require('../models/Payment');

const createSubscription = async (req, res) => {
  try {
    const { plan, duration, paymentDetails } = req.body;
    
    console.log('📝 Create Subscription Request:', { plan, duration, paymentDetails });
    console.log('👤 User from token:', req.user);
    
    if (!req.user.providerProfile || !req.user.providerProfile.providerId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Provider profile not found. Please complete your profile setup.' 
      });
    }
    
    const providerId = req.user.providerProfile.providerId;
    const userId = req.user.id;

    const plans = {
      Basic: { monthly: 499, yearly: 4999 },
      Professional: { monthly: 999, yearly: 9999 },
      Business: { monthly: 1999, yearly: 19999 },
      Enterprise: { monthly: 4999, yearly: 49999 }
    };

    const amount = plans[plan][duration];
    const months = duration === 'yearly' ? 12 : 1;
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    // Cancel existing active subscriptions
    await Subscription.updateMany(
      { providerId, status: 'active' },
      { status: 'cancelled' }
    );

    const subscription = await Subscription.create({
      providerId,
      plan,
      amount,
      duration,
      paymentDetails: {
        transactionId: paymentDetails.transactionId,
        method: paymentDetails.method,
        cardLast4: paymentDetails.cardLast4,
        cardType: paymentDetails.cardType
      },
      endDate
    });

    // Create payment record
    await Payment.create({
      userId,
      subscriptionId: subscription._id,
      plan,
      duration,
      amount,
      method: paymentDetails.method,
      status: 'success',
      transactionId: paymentDetails.transactionId,
      cardLast4: paymentDetails.cardLast4,
      cardType: paymentDetails.cardType
    });

    await ServiceProvider.findByIdAndUpdate(providerId, {
      currentPlan: plan,
      planExpiresAt: endDate
    });

    res.json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProviderSubscription = async (req, res) => {
  try {
    if (!req.user.providerProfile || !req.user.providerProfile.providerId) {
      return res.json({ success: true, data: null });
    }
    
    const providerId = req.user.providerProfile.providerId;
    const subscription = await Subscription.findOne({ providerId, status: 'active' });
    res.json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    if (!req.user.providerProfile || !req.user.providerProfile.providerId) {
      return res.status(400).json({ success: false, message: 'Provider profile not found' });
    }
    
    const providerId = req.user.providerProfile.providerId;
    await Subscription.updateOne(
      { providerId, status: 'active' },
      { status: 'cancelled' }
    );
    await ServiceProvider.findByIdAndUpdate(providerId, {
      currentPlan: null,
      planExpiresAt: null
    });
    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const subscriptions = await Subscription.find()
      .populate({
        path: 'providerId',
        select: 'businessName name userId',
        populate: { path: 'userId', select: 'email phone' }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Subscription.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'success', createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
      { $group: { _id: { $month: '$createdAt' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: subscriptions,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSubscription,
  getProviderSubscription,
  cancelSubscription,
  getAllSubscriptions
};
