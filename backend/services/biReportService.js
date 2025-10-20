const db = require('../config/db');
const { EventEmitter } = require('events');

const biService = {
  async getKPISnapshot() {
    // sample implementation: aggregate counts (using UUID strings everywhere)
    const resUsers = await db.query('SELECT COUNT(*)::int as total FROM users');
    const resActive = await db.query("SELECT COUNT(DISTINCT user_id)::int as active FROM sadhana_activity WHERE created_at > NOW() - INTERVAL '1 day'");
    const resCompleted = await db.query("SELECT COUNT(*)::int as completed FROM sadhana_progress WHERE completed = true");
    const avgSession = await db.query("SELECT COALESCE(AVG(duration_minutes),0)::float as avg_minutes FROM sadhana_progress");
    const milestones = await db.query("SELECT COUNT(*)::int as total FROM spiritual_milestones");

    return {
      daily_active_practitioners: resActive.rows[0]?.active ?? 0,
      completion_rates: resCompleted.rows[0]?.completed ?? 0,
      average_session_duration_seconds: Math.round((avgSession.rows[0]?.avg_minutes ?? 0) * 60),
      milestone_achievements: { total: milestones.rows[0]?.total ?? 0 },
      timestamp: new Date().toISOString(),
    };
  },

  async getSpiritualProgressAnalytics(filters = {}) {
    const { from, to } = filters;
    const params = [];
    let sql = `SELECT date_trunc('day', sp.updated_at) as day, COUNT(*) as achieved FROM spiritual_milestones sp WHERE 1=1`;
    if (from) { params.push(from); sql += ` AND sp.updated_at >= $${params.length}`; }
    if (to) { params.push(to); sql += ` AND sp.updated_at <= $${params.length}`; }
    sql += ` GROUP BY day ORDER BY day DESC LIMIT 100`;
    const rows = (await db.query(sql, params)).rows;
    return { items: rows };
  },

  async getEngagementAnalytics(timeframe = '30d') {
    const sql = `SELECT COUNT(DISTINCT user_id)::int as active FROM sadhana_activity WHERE created_at > NOW() - INTERVAL '${timeframe}'`;
    const r = await db.query(sql);
    return { active: r.rows[0]?.active ?? 0 };
  },

  async getCommunityHealthMetrics() {
    // derive some basic community health metrics using communityService queries
    try {
      const communityStats = {};
      const posts = await db.query('SELECT COUNT(*)::int as total FROM community_posts');
      const comments = await db.query('SELECT COUNT(*)::int as total FROM community_comments');
      const activeCommunity = await db.query("SELECT COUNT(DISTINCT user_id)::int as active FROM community_activity WHERE created_at > NOW() - INTERVAL '30 days'");
      const mentorships = await db.query("SELECT COUNT(*)::int as total FROM mentorship_programs WHERE status = 'active'");
      communityStats.posts = posts.rows[0]?.total ?? 0;
      communityStats.comments = comments.rows[0]?.total ?? 0;
      communityStats.active_users_30d = activeCommunity.rows[0]?.active ?? 0;
      communityStats.active_mentorships = mentorships.rows[0]?.total ?? 0;
      return { items: communityStats };
    } catch (e) {
      console.error('getCommunityHealthMetrics error', e);
      return { items: {}, note: 'Error computing community metrics' };
    }
  },

  // Templates CRUD
  async getReportTemplates({ limit = 50, offset = 0, q } = {}) {
    const vals = [];
    let where = '';
    if (q) { vals.push(`%${q}%`); where = ` WHERE name ILIKE $${vals.length}`; }
    vals.push(limit);
    vals.push(offset);
    const rows = (await db.query(`SELECT * FROM report_templates ${where} ORDER BY created_at DESC LIMIT $${vals.length - 1} OFFSET $${vals.length}`, vals)).rows;
    const totalParams = where ? vals.slice(0, 1) : vals.slice(0, 2);
    const total = (await db.query(`SELECT COUNT(*)::int as total FROM report_templates ${where}`, totalParams)).rows[0]?.total ?? rows.length;
    return { items: rows, total };
  },

  async createReportTemplate(def) {
    const sql = `INSERT INTO report_templates (name, description, template, template_type, owner_id, is_public, created_at, updated_at) VALUES ($1,$2,$3::jsonb,$4,$5,$6,NOW(),NOW()) RETURNING *`;
    const vals = [def.name, def.description || null, JSON.stringify(def.template || {}), def.template_type || 'custom', def.owner_id || null, def.is_public || false];
    const r = await db.query(sql, vals);
    return r.rows[0];
  },

  async updateReportTemplate(id, updates) {
    const sql = `UPDATE report_templates SET name = COALESCE($1,name), description = COALESCE($2,description), template = COALESCE($3::jsonb, template), template_type = COALESCE($4, template_type), is_public = COALESCE($5,is_public), updated_at = NOW() WHERE id = $6 RETURNING *`;
    const vals = [updates.name || null, updates.description || null, updates.template ? JSON.stringify(updates.template) : null, updates.template_type || null, typeof updates.is_public === 'boolean' ? updates.is_public : null, id];
    const r = await db.query(sql, vals);
    return r.rows[0];
  },

  async deleteReportTemplate(id) {
    await db.query('DELETE FROM report_templates WHERE id = $1', [id]);
    return { ok: true };
  },

  async executeReportTemplate(templateId, params = {}) {
    const tpl = (await db.query('SELECT * FROM report_templates WHERE id = $1', [templateId])).rows[0];
    if (!tpl) throw new Error('Template not found');
    const started = new Date().toISOString();
    // Placeholder: pretend to run queries; return a result object with optional result_url
    const resultData = { preview: true, template: tpl.template, params };
    const finished = new Date().toISOString();
    const execRes = await db.query('INSERT INTO report_executions (template_id, scheduled_id, status, started_at, finished_at, result_data, result_url, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING *', [templateId, null, 'completed', started, finished, JSON.stringify(resultData), null]);
    return execRes.rows[0];
  },

  async getReportExecutions({ templateId, scheduledId, limit = 50, offset = 0 } = {}) {
    const params = [];
    let where = [];
    if (templateId) { params.push(templateId); where.push(`template_id = $${params.length}`); }
    if (scheduledId) { params.push(scheduledId); where.push(`scheduled_id = $${params.length}`); }
    params.push(limit); params.push(offset);
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const q = `SELECT * FROM report_executions ${whereSql} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;
    const r = await db.query(q, params);
    const total = (await db.query(`SELECT COUNT(*)::int as total FROM report_executions ${whereSql}`, params.slice(0, params.length - 2))).rows[0]?.total ?? r.rows.length;
    return { items: r.rows, total };
  },

};

module.exports = biService;
