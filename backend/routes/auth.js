const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/waitlist', AuthController.joinWaitlist);

// Protected routes
router.get('/me', authenticate, AuthController.getCurrentUser);

module.exports = router;