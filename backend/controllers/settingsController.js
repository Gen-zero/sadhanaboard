/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: User settings management
 */

const db = require('../config/db');

class SettingsController {
  // Get user settings
  static async getSettings(req, res) {
    try {
      const result = await db.query(
        `SELECT settings FROM profiles WHERE id = $1`,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      const settings = result.rows[0].settings || {};
      res.json({ settings });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update user settings
  static async updateSettings(req, res) {
    try {
      const { settings } = req.body;

      const result = await db.query(
        `UPDATE profiles 
         SET settings = $1,
             updated_at = NOW()
         WHERE id = $2
         RETURNING settings`,
        [settings, req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      res.json({ settings: result.rows[0].settings });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = SettingsController;