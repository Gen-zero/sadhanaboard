const db = require('../config/db');

module.exports = {
  async getActivityStream({ userId, type, limit = 50, offset = 0 } = {}) {
    try {
      const params = [];
      let where = [];
      let idx = 1;
      if (userId) { params.push(userId); where.push(`user_id = $${idx++}`); }
      if (type) { params.push(type); where.push(`activity_type = $${idx++}`); }
      params.push(limit); params.push(offset);
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const r = await db.query(`SELECT * FROM community_activity ${whereSql} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx+1}`, params);
      return r.rows;
    } catch (e) { console.error('getActivityStream error', e); return []; }
  },

  async createActivityEntry(userId, activityType, data = {}) {
    try {
      const res = await db.query(`INSERT INTO community_activity (user_id, activity_type, activity_data, created_at) VALUES($1,$2,$3,NOW()) RETURNING *`, [userId, activityType, data]);
      const row = res.rows[0];
      // emit to community stream if io is available
      try {
        // simple per-activity-type debounce to avoid broadcast storms
        if (!global.__community_emit_last) global.__community_emit_last = {};
        const last = global.__community_emit_last[activityType] || 0;
        const now = Date.now();
        const THROTTLE_MS = 500; // configurable
        if (now - last > THROTTLE_MS) {
          global.__community_emit_last[activityType] = now;
          if (global && global.__ADMIN_IO__) {
            global.__ADMIN_IO__.to('community:stream').emit('community:activity', row);
          }
          if (global && global.logBus && typeof global.logBus.emit === 'function') {
            global.logBus.emit('community:activity', row);
          }
        }
      } catch (e) { /* best-effort */ }
      return row;
    } catch (e) { console.error('createActivityEntry error', e); return null; }
  },

  async getActivityStats() {
    try {
      const r = await db.query(`SELECT activity_type, COUNT(*)::int as cnt FROM community_activity GROUP BY activity_type`);
      const map = {};
      r.rows.forEach(rw => map[rw.activity_type] = rw.cnt);
      return map;
    } catch (e) { console.error('getActivityStats error', e); return {}; }
  },

  // Posts
  async getAllPosts({ status, limit = 50, offset = 0 } = {}) {
    try {
      const params = [];
      let idx = 1;
      let where = [];
      if (status) { params.push(status); where.push(`status = $${idx++}`); }
      params.push(limit); params.push(offset);
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const r = await db.query(`SELECT p.*, u.display_name as user_name FROM community_posts p LEFT JOIN users u ON p.user_id = u.id ${whereSql} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx+1}`, params);
      return r.rows;
    } catch (e) { console.error('getAllPosts error', e); return []; }
  },

  async getPostById(id) {
    try { const r = await db.query('SELECT p.*, u.display_name as user_name FROM community_posts p LEFT JOIN users u ON p.user_id = u.id WHERE p.id=$1', [id]); return r.rows[0]; } catch (e) { console.error(e); return null; }
  },

  async approvePost(id, adminId) {
    try {
      const meta = JSON.stringify({ approved_by: adminId });
      const r = await db.query(`UPDATE community_posts SET status=$1, metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb, updated_at=NOW() WHERE id=$3 RETURNING *`, ['published', meta, id]);
      return r.rows[0];
    } catch (e) { console.error(e); return null; }
  },

  async rejectPost(id, adminId, reason) {
    try {
      const meta = JSON.stringify({ rejected_by: adminId, reason });
      const r = await db.query(`UPDATE community_posts SET status=$1, metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb, updated_at=NOW() WHERE id=$3 RETURNING *`, ['flagged', meta, id]);
      return r.rows[0];
    } catch (e) { console.error(e); return null; }
  },

  async deletePost(id, adminId) {
    try { await db.query('DELETE FROM community_posts WHERE id=$1', [id]);
      // record deletion in reports table as audit (best-effort)
      try { await db.query('INSERT INTO community_activity (user_id, activity_type, activity_data) VALUES($1,$2,$3)', [adminId || null, 'admin_delete_post', JSON.stringify({ post_id: id })]); } catch (ee) { /* ignore */ }
      return true; } catch (e) { console.error(e); return false; }
  },

  // Comments & reports (minimal)
  async getAllComments({ postId, status, limit = 50, offset = 0 } = {}) {
    try {
      const params = [];
      let where = [];
      let idx = 1;
      if (postId) { params.push(postId); where.push(`post_id = $${idx++}`); }
      if (status) { params.push(status); where.push(`status = $${idx++}`); }
      params.push(limit); params.push(offset);
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const r = await db.query(`SELECT c.*, u.display_name as user_name FROM community_comments c LEFT JOIN users u ON c.user_id = u.id ${whereSql} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx+1}`, params);
      return r.rows;
    } catch (e) { console.error(e); return []; }
  },

  async moderateComment(id, action, adminId) {
    try { const status = action === 'approve' ? 'visible' : action === 'hide' ? 'hidden' : 'review'; const r = await db.query('UPDATE community_comments SET status=$1 WHERE id=$2 RETURNING *', [status, id]); return r.rows[0]; } catch (e) { console.error(e); return null; }
  },

  async getReports({ status='pending', limit=50, offset=0 } = {}) {
    try { const r = await db.query('SELECT * FROM community_reports WHERE status=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [status, limit, offset]); return r.rows; } catch (e) { console.error(e); return []; }
  },

  async getReportsStats() {
    try { const r = await db.query('SELECT status, COUNT(*)::int as cnt FROM community_reports GROUP BY status'); return r.rows; } catch (e) { console.error(e); return []; }
  },

  async resolveReport(id, adminId, action, notes) {
    try {
      const status = action === 'dismiss' ? 'reviewed' : 'resolved';
      const r = await db.query(`UPDATE community_reports SET status=$1, admin_notes = COALESCE(admin_notes, '') || $2, resolved_by=$3, resolved_at=NOW() WHERE id=$4 RETURNING *`, [status, notes || '', adminId, id]);
      return r.rows[0];
    } catch (e) { console.error(e); return null; }
  },

  async createReport(reporterId, contentType, contentId, reason) {
    try { const r = await db.query('INSERT INTO community_reports (reporter_id, reported_content_type, reported_content_id, reason, status, created_at) VALUES($1,$2,$3,$4,$5,NOW()) RETURNING *', [reporterId, contentType, contentId, reason, 'pending']); return r.rows[0]; } catch (e) { console.error(e); return null; }
  }
};
