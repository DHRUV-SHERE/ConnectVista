import api from './api';

export const verificationAPI = {
  getStatus: async () => {
    const response = await api.get('/verification/status');
    return response.data;
  },

  uploadDocuments: async (formData, onProgress) => {
    const response = await api.post('/verification/upload', formData, {
      onUploadProgress: onProgress
    });
    return response.data;
  },

  deleteDocument: async (documentId) => {
    const response = await api.delete(`/verification/document/${documentId}`);
    return response.data;
  }
};

export default verificationAPI;
