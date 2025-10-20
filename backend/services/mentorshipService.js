const db = require('../config/db');

module.exports = {
  async listPairs({ limit = 50, offset = 0 } = {}) {
    try { const r = await db.query('SELECT mp.*, m.display_name as mentor_name, me.display_name as mentee_name FROM mentorship_programs mp LEFT JOIN users m ON mp.mentor_id = m.id LEFT JOIN users me ON mp.mentee_id = me.id ORDER BY started_at DESC LIMIT $1 OFFSET $2', [limit, offset]); return r.rows; } catch (e) { console.error('listPairs', e); return []; }
  },

  async createMentorshipPair(mentorId, menteeId, programType = 'general', adminId) {
    try {
      const r = await db.query('INSERT INTO mentorship_programs (mentor_id, mentee_id, program_type, status, started_at, metadata) VALUES($1,$2,$3,$4,NOW(),$5) RETURNING *', [mentorId, menteeId, programType, 'active', JSON.stringify({ created_by: adminId })]);
      return r.rows[0];
    } catch (e) { console.error('createMentorshipPair', e); return null; }
  },

  async updatePairStatus(id, status, adminId) {
    try {
      const meta = JSON.stringify({ updated_by: adminId, status });
      const sql = `UPDATE mentorship_programs SET status=$1, metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb WHERE id=$3 RETURNING *`;
      const r = await db.query(sql, [status, meta, id]);
      return r.rows[0];
    } catch (e) { console.error('updatePairStatus', e); return null; }
  },

  async endMentorship(id, adminId) {
    try {
      const meta = JSON.stringify({ ended_by: adminId });
      const sql = `UPDATE mentorship_programs SET status=$1, ended_at=NOW(), metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb WHERE id=$3 RETURNING *`;
      const r = await db.query(sql, ['ended', meta, id]);
      return r.rows[0];
    } catch (e) { console.error('endMentorship', e); return null; }
  },

  async getPair(id) { try { const r = await db.query('SELECT * FROM mentorship_programs WHERE id=$1', [id]); return r.rows[0]; } catch (e) { console.error(e); return null; } },

  async deletePair(id) { try { await db.query('DELETE FROM mentorship_programs WHERE id=$1', [id]); return true; } catch (e) { console.error(e); return false; } }
};
