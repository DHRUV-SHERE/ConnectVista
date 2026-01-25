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
  // Get all services
  getServices: async () => {
    await throttleRequest();
    const response = await api.get('/api/services');
    return response.data;
  },

  // Get providers by service with location support
  getProvidersByService: async (serviceId, options = {}) => {
    await throttleRequest();
    const { city, minPrice, maxPrice, sortBy, lat, lng } = options;
    const params = new URLSearchParams();
    
    if (city) params.append('city', city);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sortBy) params.append('sortBy', sortBy);
    if (lat) params.append('lat', lat);
    if (lng) params.append('lng', lng);

    const response = await api.get(`/api/services/${serviceId}/providers?${params}`);
    return response.data;
  },

  // Get provider profile details
  getProviderProfile: async (providerId) => {
    await throttleRequest();
    const response = await api.get(`/api/services/provider/${providerId}`);
    return response.data;
  },

  // Get services with location-based provider sorting (simplified)
  getServicesWithLocation: async (userLocation) => {
    try {
      await throttleRequest();
      const servicesResponse = await api.get('/api/services');
      const services = servicesResponse.data.data || [];

      // Return services without fetching all providers to avoid rate limiting
      return {
        success: true,
        data: services.map(service => ({
          ...service,
          nearbyProviders: [],
          providerCount: service.providerCount || 0
        }))
      };
    } catch (error) {
      console.error('Error fetching services with location:', error);
      throw error;
    }
  }
};

export default serviceAPI;