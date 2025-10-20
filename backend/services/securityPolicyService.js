const db = require('../config/db');

module.exports = {
  async listPolicies({ limit = 50, offset = 0 } = {}) {
    const res = await db.query(`SELECT * FROM admin_security_policies ORDER BY id DESC LIMIT $1 OFFSET $2`, [limit, offset]);
    return { items: res.rows, total: res.rowCount, limit, offset };
  },
  async getPolicy(id) {
    const res = await db.query(`SELECT * FROM admin_security_policies WHERE id = $1`, [id]);
    return res.rows[0] || null;
  },
  async createPolicy({ name, description = '', rules = [], enabled = true }) {
    const res = await db.query(`INSERT INTO admin_security_policies(name,description,rules,enabled) VALUES($1,$2,$3,$4) RETURNING *`, [name, description, rules, enabled]);
    return res.rows[0];
  },
  async updatePolicy(id, patch) {
    const keys = [], values = []; let idx = 1;
    for (const k of Object.keys(patch)) { keys.push(`${k} = $${idx++}`); values.push(patch[k]); }
    if (!keys.length) return this.getPolicy(id);
    values.push(id);
    const res = await db.query(`UPDATE admin_security_policies SET ${keys.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return res.rows[0];
  },
  async deletePolicy(id) { await db.query(`DELETE FROM admin_security_policies WHERE id = $1`, [id]); return { ok: true }; }
};
