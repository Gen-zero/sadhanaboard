const db = require('../config/db');
const sanitizeHtml = str => (typeof str === 'string' ? str.replace(/<[^>]*>/g, '') : str);

const messageService = {
  async sendMessage(adminId, userId, content) {
    try {
      const clean = sanitizeHtml(content);
      const q = await db.query('INSERT INTO messages (sender_id, receiver_id, content, created_at, is_read) VALUES ($1, $2, $3, NOW(), false) RETURNING id, created_at', [adminId, userId, clean]);
      return q.rows[0];
    } catch (e) {
      console.error('sendMessage error', e);
      throw e;
    }
  },

  async getMessagesForUser(userId, limit = 50, offset = 0) {
    try {
      const q = await db.query('SELECT id, sender_id, receiver_id, content, created_at, is_read FROM messages WHERE (sender_id = $1 OR receiver_id = $1) ORDER BY created_at DESC LIMIT $2 OFFSET $3', [userId, Number(limit), Number(offset)]);
      return q.rows || [];
    } catch (e) {
      console.error('getMessagesForUser error', e);
      throw e;
    }
  },

  async markAsRead(messageId) {
    try {
      await db.query('UPDATE messages SET is_read = true WHERE id = $1', [messageId]);
      return { ok: true };
    } catch (e) {
      console.error('markAsRead error', e);
      throw e;
    }
  },

  async unreadCount(userId) {
    try {
      const q = await db.query('SELECT COUNT(*)::int AS unread FROM messages WHERE receiver_id=$1 AND is_read = false', [userId]);
      return q.rows[0].unread || 0;
    } catch (e) {
      console.error('unreadCount error', e);
      throw e;
    }
  }
};

module.exports = messageService;
