const db = require('../config/db');

module.exports = {
  // createMilestone(userId, milestoneType, data)
  async createMilestone(userId, milestoneType, data = {}, achievedAt = null) {
    try {
      const r = await db.query('INSERT INTO spiritual_milestones (user_id, milestone_type, milestone_data, achieved_at) VALUES($1,$2,$3,$4) RETURNING *', [userId, milestoneType, data || {}, achievedAt || null]);
      return r.rows[0];
    } catch (e) { console.error('createMilestone', e); return null; }
  },

  async listMilestones({ userId, limit = 50, offset = 0 } = {}) {
    try {
      if (userId) {
        const r = await db.query('SELECT id, user_id, milestone_type, milestone_data, achieved_at FROM spiritual_milestones WHERE user_id=$1 ORDER BY achieved_at DESC LIMIT $2 OFFSET $3', [userId, limit, offset]);
        return r.rows;
      }
      const r = await db.query('SELECT id, user_id, milestone_type, milestone_data, achieved_at FROM spiritual_milestones ORDER BY achieved_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
      return r.rows;
    } catch (e) { console.error('listMilestones', e); return []; }
  },

  async getMilestone(id) { try { const r = await db.query('SELECT id, user_id, milestone_type, milestone_data, achieved_at FROM spiritual_milestones WHERE id=$1', [id]); return r.rows[0]; } catch (e) { console.error(e); return null; } },

  async deleteMilestone(id) { try { await db.query('DELETE FROM spiritual_milestones WHERE id=$1', [id]); return true; } catch (e) { console.error(e); return false; } }
};
