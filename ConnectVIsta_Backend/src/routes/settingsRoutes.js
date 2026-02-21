const express = require('express');
const {
  getProviderSettings,
  updateProfileInfo,
  changePassword,
  updateNotifications,
  updatePrivacy
} = require('../controllers/settingsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth(['provider']), getProviderSettings);
router.put('/profile', auth(['provider']), updateProfileInfo);
router.put('/password', auth(['provider']), changePassword);
router.put('/notifications', auth(['provider']), updateNotifications);
router.put('/privacy', auth(['provider']), updatePrivacy);

module.exports = router;
