const db = require('../config/db');

module.exports = {
  async getAllEvents({ status, limit = 50, offset = 0 } = {}) {
    try {
      const params = [];
      let where = [];
      let idx = 1;
      if (status) { params.push(status); where.push(`status = $${idx++}`); }
      params.push(limit); params.push(offset);
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const r = await db.query(`SELECT * FROM community_events ${whereSql} ORDER BY start_time DESC LIMIT $${idx} OFFSET $${idx+1}`, params);
      return r.rows;
    } catch (e) { console.error('getAllEvents error', e); return []; }
  },

  async createEvent(data, createdBy) {
    try {
      const r = await db.query(`INSERT INTO community_events (title, description, event_type, start_time, end_time, location, max_participants, created_by, status, metadata, created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()) RETURNING *`, [data.title, data.description, data.event_type || 'meditation', data.start_time, data.end_time, data.location || null, data.max_participants || 0, createdBy || null, data.status || 'draft', data.metadata || {}]);
      return r.rows[0];
    } catch (e) { console.error('createEvent error', e); return null; }
  },

  async updateEvent(id, updates, adminId) {
    try {
      const allowed = new Set(['title','description','event_type','start_time','end_time','location','max_participants','status','metadata']);
      const fields = [];
      const params = [];
      let idx = 1;
      for (const k of Object.keys(updates || {})) {
        if (!allowed.has(k)) continue;
        fields.push(`${k} = $${idx}`);
        params.push(updates[k]);
        idx++;
      }
      // always update metadata safely if provided
      if (updates && typeof updates.metadata !== 'undefined' && !fields.includes('metadata')) {
        fields.push(`metadata = $${idx}`);
        params.push(updates.metadata);
        idx++;
      }
      if (fields.length === 0) return null;
      params.push(id);
      const sql = `UPDATE community_events SET ${fields.join(', ')}, /* preserved metadata */ metadata = COALESCE(metadata, '{}'::jsonb) WHERE id=$${idx} RETURNING *`;
      const r = await db.query(sql, params);
      return r.rows[0];
    } catch (e) { console.error('updateEvent error', e); return null; }
  },

  async cancelEvent(id, adminId, reason) {
    try {
      const meta = JSON.stringify({ cancelled_by: adminId, reason });
      const sql = `UPDATE community_events SET status=$1, metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb WHERE id=$3 RETURNING *`;
      const r = await db.query(sql, ['cancelled', meta, id]);
      return r.rows[0];
    } catch (e) { console.error('cancelEvent error', e); return null; }
  },

  async deleteEvent(id, adminId) { try { await db.query('DELETE FROM community_events WHERE id=$1', [id]); return true; } catch (e) { console.error(e); return false; } },

  async getEventParticipants(eventId) { try { const r = await db.query('SELECT ep.*, u.display_name as user_name FROM event_participants ep LEFT JOIN users u ON ep.user_id = u.id WHERE ep.event_id = $1', [eventId]); return r.rows; } catch (e) { console.error(e); return []; } },

  async addParticipant(eventId, userId) { try { const r = await db.query('INSERT INTO event_participants (event_id, user_id, status, joined_at) VALUES($1,$2,$3,NOW()) RETURNING *', [eventId, userId, 'registered']); return r.rows[0]; } catch (e) { console.error(e); return null; } },

  async removeParticipant(eventId, userId) { try { await db.query('DELETE FROM event_participants WHERE event_id=$1 AND user_id=$2', [eventId, userId]); return true; } catch (e) { console.error(e); return false; } },

  async getParticipationStats(eventId) { try { const r = await db.query('SELECT status, COUNT(*)::int as cnt FROM event_participants WHERE event_id=$1 GROUP BY status', [eventId]); return r.rows; } catch (e) { console.error(e); return []; } },

  async getUpcomingEvents(limit = 10) { try { const r = await db.query('SELECT * FROM community_events WHERE (status = $1 OR status = $2) AND start_time > NOW() ORDER BY start_time ASC LIMIT $3', ['published', 'active', limit]); return r.rows; } catch (e) { console.error(e); return []; } }
};
