import API from './api';

export const walletAPI = {
  // Get wallet details and transaction history
  getWalletDetails: async () => {
    try {
      const response = await API.get('/wallet/details');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch wallet details' };
    }
  },

  // Top up wallet
  topUpWallet: async (amount) => {
    try {
      const response = await API.post('/wallet/topup', { amount });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to top up wallet' };
    }
  },

  // Update bank details
  updateBankDetails: async (bankData) => {
    try {
      const response = await API.patch('/wallet/bank-details', bankData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update bank details' };
    }
  },

  // Request payout
  requestPayout: async () => {
    try {
      const response = await API.post('/wallet/request-payout');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to request payout' };
    }
  }
};
