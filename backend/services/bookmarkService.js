const db = require('../config/db');

const createBookmark = async ({ userId, bookId, label, page, position, isPublic }) => {
  const sql = `INSERT INTO book_bookmarks (user_id, book_id, label, page, position, is_public, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,now(),now()) RETURNING *`;
  const params = [userId, bookId, label || null, page || null, position ? JSON.stringify(position) : null, !!isPublic];
  const res = await db.query(sql, params);
  return res.rows[0];
};

const listBookmarks = async ({ userId, bookId }) => {
  const res = await db.query('SELECT * FROM book_bookmarks WHERE user_id = $1 AND book_id = $2 ORDER BY created_at DESC', [userId, bookId]);
  return res.rows;
};

const updateBookmark = async ({ id, userId, label, page, position, isPublic }) => {
  const sql = `UPDATE book_bookmarks SET label = $1, page = $2, position = $3, is_public = $4, updated_at = now() WHERE id = $5 AND user_id = $6 RETURNING *`;
  const params = [label || null, page || null, position ? JSON.stringify(position) : null, !!isPublic, id, userId];
  const res = await db.query(sql, params);
  return res.rows[0] || null;
};

const deleteBookmark = async ({ id, userId }) => {
  await db.query('DELETE FROM book_bookmarks WHERE id = $1 AND user_id = $2', [id, userId]);
  return true;
};

module.exports = { createBookmark, listBookmarks, updateBookmark, deleteBookmark };
