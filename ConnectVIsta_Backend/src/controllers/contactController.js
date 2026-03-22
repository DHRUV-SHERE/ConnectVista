const ContactSubmission = require('../models/ContactSubmission');
const catchAsync = require('../utils/catchAsync');

/**
 * Submit contact form
 */
exports.submitContact = catchAsync(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, subject, and message are required'
    });
  }

  const contact = await ContactSubmission.create({
    name,
    email,
    phone: phone || '',
    subject,
    message
  });

  res.status(201).json({
    success: true,
    message: 'Contact submission received. We will get back to you soon!',
    data: contact
  });
});

/**
 * Get all contact submissions (Admin only)
 */
exports.getAllContacts = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build filter
  const filter = {};
  if (status) {
    filter.status = status;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } }
    ];
  }

  const total = await ContactSubmission.countDocuments(filter);
  const contacts = await ContactSubmission.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: contacts,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Get single contact submission by ID
 */
exports.getContactById = catchAsync(async (req, res) => {
  const contact = await ContactSubmission.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact submission not found'
    });
  }

  res.status(200).json({
    success: true,
    data: contact
  });
});

/**
 * Update contact submission status and notes (Admin only)
 */
exports.updateContact = catchAsync(async (req, res) => {
  const { status, adminNotes } = req.body;

  const contact = await ContactSubmission.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact submission not found'
    });
  }

  if (status && ['pending', 'reviewed', 'resolved'].includes(status)) {
    contact.status = status;
  }

  if (adminNotes !== undefined) {
    contact.adminNotes = adminNotes;
  }

  await contact.save();

  res.status(200).json({
    success: true,
    message: 'Contact submission updated successfully',
    data: contact
  });
});

/**
 * Delete contact submission (Admin only)
 */
exports.deleteContact = catchAsync(async (req, res) => {
  const contact = await ContactSubmission.findByIdAndDelete(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact submission not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Contact submission deleted successfully'
  });
});

/**
 * Get contact statistics (Admin only)
 */
exports.getContactStats = catchAsync(async (req, res) => {
  const stats = await ContactSubmission.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const total = await ContactSubmission.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      total,
      byStatus: stats
    }
  });
});
