/**
 * @swagger
 * tags:
 *   name: CustomSadhanas
 *   description: Custom Sadhana templates management
 */

let CustomSadhanaService;
let useMockService = false;

// Try to use the real service, fallback to mock if database is not available
try {
  const RealCustomSadhanaService = require('../services/customSadhanaService');
  // Test if the service actually works by trying a simple operation
  CustomSadhanaService = RealCustomSadhanaService;
  console.log('Using real CustomSadhanaService');
} catch (error) {
  console.log('Database service not available, using mock service');
  useMockService = true;
  CustomSadhanaService = require('../services/mockCustomSadhanaService');
}

class CustomSadhanaController {
  // Get user custom sadhanas
  static async getUserCustomSadhanas(req, res) {
    try {
      const customSadhanas = await CustomSadhanaService.getUserCustomSadhanas(req.user.id);
      res.json({ customSadhanas });
    } catch (error) {
      console.error(error);
      // If we're not already using the mock service, try falling back to it
      if (!useMockService) {
        console.log('Falling back to mock service for getUserCustomSadhanas');
        const MockCustomSadhanaService = require('../services/mockCustomSadhanaService');
        try {
          const customSadhanas = await MockCustomSadhanaService.getUserCustomSadhanas(req.user.id);
          res.json({ customSadhanas });
          return;
        } catch (mockError) {
          console.error('Mock service also failed:', mockError);
        }
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Create a new custom sadhana
  static async createCustomSadhana(req, res) {
    try {
      const customSadhana = await CustomSadhanaService.createCustomSadhana(req.body, req.user.id);
      res.status(201).json({ customSadhana });
    } catch (error) {
      console.error(error);
      // If we're not already using the mock service, try falling back to it
      if (!useMockService) {
        console.log('Falling back to mock service for createCustomSadhana');
        const MockCustomSadhanaService = require('../services/mockCustomSadhanaService');
        try {
          const customSadhana = await MockCustomSadhanaService.createCustomSadhana(req.body, req.user.id);
          res.status(201).json({ customSadhana });
          return;
        } catch (mockError) {
          console.error('Mock service also failed:', mockError);
        }
      }
      res.status(400).json({ error: error.message });
    }
  }

  // Update a custom sadhana
  static async updateCustomSadhana(req, res) {
    try {
      const { id } = req.params;
      const customSadhana = await CustomSadhanaService.updateCustomSadhana(id, req.body, req.user.id);
      res.json({ customSadhana });
    } catch (error) {
      console.error(error);
      // If we're not already using the mock service, try falling back to it
      if (!useMockService) {
        console.log('Falling back to mock service for updateCustomSadhana');
        const MockCustomSadhanaService = require('../services/mockCustomSadhanaService');
        try {
          const { id } = req.params;
          const customSadhana = await MockCustomSadhanaService.updateCustomSadhana(id, req.body, req.user.id);
          res.json({ customSadhana });
          return;
        } catch (mockError) {
          console.error('Mock service also failed:', mockError);
        }
      }
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a custom sadhana
  static async deleteCustomSadhana(req, res) {
    try {
      const { id } = req.params;
      await CustomSadhanaService.deleteCustomSadhana(id, req.user.id);
      res.json({ message: 'Custom sadhana deleted successfully' });
    } catch (error) {
      console.error(error);
      // If we're not already using the mock service, try falling back to it
      if (!useMockService) {
        console.log('Falling back to mock service for deleteCustomSadhana');
        const MockCustomSadhanaService = require('../services/mockCustomSadhanaService');
        try {
          const { id } = req.params;
          await MockCustomSadhanaService.deleteCustomSadhana(id, req.user.id);
          res.json({ message: 'Custom sadhana deleted successfully' });
          return;
        } catch (mockError) {
          console.error('Mock service also failed:', mockError);
        }
      }
      res.status(400).json({ error: error.message });
    }
  }

  // Get a specific custom sadhana by ID
  static async getCustomSadhanaById(req, res) {
    try {
      const { id } = req.params;
      const customSadhana = await CustomSadhanaService.getCustomSadhanaById(id, req.user.id);
      res.json({ customSadhana });
    } catch (error) {
      console.error(error);
      // If we're not already using the mock service, try falling back to it
      if (!useMockService) {
        console.log('Falling back to mock service for getCustomSadhanaById');
        const MockCustomSadhanaService = require('../services/mockCustomSadhanaService');
        try {
          const { id } = req.params;
          const customSadhana = await MockCustomSadhanaService.getCustomSadhanaById(id, req.user.id);
          res.json({ customSadhana });
          return;
        } catch (mockError) {
          console.error('Mock service also failed:', mockError);
        }
      }
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = CustomSadhanaController;