const db = require('../config/db');
const biService = require('./biReportService');

const insightService = {
  async generateUserInsights(userId) {
    // simple heuristics based on recent activity
    const sessions = (await db.query('SELECT COUNT(*)::int as c FROM sadhana_sessions WHERE user_id = $1 AND created_at > NOW() - INTERVAL \"30 days\"', [userId])).rows[0]?.c || 0;
    const milestones = (await db.query('SELECT COUNT(*)::int as c FROM spiritual_milestones WHERE user_id = $1', [userId])).rows[0]?.c || 0;
    const insight = {
      insight_type: 'practice_recommendation',
      user_id: userId,
      insight_data: { sessions_last_30d: sessions, milestones },
      confidence_score: sessions > 0 ? 0.8 : 0.6,
      generated_at: new Date().toISOString(),
    };
    const r = await db.query('INSERT INTO spiritual_insights (insight_type, user_id, insight_data, confidence_score, generated_at) VALUES ($1,$2,$3::jsonb,$4,$5) RETURNING *', [insight.insight_type, insight.user_id, JSON.stringify(insight.insight_data), insight.confidence_score, insight.generated_at]);
    // emit realtime
    try { if (global.__ADMIN_IO__) global.__ADMIN_IO__.to('bi-insights').emit('bi:insight-generated', r.rows[0]); } catch (e) {}
    return r.rows[0];
  },

  async generateCommunityInsights() {
    // example: most popular practices
    const r = await db.query('SELECT practice_type, COUNT(*)::int as count FROM sadhana_activity GROUP BY practice_type ORDER BY count DESC LIMIT 10');
    const insight = { insight_type: 'consistency_improvement', insight_data: { popular_practices: r.rows }, generated_at: new Date().toISOString() };
    // store a community insight record
    const res = await db.query('INSERT INTO spiritual_insights (insight_type, insight_data, confidence_score, generated_at) VALUES ($1,$2,$3,$4) RETURNING *', [insight.insight_type, JSON.stringify(insight.insight_data), 0.7, insight.generated_at]);
    try { if (global.__ADMIN_IO__) global.__ADMIN_IO__.to('bi-insights').emit('bi:insight-generated', res.rows[0]); } catch (e) {}
    return res.rows[0];
  },

  async getValidInsights(userId) {
    const rows = (await db.query('SELECT * FROM spiritual_insights WHERE (user_id = $1 OR user_id IS NULL) AND (expires_at IS NULL OR expires_at > NOW()) ORDER BY generated_at DESC LIMIT 100', [userId])).rows;
    return rows;
  },
};

module.exports = insightService;
