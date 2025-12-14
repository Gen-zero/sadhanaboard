const express = require('express');
const PanchangController = require('../controllers/panchangController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/panchang/:year/:month
 * @desc Get panchang data for a specific month and year
 * @access Private
 */
router.get('/:year/:month', authenticate, PanchangController.getPanchangData);

/**
 * @route POST /api/panchang/prefetch
 * @desc Prefetch panchang data for a range of years
 * @access Private (Admin only in production)
 */
router.post('/prefetch', authenticate, PanchangController.prefetchPanchangData);

module.exports = router;