const express = require('express');
const router = express.Router();
const CustomSadhanaController = require('../controllers/customSadhanaController');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes for custom sadhanas
router.get('/', CustomSadhanaController.getUserCustomSadhanas);
router.post('/', CustomSadhanaController.createCustomSadhana);
router.get('/:id', CustomSadhanaController.getCustomSadhanaById);
router.put('/:id', CustomSadhanaController.updateCustomSadhana);
router.delete('/:id', CustomSadhanaController.deleteCustomSadhana);

module.exports = router;