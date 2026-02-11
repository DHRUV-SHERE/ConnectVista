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
  },

  // ==========================================
  // SEEKER-SPECIFIC SERVICE DISCOVERY APIs
  // ==========================================

  /**
   * Get all service categories with aggregated price ranges
   * Returns services with min/max prices from all providers
   */
  getSeekerServices: async () => {
    await throttleRequest();
    const response = await api.get('/api/seeker/services');
    return response.data;
  },

  /**
   * Get nearby providers for a specific service category
   * @param {string} categoryId - Service category ID (e.g., 'plumbing_water_services')
   * @param {object} options - Query options
   * @param {number} options.lat - Seeker latitude (required)
   * @param {number} options.lng - Seeker longitude (required)
   * @param {number} options.radius - Search radius in km (default: 15, max: 50)
   * @param {string} options.sortBy - Sort order: distance|rating|price-low|price-high|experience
   * @param {number} options.page - Page number for pagination
   * @param {number} options.limit - Results per page (max: 50)
   */
  getNearbyProviders: async (categoryId, options = {}) => {
    await throttleRequest();
    const { lat, lng, radius = 15, sortBy = 'distance', page = 1, limit = 20 } = options;

    const params = new URLSearchParams();
    if (lat) params.append('lat', lat);
    if (lng) params.append('lng', lng);
    if (radius) params.append('radius', radius);
    if (sortBy) params.append('sortBy', sortBy);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const response = await api.get(`/api/seeker/services/${categoryId}/providers?${params}`);
    return response.data;
  },

  /**
   * Get detailed provider profile including portfolio, reviews, and schedule
   * @param {string} providerId - Provider ObjectId
   */
  getProviderFullDetails: async (providerId) => {
    await throttleRequest();
    const response = await api.get(`/api/seeker/providers/${providerId}`);
    return response.data;
  },

  // ==========================================
  // BOOKING APIs
  // ==========================================

  /**
   * Create a new booking request
   * @param {object} bookingData - Booking details
   * @param {string} bookingData.providerId - Provider ObjectId
   * @param {string} bookingData.serviceId - Service ObjectId (optional)
   * @param {string} bookingData.bookingDate - Date in YYYY-MM-DD format
   * @param {string} bookingData.bookingTime - Time in HH:MM format (24-hour)
   * @param {string} bookingData.priority - 'normal' or 'urgent'
   * @param {object} bookingData.serviceAddress - Service address object
   * @param {string} bookingData.additionalNote - Optional notes
   * @param {string} bookingData.contactPhone - Contact phone number
   */
  createBooking: async (bookingData) => {
    await throttleRequest();
    const response = await api.post('/api/bookings', bookingData);
    return response.data;
  },

  /**
   * Get seeker's booking history
   * @param {object} options - Query options
   * @param {string} options.status - Filter by status (pending, accepted, rejected, completed, cancelled)
   * @param {number} options.page - Page number
   * @param {number} options.limit - Results per page
   */
  getSeekerBookings: async (options = {}) => {
    await throttleRequest();
    const { status, page = 1, limit = 10 } = options;
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const response = await api.get(`/api/bookings/seeker?${params}`);
    return response.data;
  },

  /**
   * Get provider's booking requests
   * @param {object} options - Query options
   * @param {string} options.status - Filter by status
   * @param {number} options.page - Page number
   * @param {number} options.limit - Results per page
   */
  getProviderBookings: async (options = {}) => {
    await throttleRequest();
    const { status, page = 1, limit = 10 } = options;
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const response = await api.get(`/api/bookings/provider?${params}`);
    return response.data;
  },

  /**
   * Get single booking by ID
   * @param {string} bookingId - Booking ObjectId
   */
  getBookingById: async (bookingId) => {
    await throttleRequest();
    const response = await api.get(`/api/bookings/${bookingId}`);
    return response.data;
  },

  /**
   * Accept a booking request (provider only)
   * @param {string} bookingId - Booking ObjectId
   */
  acceptBooking: async (bookingId) => {
    await throttleRequest();
    const response = await api.patch(`/api/bookings/${bookingId}/accept`);
    return response.data;
  },

  /**
   * Reject a booking request (provider only)
   * @param {string} bookingId - Booking ObjectId
   * @param {string} reason - Optional rejection reason
   */
  rejectBooking: async (bookingId, reason = '') => {
    await throttleRequest();
    const response = await api.patch(`/api/bookings/${bookingId}/reject`, { reason });
    return response.data;
  },

  /**
   * Cancel a booking (seeker or provider)
   * @param {string} bookingId - Booking ObjectId
   * @param {string} reason - Optional cancellation reason
   */
  cancelBooking: async (bookingId, reason = '') => {
    await throttleRequest();
    const response = await api.patch(`/api/bookings/${bookingId}/cancel`, { reason });
    return response.data;
  },

  // ==========================================
  // NOTIFICATION APIs
  // ==========================================

  /**
   * Get user's notifications
   * @param {object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Results per page
   * @param {string} options.category - Filter by category (booking, payment, verification, system)
   * @param {boolean} options.isRead - Filter by read status
   */
  getNotifications: async (options = {}) => {
    await throttleRequest();
    const { page = 1, limit = 20, category, isRead } = options;
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (category && category !== 'all') params.append('category', category);
    if (isRead !== undefined) params.append('isRead', isRead);

    const response = await api.get(`/api/notifications?${params}`);
    return response.data;
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async () => {
    await throttleRequest();
    const response = await api.get('/api/notifications/unread-count');
    return response.data;
  },

  /**
   * Mark a notification as read
   * @param {string} notificationId - Notification ObjectId
   */
  markNotificationAsRead: async (notificationId) => {
    await throttleRequest();
    const response = await api.patch(`/api/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead: async () => {
    await throttleRequest();
    const response = await api.patch('/api/notifications/read-all');
    return response.data;
  },

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ObjectId
   */
  deleteNotification: async (notificationId) => {
    await throttleRequest();
    const response = await api.delete(`/api/notifications/${notificationId}`);
    return response.data;
  },

  // ==========================================
  // SEEKER PROFILE APIs
  // ==========================================

  /**
   * Get seeker profile
   */
  getSeekerProfile: async () => {
    await throttleRequest();
    const response = await api.get('/api/seeker/profile');
    return response.data;
  },

  /**
   * Update seeker profile
   * @param {object} profileData - Profile data to update
   */
  updateSeekerProfile: async (profileData) => {
    await throttleRequest();
    const response = await api.put('/api/seeker/profile', profileData);
    return response.data;
  }
};

export default serviceAPI;
