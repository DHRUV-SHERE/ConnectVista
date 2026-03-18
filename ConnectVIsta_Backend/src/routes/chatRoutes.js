const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// All chat routes are protected
router.use(auth());

router.get('/conversations', chatController.getConversations);
router.get('/:bookingId', chatController.getMessages);
router.post('/send', chatController.sendMessage);

module.exports = router;
