import axios from 'axios';

// Get API URL - Vite uses import.meta.env.VITE_ prefix
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL); // Debug log
console.log('All env vars:', import.meta.env); // Check what's available

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to headers');
    } else {
      console.warn('No token found in localStorage');
    }
    
    // Don't set Content-Type for FormData (browser will set it automatically)
    if (config.data instanceof FormData) {
      // Remove Content-Type header, let browser set it with boundary
      config.headers['Content-Type'] = undefined;
      console.log('FormData detected, removed Content-Type header');
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // Log request for debugging
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasToken: !!token,
      isFormData: config.data instanceof FormData,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  async (error) => {
    console.error('❌ API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers
    });

    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      throw new Error('Network error. Please check your internet connection and ensure the backend server is running.');
    }

    const originalRequest = error.config;

    // Handle 401 errors for token refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log('🔄 Attempting token refresh...');
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          console.log('✅ Token refreshed successfully');
          localStorage.setItem('accessToken', response.data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
    }

    // Return error with message from backend
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message ||
                        'Something went wrong!';

    throw new Error(errorMessage);
  }
);


export default api;