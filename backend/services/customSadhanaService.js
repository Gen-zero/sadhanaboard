const db = require('../config/db');

class CustomSadhanaService {
  // Get all custom sadhanas for a user
  static async getUserCustomSadhanas(userId) {
    try {
      const query = `
        SELECT id, user_id, name, description, purpose, goal, deity, message, 
               offerings, duration_days, is_draft, created_at, updated_at
        FROM custom_sadhanas 
        WHERE user_id = $1 
        ORDER BY created_at DESC
      `;
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch custom sadhanas: ${error.message}`);
    }
  }

  // Create a new custom sadhana
  static async createCustomSadhana(sadhanaData, userId) {
    try {
      const {
        name,
        description,
        purpose,
        goal,
        deity,
        message,
        offerings,
        duration_days
      } = sadhanaData;

      const query = `
        INSERT INTO custom_sadhanas (
          user_id, name, description, purpose, goal, deity, message, 
          offerings, duration_days, is_draft
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, user_id, name, description, purpose, goal, deity, message, 
                  offerings, duration_days, is_draft, created_at, updated_at
      `;
      
      const values = [
        userId,
        name,
        description,
        purpose,
        goal,
        deity,
        message,
        JSON.stringify(offerings),
        duration_days,
        true // is_draft
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create custom sadhana: ${error.message}`);
    }
  }

  // Update a custom sadhana
  static async updateCustomSadhana(id, sadhanaData, userId) {
    try {
      const {
        name,
        description,
        purpose,
        goal,
        deity,
        message,
        offerings,
        duration_days,
        is_draft
      } = sadhanaData;

      const query = `
        UPDATE custom_sadhanas 
        SET name = $1, description = $2, purpose = $3, goal = $4, deity = $5, 
            message = $6, offerings = $7, duration_days = $8, is_draft = $9, 
            updated_at = NOW()
        WHERE id = $10 AND user_id = $11
        RETURNING id, user_id, name, description, purpose, goal, deity, message, 
                  offerings, duration_days, is_draft, created_at, updated_at
      `;
      
      const values = [
        name,
        description,
        purpose,
        goal,
        deity,
        message,
        JSON.stringify(offerings),
        duration_days,
        is_draft,
        id,
        userId
      ];

      const result = await db.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Custom sadhana not found or unauthorized');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update custom sadhana: ${error.message}`);
    }
  }

  // Delete a custom sadhana
  static async deleteCustomSadhana(id, userId) {
    try {
      const query = `
        DELETE FROM custom_sadhanas 
        WHERE id = $1 AND user_id = $2
        RETURNING id
      `;
      
      const values = [id, userId];
      const result = await db.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Custom sadhana not found or unauthorized');
      }
      
      return { id: result.rows[0].id };
    } catch (error) {
      throw new Error(`Failed to delete custom sadhana: ${error.message}`);
    }
  }

  // Get a specific custom sadhana by ID
  static async getCustomSadhanaById(id, userId) {
    try {
      const query = `
        SELECT id, user_id, name, description, purpose, goal, deity, message, 
               offerings, duration_days, is_draft, created_at, updated_at
        FROM custom_sadhanas 
        WHERE id = $1 AND user_id = $2
      `;
      
      const values = [id, userId];
      const result = await db.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Custom sadhana not found or unauthorized');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch custom sadhana: ${error.message}`);
    }
  }
}

module.exports = CustomSadhanaService;