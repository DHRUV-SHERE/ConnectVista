const ServiceProvider = require('../models/ServiceProvider');
const ProviderService = require('../models/ProviderService');
const ProviderPortfolio = require('../models/ProviderPortfolio');
const ProviderSchedule = require('../models/ProviderSchedule');
const Review = require('../models/Review');
const serviceCatalog = require('../../data/services.json');
const mongoose = require('mongoose');

/**
 * Get all service categories with aggregated price ranges
 * @route GET /api/seeker/services
 * @access Protected (seeker only)
 */
const getServicesWithPriceRange = async (req, res) => {
  try {
    // Get location parameters for filtering
    const { lat, lng, radius = 15 } = req.query;
    const hasLocation = lat && lng;
    const radiusInMeters = parseInt(radius) * 1000; // Convert km to meters

    // Get categories from static catalog
    const categories = serviceCatalog.serviceCategories.filter(cat => cat.id !== 'other');

    // Build aggregation pipeline
    let aggregationPipeline = [
      {
        $match: { isAvailable: true }
      }
    ];

    // Add location-based filtering if coordinates provided
    if (hasLocation) {
      // First, we need to lookup the provider profile to get location
      aggregationPipeline.push(
        {
          $lookup: {
            from: 'serviceproviders',
            localField: 'provider',
            foreignField: '_id',
            as: 'providerProfile'
          }
        },
        {
          $unwind: '$providerProfile'
        },
        {
          $match: {
            'providerProfile.isVerified': true,
            'providerProfile.businessAddress.coordinates': { $exists: true }
          }
        },
        {
          $addFields: {
            distance: {
              $let: {
                vars: {
                  distance: {
                    $sqrt: {
                      $add: [
                        {
                          $pow: [
                            {
                              $multiply: [
                                { $subtract: [{ $arrayElemAt: ['$providerProfile.businessAddress.coordinates.coordinates', 1] }, parseFloat(lat)] },
                                111.12 // Approximate km per degree latitude
                              ]
                            },
                            2
                          ]
                        },
                        {
                          $pow: [
                            {
                              $multiply: [
                                {
                                  $multiply: [
                                    { $subtract: [{ $arrayElemAt: ['$providerProfile.businessAddress.coordinates.coordinates', 0] }, parseFloat(lng)] },
                                    { $cos: { $multiply: [parseFloat(lat), 0.0174533] } } // Convert lat to radians
                                  ]
                                },
                                111.12
                              ]
                            },
                            2
                          ]
                        }
                      ]
                    }
                  }
                },
                in: '$$distance'
              }
            }
          }
        },
        {
          $match: {
            distance: { $lte: parseFloat(radius) }
          }
        }
      );
    }

    // Group by service category to get counts and price ranges
    aggregationPipeline.push(
      {
        $group: {
          _id: '$mainService.name',
          minPrice: { $min: '$minPrice' },
          maxPrice: { $max: '$maxPrice' },
          providerCount: { $sum: 1 }
        }
      }
    );

    // Aggregate price data from ProviderService collection
    const priceAggregation = await ProviderService.aggregate(aggregationPipeline);

    // Create a map for quick lookup by service name
    const priceMap = {};
    priceAggregation.forEach(item => {
      priceMap[item._id] = {
        minPrice: item.minPrice,
        maxPrice: item.maxPrice,
        providerCount: item.providerCount
      };
    });

    // Combine categories with price data - match by name instead of id
    const servicesWithPrices = categories.map(category => {
      const priceData = priceMap[category.name] || { minPrice: 0, maxPrice: 0, providerCount: 0 };

      // Format price range
      let formattedPrice = 'Prices vary';
      if (priceData.minPrice > 0 && priceData.maxPrice > 0) {
        formattedPrice = `Starting from \u20B9${priceData.minPrice.toLocaleString('en-IN')} \u2013 \u20B9${priceData.maxPrice.toLocaleString('en-IN')}`;
      } else if (priceData.minPrice > 0) {
        formattedPrice = `Starting from \u20B9${priceData.minPrice.toLocaleString('en-IN')}`;
      }

      return {
        id: category.id,
        name: category.name,
        description: category.description || `Professional ${category.name} services`,
        icon: category.icon || getDefaultIcon(category.id),
        subServices: category.subServices.slice(0, 5), // Show first 5 sub-services as preview
        subServicesCount: category.subServices.length,
        providerCount: priceData.providerCount,
        priceRange: {
          min: priceData.minPrice,
          max: priceData.maxPrice,
          formatted: formattedPrice
        }
      };
    });

    res.json({
      success: true,
      data: servicesWithPrices,
      ...(hasLocation && { 
        location: { 
          lat: parseFloat(lat), 
          lng: parseFloat(lng), 
          radius: parseFloat(radius) 
        } 
      })
    });

  } catch (error) {
    console.error('Get services with price range error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
};

/**
 * Get nearby service providers for a specific service category
 * @route GET /api/seeker/services/:categoryId/providers
 * @access Protected (seeker only)
 */
const getNearbyProviders = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const {
      lat,
      lng,
      radius = 15,
      sortBy = 'distance',
      page = 1,
      limit = 20
    } = req.query;

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Valid latitude and longitude are required'
      });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Coordinates out of valid range'
      });
    }

    // Validate and cap radius (max 50km)
    const searchRadius = Math.min(Math.max(parseFloat(radius) || 15, 1), 50);
    const maxDistanceMeters = searchRadius * 1000;

    // Pagination
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    // Build aggregation pipeline
    const pipeline = [
      // Geospatial query - find providers within radius
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          distanceField: 'distanceInMeters',
          maxDistance: maxDistanceMeters,
          spherical: true,
          query: { isVerified: true }
        }
      },
      // Lookup provider services
      {
        $lookup: {
          from: 'providerservices',
          localField: '_id',
          foreignField: 'providerId',
          as: 'providerService'
        }
      },
      // Unwind provider service (each provider has one service document)
      {
        $unwind: {
          path: '$providerService',
          preserveNullAndEmptyArrays: false
        }
      },
      // Filter by category
      {
        $match: {
          'providerService.mainService.name': categoryId,
          'providerService.isAvailable': true
        }
      },
      // Add computed fields
      {
        $addFields: {
          distance: { $divide: ['$distanceInMeters', 1000] }, // Convert to km
          serviceDetails: {
            mainService: '$providerService.mainService.name',
            subServices: '$providerService.subServices',
            minPrice: '$providerService.minPrice',
            maxPrice: '$providerService.maxPrice',
            pricingType: '$providerService.pricingType'
          }
        }
      },
      // Project only safe fields (no sensitive data)
      {
        $project: {
          _id: 1,
          name: 1,
          businessName: 1,
          description: 1,
          experienceYears: 1,
          startingPrice: 1,
          isVerified: 1,
          totalJobsCompleted: 1,
          languages: 1,
          rating: {
            average: 1,
            count: 1
          },
          businessAddress: {
            city: 1,
            state: 1,
            coordinates: 1
          },
          businessImages: { $slice: ['$businessImages', 1] }, // Only first image
          distance: 1,
          serviceDetails: 1
        }
      }
    ];

    // Add sorting
    switch (sortBy) {
      case 'rating':
        pipeline.push({ $sort: { 'rating.average': -1, distance: 1 } });
        break;
      case 'price-low':
        pipeline.push({ $sort: { 'serviceDetails.minPrice': 1, distance: 1 } });
        break;
      case 'price-high':
        pipeline.push({ $sort: { 'serviceDetails.minPrice': -1, distance: 1 } });
        break;
      case 'experience':
        pipeline.push({ $sort: { experienceYears: -1, distance: 1 } });
        break;
      case 'distance':
      default:
        pipeline.push({ $sort: { distance: 1 } });
        break;
    }

    // Get total count before pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await ServiceProvider.aggregate(countPipeline);
    const totalCount = countResult[0]?.total || 0;

    // Add pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limitNum });

    // Execute query
    const providers = await ServiceProvider.aggregate(pipeline);

    // Get category info
    const categoryInfo = serviceCatalog.serviceCategories.find(cat => cat.id === categoryId);

    res.json({
      success: true,
      data: {
        category: {
          id: categoryId,
          name: categoryInfo?.name || categoryId
        },
        providers,
        searchParams: {
          latitude,
          longitude,
          radius: searchRadius,
          sortBy
        },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum),
          hasMore: skip + providers.length < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Get nearby providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby providers'
    });
  }
};

/**
 * Get detailed provider profile including portfolio, reviews, and schedule
 * @route GET /api/seeker/providers/:providerId
 * @access Protected (seeker only)
 */
const getProviderDetails = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid provider ID'
      });
    }

    // Fetch provider with all related data using aggregation
    const providerData = await ServiceProvider.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(providerId),
          isVerified: true
        }
      },
      // Lookup provider service
      {
        $lookup: {
          from: 'providerservices',
          localField: '_id',
          foreignField: 'providerId',
          as: 'services'
        }
      },
      // Lookup provider portfolio
      {
        $lookup: {
          from: 'providerportfolios',
          let: { providerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$providerId', '$$providerId'] },
                isActive: true
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 20 }
          ],
          as: 'portfolio'
        }
      },
      // Lookup provider schedule
      {
        $lookup: {
          from: 'providerschedules',
          localField: '_id',
          foreignField: 'providerId',
          as: 'schedule'
        }
      },
      // Lookup reviews with seeker info
      {
        $lookup: {
          from: 'reviews',
          let: { providerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$providerId', '$$providerId'] }
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            // Lookup seeker name for each review
            {
              $lookup: {
                from: 'serviceseekers',
                localField: 'seekerId',
                foreignField: '_id',
                as: 'seeker'
              }
            },
            {
              $unwind: {
                path: '$seeker',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                rating: 1,
                reviewText: 1,
                createdAt: 1,
                providerReply: 1,
                likes: 1,
                dislikes: 1,
                seekerName: { $ifNull: ['$seeker.name', 'Anonymous'] }
              }
            }
          ],
          as: 'reviews'
        }
      },
      // Project safe fields only
      {
        $project: {
          // Provider basic info
          _id: 1,
          name: 1,
          businessName: 1,
          description: 1,
          experienceYears: 1,
          languages: 1,
          isVerified: 1,
          totalJobsCompleted: 1,
          // Rating
          rating: {
            average: 1,
            count: 1,
            breakdown: 1
          },
          // Pricing
          startingPrice: 1,
          emergencyCharge: 1,
          extraChargeNote: 1,
          // Address (limited info)
          businessAddress: {
            city: 1,
            state: 1,
            pinCode: 1,
            coordinates: 1
          },
          // Images
          businessImages: 1,
          // Related data
          services: { $arrayElemAt: ['$services', 0] },
          portfolio: 1,
          schedule: { $arrayElemAt: ['$schedule', 0] },
          reviews: 1,
          // Timestamps
          createdAt: 1
        }
      }
    ]);

    if (!providerData || providerData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found or not verified'
      });
    }

    const provider = providerData[0];

    // Format response
    const response = {
      provider: {
        id: provider._id,
        name: provider.name,
        businessName: provider.businessName,
        description: provider.description,
        experienceYears: provider.experienceYears,
        languages: provider.languages || [],
        isVerified: provider.isVerified,
        totalJobsCompleted: provider.totalJobsCompleted || 0,
        memberSince: provider.createdAt,
        rating: provider.rating,
        pricing: {
          startingPrice: provider.startingPrice,
          emergencyCharge: provider.emergencyCharge,
          extraChargeNote: provider.extraChargeNote
        },
        location: {
          city: provider.businessAddress?.city,
          state: provider.businessAddress?.state,
          pinCode: provider.businessAddress?.pinCode,
          coordinates: provider.businessAddress?.coordinates
        },
        images: provider.businessImages || []
      },
      services: provider.services ? {
        mainService: provider.services.mainService?.name,
        subServices: provider.services.subServices?.map(s => s.name) || [],
        minPrice: provider.services.minPrice,
        maxPrice: provider.services.maxPrice,
        pricingType: provider.services.pricingType
      } : null,
      portfolio: provider.portfolio || [],
      schedule: provider.schedule ? {
        responseTime: formatResponseTime(provider.schedule.responseTime),
        serviceAreaRadius: provider.schedule.serviceAreaRadius,
        isAvailable: provider.schedule.isAvailable,
        weeklySchedule: provider.schedule.weeklySchedule
      } : {
        responseTime: 'Within 2 hours',
        serviceAreaRadius: 10,
        isAvailable: true,
        weeklySchedule: {
          monday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
          tuesday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
          wednesday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
          thursday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
          friday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
          saturday: { isAvailable: false, startTime: '10:00', endTime: '16:00' },
          sunday: { isAvailable: false, startTime: '10:00', endTime: '14:00' }
        }
      },
      reviews: {
        items: provider.reviews || [],
        totalCount: provider.rating?.count || 0
      }
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Get provider details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch provider details'
    });
  }
};

// Helper function to get default icon for category
function getDefaultIcon(categoryId) {
  const iconMap = {
    'plumbing_water_services': '\uD83D\uDEB0', // wrench
    'electrical_electronics': '\u26A1',
    'carpentry_woodwork': '\uD83E\uDE93', // axe
    'painting_polishing': '\uD83C\uDFA8', // palette
    'appliance_repair': '\uD83D\uDD27', // wrench
    'cleaning_sanitization': '\u2728', // sparkles
    'civil_construction': '\uD83C\uDFD7\uFE0F', // building construction
    'specialized_services': '\uD83D\uDD27'
  };
  return iconMap[categoryId] || '\uD83D\uDD27';
}

// Helper function to format response time
function formatResponseTime(responseTime) {
  const formatMap = {
    'within-30-min': 'Within 30 minutes',
    'within-1-hour': 'Within 1 hour',
    'within-2-hours': 'Within 2 hours',
    'within-4-hours': 'Within 4 hours',
    'next-day': 'Next day'
  };
  return formatMap[responseTime] || responseTime;
}

module.exports = {
  getServicesWithPriceRange,
  getNearbyProviders,
  getProviderDetails
};
