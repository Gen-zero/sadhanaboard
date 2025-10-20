const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const { adminAuthenticate } = require('../middleware/adminAuth');

// Public login
router.post('/login', adminAuthController.login);

// Protected registration (only logged-in admins can create other admins)
router.post('/register', adminAuthenticate, adminAuthController.register);

module.exports = router;
