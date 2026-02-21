import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const adminLogin = (credentials) => API.post('/auth/login', credentials);
export const adminLogout = () => {
  localStorage.removeItem('adminToken');
  return Promise.resolve();
};

// Dashboard
export const getDashboardStats = () => API.get('/admin/dashboard/stats');

// Users
export const getUsers = (params) => API.get('/admin/users', { params });
export const getSeekers = (params) => API.get('/admin/seekers', { params });
export const getProviders = (params) => API.get('/admin/providers', { params });
export const updateUserStatus = (id, data) => API.patch(`/admin/users/${id}/status`, data);

// Bookings
export const getBookings = (params) => API.get('/admin/bookings', { params });

// Revenue
export const getRevenue = (params) => API.get('/admin/revenue', { params });

// Verifications
export const getVerifications = (params) => API.get('/admin/verifications', { params });
export const updateVerification = (id, data) => API.patch(`/admin/verifications/${id}`, data);

export default API;
