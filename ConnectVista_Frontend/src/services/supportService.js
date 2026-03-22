import api from './api';

export const supportService = {
  createSupportRequest: async (data) => {
    const response = await api.post('/support', data);
    return response.data;
  },

  getMyRequests: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    const response = await api.get(`/support/my-requests?${params}`);
    return response.data;
  },

  getSupportRequests: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    const response = await api.get(`/support?${params}`);
    return response.data;
  },

  getSupportRequestById: async (id) => {
    const response = await api.get(`/support/${id}`);
    return response.data;
  },

  updateSupportRequest: async (id, data) => {
    const response = await api.patch(`/support/${id}`, data);
    return response.data;
  },

  deleteSupportRequest: async (id) => {
    const response = await api.delete(`/support/${id}`);
    return response.data;
  },

  getSupportStats: async () => {
    const response = await api.get('/support/stats');
    return response.data;
  }
};

export default supportService;
