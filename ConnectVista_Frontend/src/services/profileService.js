import api from './api';

const profileService = {
  getProviderProfile: async () => {
    const response = await api.get('/profile/provider');
    return response.data;
  },

  updateProviderProfile: async (profileData) => {
    const response = await api.put('/profile/provider', profileData);
    return response.data;
  },

  updateProviderServices: async (serviceData) => {
    const response = await api.put('/profile/provider/services', serviceData);
    return response.data;
  },

  uploadBusinessImages: async (images) => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    
    const response = await api.post('/profile/provider/images', formData);
    return response.data;
  },

  deleteBusinessImage: async (imageIndex) => {
    const response = await api.delete(`/profile/provider/images/${imageIndex}`);
    return response.data;
  }
};

export default profileService;