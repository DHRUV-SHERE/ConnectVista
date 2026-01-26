import api from './api';

// Get user's current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

// Calculate distance between two coordinates
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Format distance for display
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

// Request throttling utility
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // 100ms between requests

const throttleRequest = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
};

// Service API functions
export const serviceAPI = {
  // Get categories from JSON catalog with provider counts
  getCategories: async (options = {}) => {
    await throttleRequest();
    const { includeCounts = true, lat, lng, radius = 15 } = options;
    const params = new URLSearchParams();
    
    if (includeCounts) params.append('includeCounts', 'true');
    if (lat) params.append('lat', lat);
    if (lng) params.append('lng', lng);
    if (radius) params.append('radius', radius);

    const response = await api.get(`/api/service-catalog/categories?${params}`);
    return response.data;
  },

  // Get sub-services for a category from JSON catalog
  getSubServices: async (categoryId) => {
    await throttleRequest();
    const response = await api.get(`/api/service-catalog/categories/${categoryId}/sub-services`);
    return response.data;
  },

  // Provider service management
  getProviderService: async () => {
    await throttleRequest();
    const response = await api.get('/api/service-catalog/provider/service');
    return response.data;
  },

  saveProviderService: async (serviceData) => {
    await throttleRequest();
    const response = await api.post('/api/service-catalog/provider/service', serviceData);
    return response.data;
  },

  deleteProviderService: async () => {
    await throttleRequest();
    const response = await api.delete('/api/service-catalog/provider/service');
    return response.data;
  },

  // Get all services (from Service collection)
  getServices: async () => {
    await throttleRequest();
    const response = await api.get('/api/services');
    return response.data;
  },

  // Get providers by category with location support (new endpoint)
  getProvidersByCategory: async (categoryId, options = {}) => {
    await throttleRequest();
    const { minPrice, maxPrice, subServiceId, sortBy = 'distance', lat, lng, radius = 15 } = options;
    const params = new URLSearchParams();
    
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (subServiceId) params.append('subServiceId', subServiceId);
    if (sortBy) params.append('sortBy', sortBy);
    if (lat) params.append('lat', lat);
    if (lng) params.append('lng', lng);
    if (radius) params.append('radius', radius);

    const response = await api.get(`/api/services/categories/${categoryId}/providers?${params}`);
    return response.data;
  },

  // Legacy endpoint - kept for backward compatibility
  getProvidersByService: async (serviceId, options = {}) => {
    await throttleRequest();
    const { minPrice, maxPrice, sortBy = 'distance', lat, lng, radius = 15 } = options;
    const params = new URLSearchParams();
    
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sortBy) params.append('sortBy', sortBy);
    if (lat) params.append('lat', lat);
    if (lng) params.append('lng', lng);
    if (radius) params.append('radius', radius);

    const response = await api.get(`/api/services/${serviceId}/providers?${params}`);
    return response.data;
  },

  // Get provider profile details
  getProviderProfile: async (providerId) => {
    await throttleRequest();
    const response = await api.get(`/api/services/provider/${providerId}`);
    return response.data;
  },

  // Add provider service (may create custom request for "Other" category)
  addProviderService: async (serviceData) => {
    await throttleRequest();
    const response = await api.post('/api/services/provider', serviceData);
    return response.data;
  }
};

export default serviceAPI;
