const ProviderSupportRequest = require('../models/ProviderSupportRequest');
const ServiceProvider = require('../models/ServiceProvider');
const catchAsync = require('../utils/catchAsync');

/**
 * Create support request (Provider only)
 */
exports.createSupportRequest = catchAsync(async (req, res) => {
  const { title, description, category, priority, attachments } = req.body;
  const userId = req.user.id;

  // Get provider info from user
  const provider = await ServiceProvider.findOne({ userId });

  if (!provider) {
    return res.status(404).json({
      success: false,
      message: 'Provider profile not found. Please create your provider profile first.'
    });
  }

  // Validation
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required'
    });
  }

  const supportRequest = await ProviderSupportRequest.create({
    providerId: provider._id,
    title,
    description,
    category: category || 'other',
    priority: priority || 'medium',
    attachments: attachments || []
  });

  res.status(201).json({
    success: true,
    message: 'Support request created successfully. Our team will get back to you soon!',
    data: supportRequest
  });
});

/**
 * Get provider's support requests (Provider - own requests, Admin - all)
 */
exports.getProviderSupportRequests = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, category, priority } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const userId = req.user.id;

  // Get provider
  const provider = await ServiceProvider.findOne({ userId });

  if (!provider) {
    return res.status(404).json({
      success: false,
      message: 'Provider profile not found'
    });
  }

  // Build filter
  const filter = { providerId: provider._id };

  if (status) {
    filter.status = status;
  }
  if (category) {
    filter.category = category;
  }
  if (priority) {
    filter.priority = priority;
  }

  const total = await ProviderSupportRequest.countDocuments(filter);
  const requests = await ProviderSupportRequest.find(filter)
    .populate('providerId', 'name businessName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: requests,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Get all support requests (Admin only)
 */
exports.getAllSupportRequests = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, category, priority, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build filter
  const filter = {};

  if (status) {
    filter.status = status;
  }
  if (category) {
    filter.category = category;
  }
  if (priority) {
    filter.priority = priority;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const total = await ProviderSupportRequest.countDocuments(filter);
  const requests = await ProviderSupportRequest.find(filter)
    .populate('providerId', 'name businessName email')
    .sort({ priority: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: requests,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Get single support request by ID
 */
exports.getSupportRequestById = catchAsync(async (req, res) => {
  const request = await ProviderSupportRequest.findById(req.params.id)
    .populate('providerId', 'name businessName email');

  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Support request not found'
    });
  }

  res.status(200).json({
    success: true,
    data: request
  });
});

/**
 * Update support request status and admin notes (Admin only)
 */
exports.updateSupportRequest = catchAsync(async (req, res) => {
  const { status, adminNotes } = req.body;

  const request = await ProviderSupportRequest.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Support request not found'
    });
  }

  if (status && ['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
    request.status = status;
  }

  if (adminNotes !== undefined) {
    request.adminNotes = adminNotes;
  }

  await request.save();

  res.status(200).json({
    success: true,
    message: 'Support request updated successfully',
    data: request
  });
});

/**
 * Delete support request
 */
exports.deleteSupportRequest = catchAsync(async (req, res) => {
  const request = await ProviderSupportRequest.findByIdAndDelete(req.params.id);

  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Support request not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Support request deleted successfully'
  });
});

/**
 * Get support request statistics (Admin only)
 */
exports.getSupportStats = catchAsync(async (req, res) => {
  const stats = await ProviderSupportRequest.aggregate([
    {
      $facet: {
        byStatus: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ],
        byCategory: [
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ],
        byPriority: [
          {
            $group: {
              _id: '$priority',
              count: { $sum: 1 }
            }
          }
        ]
      }
    }
  ]);

  const total = await ProviderSupportRequest.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      total,
      ...stats[0]
    }
  });
});
