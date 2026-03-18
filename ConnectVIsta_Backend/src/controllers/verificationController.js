const ProviderVerification = require('../models/ProviderVerification');
const ServiceProvider = require('../models/ServiceProvider');
const User = require('../models/User');
const Notification = require('../models/Notification');
const socketManager = require('../utils/socketManager');
const { cloudinary } = require('../config/cloudinary');

// 🔁 Map frontend field names → DB enum values
const mapDocumentType = (type) => {
  const map = {
    businessRegistration: 'business-registration',
    governmentId: 'government-id',
    addressProof: 'address-proof',
    taxCertificate: 'tax-certificate',
    insurance: 'insurance'
  };
  return map[type] || type;
};

const uploadDocuments = async (req, res) => {
  try {
    console.log("==== UPLOAD START ====");
    console.log("User:", req.user);
    console.log("Files:", req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files received. Please upload at least one document.'
      });
    }

    const providerId = req.user.id;

    const provider = await ServiceProvider.findOne({ userId: providerId });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    const documents = [];

    for (const [fieldName, fileArray] of Object.entries(req.files)) {
      if (!fileArray || !fileArray.length) continue;

      const file = fileArray[0];

      documents.push({
        documentType: mapDocumentType(fieldName), // ✅ FIXED
        documentUrl: file.path,
        status: 'pending',
        uploadedAt: new Date()
      });
    }

    let verification = await ProviderVerification.findOne({
      providerId: provider._id
    });

    if (!verification) {
      verification = await ProviderVerification.create({
        providerId: provider._id,
        documents,
        overallStatus: 'pending'
      });
    } else {
      verification.documents.push(...documents);
      verification.overallStatus = 'pending';
      await verification.save();
    }

    provider.verificationStatus = 'pending';
    provider.isVerified = false;
    await provider.save();

    // Notify Admins
    try {
      const admins = await User.find({ role: 'admin' });
      const notificationPromises = admins.map(admin => {
        const notification = new Notification({
          userId: admin._id,
          title: 'New Verification Request',
          message: `Provider "${provider.businessName || req.user.name}" has uploaded new documents for verification.`,
          category: 'admin',
          type: 'info',
          actionUrl: `/admin/verification`
        });
        return notification.save().then(notif => {
          socketManager.emitToUser(admin._id.toString(), 'notification:new', notif);
        });
      });
      await Promise.all(notificationPromises);
    } catch (notifError) {
      console.error('Failed to notify admins of verification upload:', notifError);
    }

    return res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      data: verification
    });

  } catch (error) {
    console.error('🔥 UPLOAD ERROR:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

// Get verification status
const getVerificationStatus = async (req, res) => {
  try {
    console.log("=== GET VERIFICATION STATUS ===");
    console.log("User ID from token:", req.user?.id);
    
    const providerId = req.user.id;
    
    // Find the service provider
    const provider = await ServiceProvider.findOne({ userId: providerId });
    console.log("Found provider:", provider ? `Yes (${provider.businessName})` : 'No');
    
    if (!provider) {
      // If no provider record exists, create a basic one
      console.log("Creating provider record...");
      const newProvider = await ServiceProvider.create({
        userId: providerId,
        businessName: "My Business",
        verificationStatus: "not-submitted",
        isVerified: false
      });
      
      return res.json({
        success: true,
        data: {
          provider: {
            isVerified: false,
            verificationStatus: "not-submitted"
          },
          verification: null
        }
      });
    }

    const verification = await ProviderVerification.findOne({ 
      providerId: provider._id 
    }).populate('reviewedBy', 'email name');

    console.log("Verification data:", verification ? "Found" : "Not found");

    res.json({
      success: true,
      data: {
        provider: {
          isVerified: provider.isVerified,
          verificationStatus: provider.verificationStatus || "not-submitted"
        },
        verification: verification || null
      }
    });

  } catch (error) {
    console.error('❌ Get verification error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verification status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all pending verifications (Admin only)
const getPendingVerifications = async (req, res) => {
  try {
    const pendingVerifications = await ProviderVerification.find({ 
      overallStatus: 'pending' 
    })
    .populate({
      path: 'providerId',
      populate: {
        path: 'userId',
        select: 'email phone'
      }
    })
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pendingVerifications.length,
      data: pendingVerifications
    });

  } catch (error) {
    console.error('Get pending verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending verifications'
    });
  }
};

// Update verification status (Admin only)
const updateVerificationStatus = async (req, res) => {
  try {
    const { verificationId } = req.params;
    const { status, rejectionReason, documentUpdates } = req.body;
    const adminId = req.user.id;

    const verification = await ProviderVerification.findById(verificationId);
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification not found'
      });
    }

    // Update individual document statuses if provided
    if (documentUpdates && Array.isArray(documentUpdates)) {
      documentUpdates.forEach(update => {
        const doc = verification.documents.id(update.documentId);
        if (doc) {
          doc.status = update.status || doc.status;
          doc.rejectionReason = update.rejectionReason;
          doc.reviewedAt = new Date();
        }
      });
    }

    // Update overall status
    verification.overallStatus = status;
    verification.reviewedBy = adminId;
    verification.reviewedAt = new Date();
    
    if (status === 'rejected' && rejectionReason) {
      verification.rejectionReason = rejectionReason;
    }

    await verification.save();

    // Update provider's verification status
    const provider = await ServiceProvider.findById(verification.providerId);
    if (provider) {
      provider.verificationStatus = status;
      provider.isVerified = status === 'approved';
      provider.updatedAt = new Date();
      await provider.save();
    }

    res.json({
      success: true,
      message: `Verification ${status}`,
      data: verification
    });

  } catch (error) {
    console.error('Update verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update verification status'
    });
  }
};

// Delete document (Provider can delete their own pending documents)
const deleteDocument = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { documentId } = req.params;

    const provider = await ServiceProvider.findOne({ userId: providerId });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    const verification = await ProviderVerification.findOne({ 
      providerId: provider._id 
    });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification not found'
      });
    }

    // Find the document
    const document = verification.documents.id(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Only allow deletion of pending documents
    if (document.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending documents can be deleted'
      });
    }

    // Delete from Cloudinary
    const publicId = document.documentUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`connectvista/verification/${publicId}`);

    // Remove document from array
    verification.documents.pull(documentId);
    await verification.save();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document'
    });
  }
};

module.exports = {
  uploadDocuments,
  getVerificationStatus,
  getPendingVerifications,
  updateVerificationStatus,
  deleteDocument
};