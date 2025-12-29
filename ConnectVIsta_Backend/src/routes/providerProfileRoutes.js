const express = require('express');
const router = express.Router();
const {
  getProviderProfile,
  updateProviderProfile,
  uploadBusinessImages,
  deleteBusinessImage
} = require('../controllers/providerProfileController');
const auth = require('../middleware/auth');
const upload = require('../middleware/uploadBusinessImages');

// Get provider profile
router.get('/provider', auth(['provider']), getProviderProfile);

// Update provider profile
router.put('/provider', auth(['provider']), updateProviderProfile);

// Upload business images
router.post('/provider/images', auth(['provider']), upload.array('images', 10), uploadBusinessImages);

// Delete business image
router.delete('/provider/images/:imageIndex', auth(['provider']), deleteBusinessImage);

module.exports = router;