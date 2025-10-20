const db = require('../config/db');

module.exports = {
  async listIntegrations({ limit = 50, offset = 0 } = {}) {
    const res = await db.query(`SELECT id, name, provider, enabled, metadata, created_at, updated_at FROM admin_integrations ORDER BY id DESC LIMIT $1 OFFSET $2`, [limit, offset]);
    return { items: res.rows, total: res.rowCount, limit, offset };
  },
  async getIntegration(id) {
    const res = await db.query(`SELECT * FROM admin_integrations WHERE id = $1`, [id]);
    return res.rows[0] || null;
  },
  // Note: credentials are stored in JSONB. For production, encrypt credentials at rest.
  async createIntegration({ name, provider, credentials = {}, enabled = false, metadata = {} }) {
    const res = await db.query(`INSERT INTO admin_integrations(name,provider,credentials,enabled,metadata) VALUES($1,$2,$3,$4,$5) RETURNING *`, [name, provider, credentials, enabled, metadata]);
    return res.rows[0];
  },
  async updateIntegration(id, patch) {
    const keys = [], values = []; let idx = 1;
    for (const k of Object.keys(patch)) { keys.push(`${k} = $${idx++}`); values.push(patch[k]); }
    if (!keys.length) return this.getIntegration(id);
    values.push(id);
    const res = await db.query(`UPDATE admin_integrations SET ${keys.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return res.rows[0];
  },
  async deleteIntegration(id) { await db.query(`DELETE FROM admin_integrations WHERE id = $1`, [id]); return { ok: true }; }
};
