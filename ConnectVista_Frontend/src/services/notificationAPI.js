import API from './api';

export const notificationAPI = {
  // Get notifications
  getNotifications: async (params) => {
    try {
      const response = await API.get('/notifications', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch notifications' };
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await API.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch unread count' };
    }
  },

  // Get category specific unread counts
  getCategoryCounts: async () => {
    try {
      const response = await API.get('/notifications/category-counts');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch category counts' };
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await API.patch('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark all as read' };
    }
  },

  // Mark by category as read
  markByCategoryAsRead: async (category) => {
    try {
      const response = await API.patch(`/notifications/read-category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark category as read' };
    }
  },

  // Mark single as read
  markAsRead: async (id) => {
    try {
      const response = await API.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark notification as read' };
    }
  },

  // Delete notification
  deleteNotification: async (id) => {
    try {
      const response = await API.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete notification' };
    }
  }
};
