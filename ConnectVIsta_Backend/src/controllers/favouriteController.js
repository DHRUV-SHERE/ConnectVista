const FavoriteServiceProvider = require('../models/FavouriteServiceProvider');
const ServiceProvider = require('../models/ServiceProvider');

// Get all favorite providers for a seeker
exports.getFavoriteProviders = async (req, res) => {
  try {
    const seekerId = req.user.id;

    const favorites = await FavoriteServiceProvider.find({ seekerId })
      .populate({
        path: 'providerId',
        select: 'businessName name businessAddress startingPrice rating userId',
        populate: {
          path: 'userId',
          select: 'name email phone'
        }
      })
      .sort({ createdAt: -1 });

    // Filter out any favorites where provider was deleted
    const validFavorites = favorites.filter(fav => fav.providerId);

    const formattedFavorites = validFavorites.map(fav => ({
      favoriteId: fav._id,
      provider: {
        id: fav.providerId._id,
        businessName: fav.providerId.businessName,
        name: fav.providerId.name,
        businessAddress: fav.providerId.businessAddress,
        startingPrice: fav.providerId.startingPrice,
        rating: fav.providerId.rating?.average || 0,
        ratingCount: fav.providerId.rating?.count || 0,
        contact: {
          name: fav.providerId.userId?.name,
          email: fav.providerId.userId?.email,
          phone: fav.providerId.userId?.phone
        }
      },
      addedAt: fav.createdAt
    }));

    res.status(200).json({
      success: true,
      message: 'Favorite providers retrieved successfully',
      data: formattedFavorites,
      count: formattedFavorites.length
    });
  } catch (error) {
    console.error('Error fetching favorite providers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorite providers',
      error: error.message
    });
  }
};

// Add a provider to favorites
exports.addFavoriteProvider = async (req, res) => {
  try {
    const seekerId = req.user.id;
    const { providerId } = req.body;

    if (!providerId) {
      return res.status(400).json({
        success: false,
        message: 'Provider ID is required'
      });
    }

    // Check if provider exists
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    // Check if already favorited
    const existingFavorite = await FavoriteServiceProvider.findOne({
      seekerId,
      providerId
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Provider is already in your favorites'
      });
    }

    // Create new favorite
    const favorite = new FavoriteServiceProvider({
      seekerId,
      providerId
    });

    await favorite.save();

    res.status(201).json({
      success: true,
      message: 'Provider added to favorites',
      data: {
        favoriteId: favorite._id,
        providerId: favorite.providerId,
        addedAt: favorite.createdAt
      }
    });
  } catch (error) {
    console.error('Error adding favorite provider:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add provider to favorites',
      error: error.message
    });
  }
};

// Remove a provider from favorites
exports.removeFavoriteProvider = async (req, res) => {
  try {
    const seekerId = req.user.id;
    const { providerId } = req.params;

    if (!providerId) {
      return res.status(400).json({
        success: false,
        message: 'Provider ID is required'
      });
    }

    const favorite = await FavoriteServiceProvider.findOneAndDelete({
      seekerId,
      providerId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Provider removed from favorites'
    });
  } catch (error) {
    console.error('Error removing favorite provider:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove provider from favorites',
      error: error.message
    });
  }
};

// Check if a provider is favorited
exports.isFavorite = async (req, res) => {
  try {
    const seekerId = req.user.id;
    const { providerId } = req.params;

    const favorite = await FavoriteServiceProvider.findOne({
      seekerId,
      providerId
    });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check favorite status',
      error: error.message
    });
  }
};

// Get favorite status for multiple providers (bulk check)
exports.getFavoriteStatuses = async (req, res) => {
  try {
    const seekerId = req.user.id;
    const { providerIds } = req.body;

    if (!providerIds || !Array.isArray(providerIds)) {
      return res.status(400).json({
        success: false,
        message: 'Provider IDs array is required'
      });
    }

    const favorites = await FavoriteServiceProvider.find({
      seekerId,
      providerId: { $in: providerIds }
    }).select('providerId');

    const favoriteProviderIds = favorites.map(fav => fav.providerId.toString());

    const statuses = {};
    providerIds.forEach(id => {
      statuses[id] = favoriteProviderIds.includes(id);
    });

    res.status(200).json({
      success: true,
      data: statuses
    });
  } catch (error) {
    console.error('Error checking favorite statuses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check favorite statuses',
      error: error.message
    });
  }
};
