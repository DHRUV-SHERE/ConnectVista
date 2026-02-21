import api from './api';

export const settingsAPI = {
  getSettings: async () => {
    const response = await api.get('/api/settings');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/api/settings/profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.put('/api/settings/password', data);
    return response.data;
  },

  updateNotifications: async (data) => {
    const response = await api.put('/api/settings/notifications', data);
    return response.data;
  },

  updatePrivacy: async (data) => {
    const response = await api.put('/api/settings/privacy', data);
    return response.data;
  }
};

export default settingsAPI;
