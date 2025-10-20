const db = require('../config/db');

module.exports = {
  async listFlags({ q = '', limit = 50, offset = 0 } = {}) {
    const params = [limit, offset];
    let sql = `SELECT * FROM admin_feature_flags ORDER BY id DESC LIMIT $1 OFFSET $2`;
    if (q) {
      sql = `SELECT * FROM admin_feature_flags WHERE key ILIKE $3 OR description ILIKE $3 ORDER BY id DESC LIMIT $1 OFFSET $2`;
      params.push(`%${q}%`);
    }
    const res = await db.query(sql, params);
    return { items: res.rows, total: res.rowCount, limit, offset };
  },
  async getFlag(keyOrId) {
    const byId = Number.isInteger(keyOrId) || !isNaN(Number(keyOrId));
    const sql = byId ? `SELECT * FROM admin_feature_flags WHERE id = $1` : `SELECT * FROM admin_feature_flags WHERE key = $1`;
    const res = await db.query(sql, [keyOrId]);
    return res.rows[0] || null;
  },
  async createFlag({ key, description = '', enabled = false, conditions = {} }) {
    const sql = `INSERT INTO admin_feature_flags(key, description, enabled, conditions) VALUES($1,$2,$3,$4) RETURNING *`;
    const res = await db.query(sql, [key, description, enabled, conditions]);
    return res.rows[0];
  },
  async updateFlag(id, patch) {
    const keys = [];
    const values = [];
    let idx = 1;
    for (const k of Object.keys(patch)) {
      keys.push(`${k} = $${idx++}`);
      values.push(patch[k]);
    }
    if (!keys.length) return this.getFlag(id);
    values.push(id);
    const sql = `UPDATE admin_feature_flags SET ${keys.join(', ')} WHERE id = $${idx} RETURNING *`;
    const res = await db.query(sql, values);
    return res.rows[0];
  },
  async deleteFlag(id) {
    await db.query(`DELETE FROM admin_feature_flags WHERE id = $1`, [id]);
    return { ok: true };
  }
};
