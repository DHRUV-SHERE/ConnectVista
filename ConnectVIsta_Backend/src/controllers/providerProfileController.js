const ServiceProvider = require('../models/ServiceProvider');
const ProviderService = require('../models/ProviderService');
const ProviderSchedule = require('../models/ProviderSchedule');
const Service = require('../models/Service');
const User = require('../models/User');

// Get provider profile
const getProviderProfile = async (req, res) => {
  try {
    console.log('=== GET PROVIDER PROFILE ===');
    console.log('User ID:', req.user.id);
    
    // Find provider
    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    
    if (!provider) {
      return res.status(200).json({
        success: true,
        data: {
          provider: null,
          services: [],
          schedule: null,
          message: 'No profile found. Please create one.'
        }
      });
    }

    // Find provider services
    const providerServices = await ProviderService.find({ providerId: provider._id })
      .populate('serviceId', 'name category');

    // Find provider schedule
    const providerSchedule = await ProviderSchedule.findOne({ providerId: provider._id });

    res.json({
      success: true,
      data: {
        provider,
        services: providerServices,
        schedule: providerSchedule
      }
    });

  } catch (error) {
    console.error('Get provider profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch provider profile'
    });
  }
};

// Create or update provider profile
const updateProviderProfile = async (req, res) => {
  try {
    console.log('=== UPDATE PROVIDER PROFILE ===');
    console.log('User ID:', req.user.id);
    console.log('Update data:', req.body);
    
    const {
      businessName,
      description,
      businessAddress,
      experienceYears,
      languages,
      startingPrice,
      emergencyCharge,
      extraChargeNote,
      services,
      schedule
    } = req.body;

    // Check if provider exists or create new one
    let provider = await ServiceProvider.findOne({ userId: req.user.id });
    
    if (!provider) {
      // Create new provider profile
      provider = new ServiceProvider({
        userId: req.user.id,
        name: req.user.name || 'Provider',
        businessName: businessName || 'My Business',
        description: description || '',
        experienceYears: experienceYears || 0,
        businessAddress: businessAddress || {
          street: '',
          city: '',
          state: '',
          pinCode: '',
          coordinates: { type: 'Point', coordinates: [0, 0] }
        },
        languages: languages || [],
        startingPrice: startingPrice || 50,
        emergencyCharge: emergencyCharge || 0,
        extraChargeNote: extraChargeNote || '',
        isVerified: false,
        verificationStatus: 'pending'
      });
    } else {
      // Update existing provider
      if (businessName) provider.businessName = businessName;
      if (description) provider.description = description;
      if (experienceYears !== undefined) provider.experienceYears = experienceYears;
      if (startingPrice !== undefined) provider.startingPrice = startingPrice;
      if (emergencyCharge !== undefined) provider.emergencyCharge = emergencyCharge;
      if (extraChargeNote !== undefined) provider.extraChargeNote = extraChargeNote;
      
      if (languages && Array.isArray(languages)) {
        provider.languages = languages.filter(lang => lang.trim() !== '');
      }

      // Update address
      if (businessAddress) {
        provider.businessAddress = {
          ...provider.businessAddress,
          ...businessAddress,
          coordinates: businessAddress.coordinates || { type: 'Point', coordinates: [0, 0] }
        };
      }
    }

    await provider.save();

    // Update services if provided
    if (services && Array.isArray(services)) {
      // Remove existing services
      await ProviderService.deleteMany({ providerId: provider._id });
      
      // Add new services
      const servicePromises = services.map(async (service) => {
        if (!service.name || service.name.trim() === '') return null;
        
        // Find existing service with similar name (case-insensitive)
        let serviceDoc = await Service.findOne({ 
          name: { $regex: new RegExp(`^${service.name.trim()}$`, 'i') }
        });
        
        if (!serviceDoc) {
          // Map to valid category from enum or use 'other'
          const validCategory = mapToValidCategory(service.category);
          
          serviceDoc = await Service.create({
            name: service.name.trim(),
            category: validCategory,
            description: service.description || `Professional ${service.name.trim()} services`
          });
        }

        if (serviceDoc) {
          // Create provider service
          return ProviderService.create({
            providerId: provider._id,
            serviceId: serviceDoc._id,
            specialization: service.specialization,
            minPrice: service.minPrice || provider.startingPrice,
            maxPrice: service.maxPrice || (provider.startingPrice * 2),
            pricingType: service.pricingType || 'fixed',
            isAvailable: service.isAvailable !== false
          });
        }
        return null;
      });

      await Promise.all(servicePromises.filter(promise => promise !== null));
    }

    // Update schedule if provided
    if (schedule) {
      let providerSchedule = await ProviderSchedule.findOne({ providerId: provider._id });
      
      const defaultSchedule = {
        monday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
        tuesday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
        wednesday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
        thursday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
        friday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
        saturday: { isAvailable: false, startTime: '10:00', endTime: '16:00' },
        sunday: { isAvailable: false, startTime: '10:00', endTime: '14:00' }
      };

      if (!providerSchedule) {
        providerSchedule = new ProviderSchedule({
          providerId: provider._id,
          responseTime: schedule.responseTime || 'within-2-hours',
          serviceAreaRadius: schedule.serviceAreaRadius || 10,
          weeklySchedule: schedule.weeklySchedule || defaultSchedule,
          isAvailable: schedule.isAvailable !== false
        });
      } else {
        if (schedule.responseTime) providerSchedule.responseTime = schedule.responseTime;
        if (schedule.serviceAreaRadius) providerSchedule.serviceAreaRadius = schedule.serviceAreaRadius;
        if (schedule.weeklySchedule) providerSchedule.weeklySchedule = schedule.weeklySchedule;
        if (schedule.isAvailable !== undefined) providerSchedule.isAvailable = schedule.isAvailable;
        providerSchedule.updatedAt = new Date();
      }

      await providerSchedule.save();
    }

    // Get updated data
    const updatedProvider = await ServiceProvider.findOne({ userId: req.user.id });
    const updatedServices = await ProviderService.find({ providerId: provider._id })
      .populate('serviceId', 'name category');
    const updatedSchedule = await ProviderSchedule.findOne({ providerId: provider._id });

    res.json({
      success: true,
      message: provider.isNew ? 'Profile created successfully' : 'Profile updated successfully',
      data: {
        provider: updatedProvider,
        services: updatedServices,
        schedule: updatedSchedule
      }
    });

  } catch (error) {
    console.error('Update provider profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update provider profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to map service name to valid category
function mapToValidCategory(category) {
  if (!category) return 'other';
  
  const categoryLower = category.toLowerCase().trim();
  const validCategories = [
    'plumbing', 'electrical', 'carpentry', 'cleaning', 
    'painting', 'appliance-repair', 'moving', 'gardening',
    'pest-control', 'renovation', 'other'
  ];

  // Try to match based on keywords
  const categoryMapping = {
    'plumbing': ['plumber', 'pipe', 'leak', 'drain', 'water', 'toilet', 'bathroom'],
    'electrical': ['electric', 'wiring', 'light', 'socket', 'switch', 'power'],
    'carpentry': ['carpenter', 'wood', 'furniture', 'cabinet', 'door', 'window'],
    'cleaning': ['clean', 'maid', 'housekeeping', 'vacuum', 'dust'],
    'painting': ['paint', 'wall', 'color', 'brush'],
    'appliance-repair': ['appliance', 'fridge', 'washing', 'oven', 'microwave', 'ac', 'air conditioner'],
    'moving': ['move', 'pack', 'shift', 'transport'],
    'gardening': ['garden', 'lawn', 'plant', 'tree', 'landscape'],
    'pest-control': ['pest', 'insect', 'bug', 'rodent', 'termite'],
    'renovation': ['renovate', 'remodel', 'construction', 'build']
  };

  // Check if category is already valid
  if (validCategories.includes(categoryLower)) {
    return categoryLower;
  }

  // Try to match by keywords
  for (const [validCat, keywords] of Object.entries(categoryMapping)) {
    if (keywords.some(keyword => categoryLower.includes(keyword))) {
      return validCat;
    }
  }

  return 'other';
}

// Upload business images
const uploadBusinessImages = async (req, res) => {
  try {
    console.log('=== UPLOAD BUSINESS IMAGES ===');
    console.log('Files received:', req.files);
    
    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found. Please create a profile first.'
      });
    }

    // Initialize businessImages array if it doesn't exist
    if (!provider.businessImages) {
      provider.businessImages = [];
    }

    // Process uploaded files from Cloudinary
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // Cloudinary returns file in a different format
        uploadedImages.push({
          url: file.path, // Cloudinary URL
          filename: file.filename,
          originalName: file.originalname,
          publicId: file.filename, // Cloudinary public_id
          uploadedAt: new Date()
        });
      });

      // Add to existing images (max 10)
      provider.businessImages = [...provider.businessImages, ...uploadedImages].slice(0, 10);
      await provider.save();
    }

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images: provider.businessImages
      }
    });

  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete business image
const deleteBusinessImage = async (req, res) => {
  try {
    const { imageIndex } = req.params;
    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    if (!provider.businessImages || !Array.isArray(provider.businessImages)) {
      return res.status(400).json({
        success: false,
        message: 'No images found'
      });
    }

    const index = parseInt(imageIndex);
    if (isNaN(index) || index < 0 || index >= provider.businessImages.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image index'
      });
    }

    // Get the image to delete
    const imageToDelete = provider.businessImages[index];
    
    // Delete from Cloudinary if it has a publicId
    if (imageToDelete.publicId) {
      try {
        await cloudinary.uploader.destroy(imageToDelete.publicId);
        console.log('Deleted image from Cloudinary:', imageToDelete.publicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue even if Cloudinary deletion fails
      }
    }

    // Remove image from array
    provider.businessImages.splice(index, 1);
    await provider.save();

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: {
        images: provider.businessImages
      }
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image'
    });
  }
};

module.exports = {
  getProviderProfile,
  updateProviderProfile,
  uploadBusinessImages,
  deleteBusinessImage
};