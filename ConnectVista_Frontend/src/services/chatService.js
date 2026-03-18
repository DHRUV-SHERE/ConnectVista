import api from './api';

export const chatAPI = {
  /**
   * Get all conversations for the current user
   */
  getConversations: async () => {
    try {
      const response = await api.get('/chat/conversations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get messages for a specific booking
   * @param {string} bookingId 
   */
  getMessages: async (bookingId) => {
    try {
      const response = await api.get(`/chat/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Send a message
   * @param {Object} messageData - { bookingId, message, attachments }
   */
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/chat/send', messageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default chatAPI;
