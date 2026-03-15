const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const auth = require('../middleware/auth');

// Provider Wallet Routes
router.get('/details', auth(['provider']), walletController.getWalletDetails);
router.post('/topup', auth(['provider']), walletController.topUpWallet);
router.patch('/bank-details', auth(['provider']), walletController.updateBankDetails);
router.post('/request-payout', auth(['provider']), walletController.requestPayout);

module.exports = router;
