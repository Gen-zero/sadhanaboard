// Mock service for custom sadhanas - for testing when database is not available
const mockCustomSadhanas = new Map();

class MockCustomSadhanaService {
  // Get all custom sadhanas for a user
  static async getUserCustomSadhanas(userId) {
    try {
      const userSadhanas = [];
      for (const [id, sadhana] of mockCustomSadhanas.entries()) {
        if (sadhana.user_id === userId) {
          userSadhanas.push(sadhana);
        }
      }
      return userSadhanas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      throw new Error(`Failed to fetch custom sadhanas: ${error.message}`);
    }
  }

  // Create a new custom sadhana
  static async createCustomSadhana(sadhanaData, userId) {
    try {
      const id = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      
      const newSadhana = {
        id,
        user_id: userId,
        name: sadhanaData.name,
        description: sadhanaData.description,
        purpose: sadhanaData.purpose,
        goal: sadhanaData.goal,
        deity: sadhanaData.deity,
        message: sadhanaData.message,
        offerings: sadhanaData.offerings,
        duration_days: sadhanaData.duration_days,
        is_draft: true,
        created_at: now,
        updated_at: now
      };
      
      mockCustomSadhanas.set(id, newSadhana);
      return newSadhana;
    } catch (error) {
      throw new Error(`Failed to create custom sadhana: ${error.message}`);
    }
  }

  // Update a custom sadhana
  static async updateCustomSadhana(id, sadhanaData, userId) {
    try {
      const existingSadhana = mockCustomSadhanas.get(id);
      
      if (!existingSadhana) {
        throw new Error('Custom sadhana not found');
      }
      
      if (existingSadhana.user_id !== userId) {
        throw new Error('Unauthorized to update this custom sadhana');
      }
      
      const updatedSadhana = {
        ...existingSadhana,
        name: sadhanaData.name !== undefined ? sadhanaData.name : existingSadhana.name,
        description: sadhanaData.description !== undefined ? sadhanaData.description : existingSadhana.description,
        purpose: sadhanaData.purpose !== undefined ? sadhanaData.purpose : existingSadhana.purpose,
        goal: sadhanaData.goal !== undefined ? sadhanaData.goal : existingSadhana.goal,
        deity: sadhanaData.deity !== undefined ? sadhanaData.deity : existingSadhana.deity,
        message: sadhanaData.message !== undefined ? sadhanaData.message : existingSadhana.message,
        offerings: sadhanaData.offerings !== undefined ? sadhanaData.offerings : existingSadhana.offerings,
        duration_days: sadhanaData.duration_days !== undefined ? sadhanaData.duration_days : existingSadhana.duration_days,
        is_draft: sadhanaData.is_draft !== undefined ? sadhanaData.is_draft : existingSadhana.is_draft,
        updated_at: new Date().toISOString()
      };
      
      mockCustomSadhanas.set(id, updatedSadhana);
      return updatedSadhana;
    } catch (error) {
      throw new Error(`Failed to update custom sadhana: ${error.message}`);
    }
  }

  // Delete a custom sadhana
  static async deleteCustomSadhana(id, userId) {
    try {
      const existingSadhana = mockCustomSadhanas.get(id);
      
      if (!existingSadhana) {
        throw new Error('Custom sadhana not found');
      }
      
      if (existingSadhana.user_id !== userId) {
        throw new Error('Unauthorized to delete this custom sadhana');
      }
      
      mockCustomSadhanas.delete(id);
      return { id };
    } catch (error) {
      throw new Error(`Failed to delete custom sadhana: ${error.message}`);
    }
  }

  // Get a specific custom sadhana by ID
  static async getCustomSadhanaById(id, userId) {
    try {
      const sadhana = mockCustomSadhanas.get(id);
      
      if (!sadhana) {
        throw new Error('Custom sadhana not found');
      }
      
      if (sadhana.user_id !== userId) {
        throw new Error('Unauthorized to access this custom sadhana');
      }
      
      return sadhana;
    } catch (error) {
      throw new Error(`Failed to fetch custom sadhana: ${error.message}`);
    }
  }
}

module.exports = MockCustomSadhanaService;