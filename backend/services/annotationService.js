const db = require('../config/db');

const createAnnotation = async ({ userId, bookId, page, position, content, isPrivate }) => {
  const sql = `INSERT INTO book_annotations (user_id, book_id, page, position, content, is_private, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,now(),now()) RETURNING *`;
  const params = [userId, bookId, page || null, position ? JSON.stringify(position) : null, content || null, isPrivate === undefined ? true : !!isPrivate];
  const res = await db.query(sql, params);
  return res.rows[0];
};

const listAnnotations = async ({ userId, bookId, includePublic=false }) => {
  if (includePublic) {
    const res = await db.query('SELECT * FROM book_annotations WHERE book_id = $1 AND (user_id = $2 OR is_private = false) ORDER BY created_at DESC', [bookId, userId]);
    return res.rows;
  }
  const res = await db.query('SELECT * FROM book_annotations WHERE user_id = $1 AND book_id = $2 ORDER BY created_at DESC', [userId, bookId]);
  return res.rows;
};

const updateAnnotation = async ({ id, userId, page, position, content, isPrivate }) => {
  const sql = `UPDATE book_annotations SET page = $1, position = $2, content = $3, is_private = $4, updated_at = now() WHERE id = $5 AND user_id = $6 RETURNING *`;
  const params = [page || null, position ? JSON.stringify(position) : null, content || null, !!isPrivate, id, userId];
  const res = await db.query(sql, params);
  return res.rows[0] || null;
};

const deleteAnnotation = async ({ id, userId }) => {
  await db.query('DELETE FROM book_annotations WHERE id = $1 AND user_id = $2', [id, userId]);
  return true;
};

module.exports = { createAnnotation, listAnnotations, updateAnnotation, deleteAnnotation };
