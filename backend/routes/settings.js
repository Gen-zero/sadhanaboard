const express = require('express');
const SettingsController = require('../controllers/settingsController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, SettingsController.getSettings);
router.put('/', authenticate, SettingsController.updateSettings);

module.exports = router;