const Service = require('../models/Service');
const ProviderService = require('../models/ProviderService');
const ServiceProvider = require('../models/ServiceProvider');

// Get all available services (from live provider data)
const getServices = async (req, res) => {
  try {
    // Get services that have active providers
    const services = await ProviderService.aggregate([
      { $match: { isAvailable: true } },
      {
        $lookup: {
          from: 'serviceproviders',
          localField: 'providerId',
          foreignField: '_id',
          as: 'provider'
        }
      },
      { $match: { 'provider.isVerified': true } },
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: '$service' },
      {
        $group: {
          _id: '$service._id',
          name: { $first: '$service.name' },
          category: { $first: '$service.category' },
          description: { $first: '$service.description' },
          icon: { $first: '$service.icon' },
          providerCount: { $sum: 1 },
          minPrice: { $min: '$minPrice' },
          maxPrice: { $max: '$maxPrice' }
        }
      },
      { $sort: { providerCount: -1 } }
    ]);

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
};

// Create new service (for providers)
const createService = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    
    // Check if service already exists
    const existingService = await Service.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    
    if (existingService) {
      return res.json({
        success: true,
        data: existingService,
        message: 'Service already exists'
      });
    }
    
    // Create new service
    const service = await Service.create({
      name,
      description,
      category,
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create service'
    });
  }
};

// Get all services for dropdown
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .select('name category description')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all services'
    });
  }
};

// Add provider service (for providers to offer services)
const addProviderService = async (req, res) => {
  try {
    const { serviceId, minPrice, maxPrice, pricingType, specialization } = req.body;
    const providerId = req.user.providerProfile.providerId;

    // Check if provider already offers this service
    const existing = await ProviderService.findOne({ providerId, serviceId });
    if (existing) {
      return res.json({
        success: true,
        data: existing,
        message: 'Service already added'
      });
    }

    // Add provider service
    const providerService = await ProviderService.create({
      providerId,
      serviceId,
      minPrice,
      maxPrice: maxPrice || minPrice,
      pricingType: pricingType || 'fixed',
      specialization,
      isAvailable: true
    });

    res.status(201).json({
      success: true,
      data: providerService,
      message: 'Service added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add service'
    });
  }
};
const getProvidersByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { city, minPrice, maxPrice, sortBy = 'rating', lat, lng } = req.query;

    // Build query for providers
    let providerQuery = { isVerified: true };
    if (city) {
      providerQuery['businessAddress.city'] = new RegExp(city, 'i');
    }

    // Get providers offering this service
    const providerServices = await ProviderService.find({ 
      serviceId, 
      isAvailable: true 
    })
    .populate({
      path: 'providerId',
      match: providerQuery,
      select: 'name businessName businessAddress rating startingPrice totalJobsCompleted experienceYears description isVerified'
    })
    .populate('serviceId', 'name category');

    // Filter out null providers and apply price filter
    let providers = providerServices
      .filter(ps => ps.providerId)
      .map(ps => ({
        ...ps.providerId.toObject(),
        serviceDetails: {
          minPrice: ps.minPrice,
          maxPrice: ps.maxPrice,
          pricingType: ps.pricingType,
          specialization: ps.specialization
        }
      }));

    // Apply price filter
    if (minPrice || maxPrice) {
      providers = providers.filter(p => {
        const price = p.serviceDetails.minPrice;
        return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
      });
    }

    // Location-based sorting if coordinates provided
    if (lat && lng && sortBy === 'distance') {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      
      providers = providers.map(provider => {
        const providerCoords = provider.businessAddress?.coordinates?.coordinates;
        if (providerCoords && providerCoords.length === 2) {
          // MongoDB stores coordinates as [longitude, latitude]
          const [providerLng, providerLat] = providerCoords;
          const distance = calculateDistance(userLat, userLng, providerLat, providerLng);
          return { ...provider, distance: parseFloat(distance.toFixed(2)) };
        }
        return { ...provider, distance: Infinity };
      }).sort((a, b) => a.distance - b.distance);
    } else {
      // Sort providers by other criteria
      if (sortBy === 'rating') {
        providers.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
      } else if (sortBy === 'price') {
        providers.sort((a, b) => (a.serviceDetails?.minPrice || 0) - (b.serviceDetails?.minPrice || 0));
      } else if (sortBy === 'experience') {
        providers.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
      }
    }

    res.json({
      success: true,
      data: providers
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch providers'
    });
  }
};

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Get provider profile details
const getProviderProfile = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const provider = await ServiceProvider.findById(providerId)
      .select('-password -verificationDocuments')
      .populate('userId', 'name email phone');
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    // Get provider services
    const providerServices = await ProviderService.find({ providerId })
      .populate('serviceId', 'name category description');

    const profileData = {
      ...provider.toObject(),
      services: providerServices.map(ps => ({
        service: ps.serviceId,
        minPrice: ps.minPrice,
        maxPrice: ps.maxPrice,
        pricingType: ps.pricingType,
        specialization: ps.specialization,
        isAvailable: ps.isAvailable
      }))
    };

    res.json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error('Error fetching provider profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch provider profile'
    });
  }
};

module.exports = {
  getServices,
  createService,
  getAllServices,
  addProviderService,
  getProvidersByService,
  getProviderProfile
};