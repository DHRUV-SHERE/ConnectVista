import api from './api';

const authService = {
  // Signup for service seeker
  signupSeeker: async (userData) => {
    const response = await api.post('/auth/signup', {
      ...userData,
      role: 'seeker'
    });
    return response.data;
  },

  // Signup for service provider
  signupProvider: async (userData) => {
    const response = await api.post('/auth/signup', {
      ...userData,
      role: 'provider'
    });
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};

export default authService;