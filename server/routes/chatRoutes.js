const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

// Protected AI Accessibility Assistant Endpoint (Requires Login)
router.post('/', authenticateToken, chatController.chatWithAssistant);

module.exports = router;

