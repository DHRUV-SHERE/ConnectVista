import API from './api';

export const invoiceAPI = {
  // Generate invoice and complete service
  generateInvoice: async (invoiceData) => {
    try {
      const response = await API.post('/invoices/generate', invoiceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate invoice' };
    }
  },

  // Complete online payment (simulated)
  completeOnlinePayment: async (invoiceId) => {
    try {
      const response = await API.post(`/invoices/complete-payment/${invoiceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to complete payment' };
    }
  },

  // Get invoices for provider
  getProviderInvoices: async () => {
    try {
      const response = await API.get('/invoices/provider');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch invoices' };
    }
  },

  // Get invoices for seeker
  getSeekerInvoices: async () => {
    try {
      const response = await API.get('/invoices/seeker');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch invoices' };
    }
  }
};
