import api from './api';

export const settingsAPI = {
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/settings/profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.put('/settings/password', data);
    return response.data;
  },

  updateNotifications: async (data) => {
    const response = await api.put('/settings/notifications', data);
    return response.data;
  },

  updatePrivacy: async (data) => {
    const response = await api.put('/settings/privacy', data);
    return response.data;
  },

  downloadData: async () => {
    const response = await api.get('/settings/download-data');
    return response.data;
  }
};

export default settingsAPI;
