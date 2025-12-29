import api from './api';

const profileService = {
  // Get provider profile
  getProviderProfile: async () => {
    const response = await api.get('/profile/provider');
    return response.data;
  },

  // Update provider profile
  updateProviderProfile: async (profileData) => {
    const response = await api.put('/profile/provider', profileData);
    return response.data;
  },

  // Upload business images
  uploadBusinessImages: async (images) => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    
    const response = await api.post('/profile/provider/images', formData);
    return response.data;
  },

  // Delete business image
  deleteBusinessImage: async (imageIndex) => {
    const response = await api.delete(`/profile/provider/images/${imageIndex}`);
    return response.data;
  }
};

export default profileService;