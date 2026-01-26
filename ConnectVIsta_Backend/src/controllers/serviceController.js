const serviceCatalog = require('../../data/services.json');
const ProviderService = require('../models/ProviderService');
const ServiceProvider = require('../models/ServiceProvider');

// Get categories from JSON catalog
const getCategories = async (req, res) => {
  try {
    const categories = serviceCatalog.serviceCategories.filter(cat => cat.id !== 'other');
    
    const categoriesWithCounts = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.id,
      description: category.description || `Professional ${category.name} services`,
      icon: category.icon || '🔧',
      providerCount: 0
    }));
    
    res.json({
      success: true,
      data: categoriesWithCounts
    });
    
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};

// Get sub-services for a category from JSON catalog
const getSubServices = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const category = serviceCatalog.serviceCategories.find(cat => cat.id === categoryId);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const subServices = category.subServices.map((subService, index) => ({
      id: `${categoryId}_${index}`,
      name: subService,
      categoryId
    }));
    
    res.json({
      success: true,
      data: subServices
    });
    
  } catch (error) {
    console.error('Get sub-services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sub-services'
    });
  }
};

// Get provider's current service
const getProviderService = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const providerService = await ProviderService.findOne({ providerId: provider._id });
    
    res.json({
      success: true,
      data: providerService
    });
  } catch (error) {
    console.error('Get provider service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch provider service'
    });
  }
};

// Create or update provider service
const saveProviderService = async (req, res) => {
  try {
    const { categoryKey, subServiceKeys, customServiceName, minPrice, maxPrice, pricingType } = req.body;
    
    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    if (!categoryKey) {
      return res.status(400).json({
        success: false,
        message: 'Category selection is required'
      });
    }

    // Remove existing service
    await ProviderService.deleteOne({ providerId: provider._id });

    // Prepare sub-services array
    const subServices = (subServiceKeys || []).map(subKey => ({
      name: subKey,
      serviceId: null
    }));

    // Create new service
    const serviceData = {
      providerId: provider._id,
      mainService: {
        name: categoryKey,
        serviceId: null
      },
      subServices,
      customService: {
        status: categoryKey === 'other' ? 'pending' : 'approved'
      },
      minPrice: minPrice || provider.startingPrice || 50,
      maxPrice: maxPrice || (minPrice || provider.startingPrice || 50) * 2,
      pricingType: pricingType || 'fixed',
      isAvailable: true
    };

    const newService = await ProviderService.create(serviceData);

    res.json({
      success: true,
      message: categoryKey === 'other' ? 'Custom service saved successfully' : 'Service saved successfully',
      data: newService
    });
  } catch (error) {
    console.error('Save provider service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save service'
    });
  }
};

// Delete provider service
const deleteProviderService = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    await ProviderService.deleteOne({ providerId: provider._id });

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete provider service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
};

module.exports = {
  getCategories,
  getSubServices,
  getProviderService,
  saveProviderService,
  deleteProviderService
};
