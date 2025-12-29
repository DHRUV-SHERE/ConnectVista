const express = require('express');
const router = express.Router();
const { 
  uploadDocuments, 
  getVerificationStatus
} = require('../controllers/verificationController');
const { uploadDocuments: uploadMiddleware } = require('../middleware/upload');
const auth = require('../middleware/auth');

// Test route without auth first
router.post('/test-upload', uploadMiddleware, async (req, res) => {
  console.log('Test upload - Files:', req.files);
  res.json({ success: true, files: req.files });
});

// Then test with auth
router.post('/test-auth-upload', auth(['provider']), uploadMiddleware, async (req, res) => {
  console.log('Test auth upload - User:', req.user);
  console.log('Files:', req.files);
  res.json({ success: true, user: req.user, files: req.files });
});

// Actual routes
router.post('/upload', auth(['provider']), uploadMiddleware, uploadDocuments);
router.get('/status', auth(['provider']), getVerificationStatus);

module.exports = router;