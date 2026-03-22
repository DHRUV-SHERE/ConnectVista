// Admin API Service - For Admin Panel API calls
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
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

// Contact Service
export const contactService = {
  getContacts: async (page = 1, limit = 10, filters = {}) => {
    const params = { page, limit, ...filters };
    const response = await API.get('/contact', { params });
    return response.data;
  },

  getContactById: async (id) => {
    const response = await API.get(`/contact/${id}`);
    return response.data;
  },

  updateContact: async (id, data) => {
    const response = await API.patch(`/contact/${id}`, data);
    return response.data;
  },

  deleteContact: async (id) => {
    const response = await API.delete(`/contact/${id}`);
    return response.data;
  },

  getContactStats: async () => {
    const response = await API.get('/contact/stats');
    return response.data;
  }
};

// Support Service
export const supportService = {
  getSupportRequests: async (page = 1, limit = 10, filters = {}) => {
    const params = { page, limit, ...filters };
    const response = await API.get('/support', { params });
    return response.data;
  },

  getSupportRequestById: async (id) => {
    const response = await API.get(`/support/${id}`);
    return response.data;
  },

  updateSupportRequest: async (id, data) => {
    const response = await API.patch(`/support/${id}`, data);
    return response.data;
  },

  deleteSupportRequest: async (id) => {
    const response = await API.delete(`/support/${id}`);
    return response.data;
  },

  getSupportStats: async () => {
    const response = await API.get('/support/stats');
    return response.data;
  }
};

export default { contactService, supportService };
