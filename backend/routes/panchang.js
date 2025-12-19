const express = require('express');
const router = express.Router();
const panchangController = require('../controllers/panchangController');

/**
 * @route GET /api/panchang
 * @desc Get panchang data for a specific month and year
 * @access Public
 * @param {string} year - Year (e.g., 2023)
 * @param {string} month - Month (1-12)
 * @param {string} region - Region (e.g., 'Malayalam', 'Tamil', etc.)
 */
router.get('/', panchangController.getPanchangData);

module.exports = router;