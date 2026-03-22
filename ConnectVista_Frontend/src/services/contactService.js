import api from './api';

export const contactService = {
  submitContact: async (data) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  getContacts: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    const response = await api.get(`/contact?${params}`);
    return response.data;
  },

  getContactById: async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  updateContact: async (id, data) => {
    const response = await api.patch(`/contact/${id}`, data);
    return response.data;
  },

  deleteContact: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },

  getContactStats: async () => {
    const response = await api.get('/contact/stats');
    return response.data;
  }
};

export default contactService;
