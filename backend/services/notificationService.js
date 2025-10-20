const db = require('../config/db');

module.exports = {
  async listChannels({ limit = 50, offset = 0 } = {}) {
    const res = await db.query(`SELECT * FROM admin_notification_channels ORDER BY id DESC LIMIT $1 OFFSET $2`, [limit, offset]);
    return { items: res.rows, total: res.rowCount, limit, offset };
  },
  async getChannel(id) {
    const res = await db.query(`SELECT * FROM admin_notification_channels WHERE id = $1`, [id]);
    return res.rows[0] || null;
  },
  async createChannel({ name, type, config = {}, enabled = true }) {
    const res = await db.query(`INSERT INTO admin_notification_channels(name,type,config,enabled) VALUES($1,$2,$3,$4) RETURNING *`, [name, type, config, enabled]);
    return res.rows[0];
  },
  async updateChannel(id, patch) {
    const keys = [], values = []; let idx = 1;
    for (const k of Object.keys(patch)) { keys.push(`${k} = $${idx++}`); values.push(patch[k]); }
    if (!keys.length) return this.getChannel(id);
    values.push(id);
    const res = await db.query(`UPDATE admin_notification_channels SET ${keys.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return res.rows[0];
  },
  async deleteChannel(id) { await db.query(`DELETE FROM admin_notification_channels WHERE id = $1`, [id]); return { ok: true }; }
};
