const db = require('../config/db');

module.exports = {
  async listExperiments({ q = '', limit = 50, offset = 0 } = {}) {
    const params = [limit, offset];
    let sql = `SELECT * FROM admin_ab_experiments ORDER BY id DESC LIMIT $1 OFFSET $2`;
    if (q) {
      sql = `SELECT * FROM admin_ab_experiments WHERE key ILIKE $3 OR description ILIKE $3 ORDER BY id DESC LIMIT $1 OFFSET $2`;
      params.push(`%${q}%`);
    }
    const res = await db.query(sql, params);
    return { items: res.rows, total: res.rowCount, limit, offset };
  },
  async getExperiment(keyOrId) {
    const sql = isNaN(Number(keyOrId)) ? `SELECT * FROM admin_ab_experiments WHERE key = $1` : `SELECT * FROM admin_ab_experiments WHERE id = $1`;
    const res = await db.query(sql, [keyOrId]);
    return res.rows[0] || null;
  },
  async createExperiment(payload) {
    const { key, description = '', variants = {}, traffic_allocation = {}, started_at = null, ended_at = null, active = true, metadata = {} } = payload;
    const sql = `INSERT INTO admin_ab_experiments(key, description, variants, traffic_allocation, started_at, ended_at, active, metadata) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const res = await db.query(sql, [key, description, variants, traffic_allocation, started_at, ended_at, active, metadata]);
    return res.rows[0];
  },
  async updateExperiment(id, patch) {
    const keys = [];
    const values = [];
    let idx = 1;
    for (const k of Object.keys(patch)) {
      keys.push(`${k} = $${idx++}`);
      values.push(patch[k]);
    }
    if (!keys.length) return this.getExperiment(id);
    values.push(id);
    const sql = `UPDATE admin_ab_experiments SET ${keys.join(', ')} WHERE id = $${idx} RETURNING *`;
    const res = await db.query(sql, values);
    return res.rows[0];
  },
  async deleteExperiment(id) {
    await db.query(`DELETE FROM admin_ab_experiments WHERE id = $1`, [id]);
    return { ok: true };
  }
};
