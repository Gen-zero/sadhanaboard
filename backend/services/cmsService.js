const db = require('../config/db');
const path = require('path');
const fs = require('fs');
const themeRegistry = require('../utils/themeRegistry');

const cmsService = {
  async createAsset({ title, description, type, file_path, file_size, mime_type, metadata = {}, tags = [], category_id = null, created_by = null }) {
    const q = await db.query(
      `INSERT INTO cms_assets (title, description, type, file_path, file_size, mime_type, metadata, tags, category_id, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [title, description, type, file_path, file_size, mime_type, metadata, tags, category_id, created_by]
    );
    return q.rows[0];
  },

  async getAsset(id) {
    const q = await db.query('SELECT * FROM cms_assets WHERE id = $1', [id]);
    return q.rows[0] || null;
  },

  async listAssets({ q = '', limit = 20, offset = 0, tags = [] } = {}) {
    // basic search: title/description
    const like = `%${q}%`;
    const params = [like, like, Number(limit), Number(offset)];
    const sql = `SELECT * FROM cms_assets WHERE (title ILIKE $1 OR description ILIKE $2) ORDER BY id DESC LIMIT $3 OFFSET $4`;
    const r = await db.query(sql, params).catch(() => ({ rows: [] }));
    const count = await db.query(`SELECT COUNT(*)::int AS total FROM cms_assets WHERE (title ILIKE $1 OR description ILIKE $2)`, [like, like]).catch(() => ({ rows: [{ total: 0 }] }));
    return { items: r.rows, total: count.rows[0].total, limit: Number(limit), offset: Number(offset) };
  },

  async createTheme(theme) {
    // Require and validate registry_id (must be present and valid)
    if (!theme.registry_id || typeof theme.registry_id !== 'string') throw new Error('Missing registry_id');
    if (!themeRegistry.isValidThemeId(theme.registry_id)) throw new Error('Unknown theme id');
    // persist registry_id into registry_id column. For backwards compat, still write other fields.
    const payload = [theme.name, theme.deity, theme.description, theme.color_palette || {}, theme.css_variables || {}, theme.preview_image || null, theme.status || 'draft', theme.version || 1, theme.created_by || null, theme.registry_id];
    const q = await db.query('INSERT INTO cms_themes (name, deity, description, color_palette, css_variables, preview_image, status, version, created_by, registry_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *', payload);
    return q.rows[0];
  },

  async listThemes({ q = '', limit = 20, offset = 0 } = {}) {
    const like = `%${q}%`;
    const params = [like, like, Number(limit), Number(offset)];
    const sql = `SELECT * FROM cms_themes WHERE (name ILIKE $1 OR description ILIKE $2) ORDER BY id DESC LIMIT $3 OFFSET $4`;
    const r = await db.query(sql, params).catch(() => ({ rows: [] }));
    const countRes = await db.query(`SELECT COUNT(*)::int AS total FROM cms_themes WHERE (name ILIKE $1 OR description ILIKE $2)`, [like, like]).catch(() => ({ rows: [{ total: 0 }] }));
    // Enrich items with registry metadata by registry_id only
    const registry = themeRegistry.getRegistry() || [];
    const byId = Object.fromEntries((registry || []).map(t => [String(t.id), t.metadata]));
    const items = (r.rows || []).map(it => {
      const registryKey = it.registry_id; // require registry_id to merge
      return { ...it, registry: registryKey ? byId[String(registryKey)] || null : null };
    });
    return { items, total: countRes.rows[0].total, limit: Number(limit), offset: Number(offset) };
  },

  async createTemplate(template) {
    const q = await db.query('INSERT INTO cms_templates (title, description, type, difficulty_level, duration_minutes, instructions, components, tags, category_id, status, version, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
      [template.title, template.description, template.type, template.difficulty_level, template.duration_minutes || null, template.instructions || [], template.components || [], template.tags || [], template.category_id || null, template.status || 'draft', template.version || 1, template.created_by || null]
    );
    return q.rows[0];
  },

  async listTemplates({ q = '', limit = 20, offset = 0 } = {}) {
    const like = `%${q}%`;
    const params = [like, like, Number(limit), Number(offset)];
    const sql = `SELECT * FROM cms_templates WHERE (title ILIKE $1 OR description ILIKE $2) ORDER BY id DESC LIMIT $3 OFFSET $4`;
    const r = await db.query(sql, params).catch(() => ({ rows: [] }));
    const countRes = await db.query(`SELECT COUNT(*)::int AS total FROM cms_templates WHERE (title ILIKE $1 OR description ILIKE $2)`, [like, like]).catch(() => ({ rows: [{ total: 0 }] }));
    return { items: r.rows, total: countRes.rows[0].total, limit: Number(limit), offset: Number(offset) };
  },

  async insertVariants(assetId, variants = []) {
    if (!variants || !variants.length) return [];
    const values = [];
    const params = [];
    let idx = 1;
    for (const v of variants) {
      values.push(`($${idx++}, $${idx++}, $${idx++}, $${idx++})`);
      params.push(assetId, v.variant_type, v.file_path, v.file_size || null);
    }
    const sql = `INSERT INTO cms_asset_variants (asset_id, variant_type, file_path, file_size) VALUES ${values.join(',')} RETURNING *`;
    const r = await db.query(sql, params);
    return r.rows;
  },

  async getVariantsForAsset(assetId) {
    const r = await db.query('SELECT * FROM cms_asset_variants WHERE asset_id = $1 ORDER BY id ASC', [assetId]);
    return r.rows || [];
  },

  // --- Audit / Versioning helpers ---
  async _audit(adminId, action, contentType, contentId, meta = {}) {
    try {
      await db.query('INSERT INTO cms_audit_trail (admin_id, action, content_type, content_id, meta) VALUES ($1,$2,$3,$4,$5)', [adminId, action, contentType, contentId, meta]);
    } catch (e) {
      // swallow audit errors to avoid breaking main flows
    }
  },

  async _createVersionSnapshot(contentType, contentId, payload, createdBy = null) {
    try {
      // compute next version
      const r = await db.query('SELECT COALESCE(MAX(version), 0) AS maxv FROM cms_version_history WHERE content_type = $1 AND content_id = $2', [contentType, contentId]);
      const next = (r && r.rows && r.rows[0] && Number(r.rows[0].maxv || 0) + 1) || 1;
      await db.query('INSERT INTO cms_version_history (content_type, content_id, version, payload, created_by) VALUES ($1,$2,$3,$4,$5)', [contentType, contentId, next, payload || {}, createdBy]);
      return next;
    } catch (e) {
      return null;
    }
  },

  async getVersionHistory(contentType, contentId, { limit = 50, offset = 0 } = {}) {
    const q = await db.query('SELECT * FROM cms_version_history WHERE content_type = $1 AND content_id = $2 ORDER BY version DESC LIMIT $3 OFFSET $4', [contentType, contentId, Number(limit), Number(offset)]).catch(() => ({ rows: [] }));
    return q.rows || [];
  },

  async restoreVersion(contentType, contentId, version, adminId = null) {
    const r = await db.query('SELECT payload FROM cms_version_history WHERE content_type = $1 AND content_id = $2 AND version = $3', [contentType, contentId, version]);
    if (!r || !r.rows || !r.rows[0]) throw new Error('Version not found');
    const payload = r.rows[0].payload || {};
    try {
      if (contentType === 'asset') {
        const fields = [];
        const vals = [];
        let idx = 1;
        for (const k of Object.keys(payload)) { fields.push(`${k} = $${idx++}`); vals.push(payload[k]); }
        if (!fields.length) throw new Error('Nothing to restore');
        vals.push(contentId);
        const upd = await db.query(`UPDATE cms_assets SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, vals);
        await this._createVersionSnapshot('asset', contentId, upd.rows[0], adminId);
        await this._audit(adminId, 'restore', 'asset', contentId, { version });
        return upd.rows[0];
      }
      if (contentType === 'theme') {
        const fields = [];
        const vals = [];
        let idx = 1;
        for (const k of Object.keys(payload)) { fields.push(`${k} = $${idx++}`); vals.push(payload[k]); }
        if (!fields.length) throw new Error('Nothing to restore');
        vals.push(contentId);
        const upd = await db.query(`UPDATE cms_themes SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, vals);
        await this._createVersionSnapshot('theme', contentId, upd.rows[0], adminId);
        await this._audit(adminId, 'restore', 'theme', contentId, { version });
        return upd.rows[0];
      }
      if (contentType === 'template') {
        const fields = [];
        const vals = [];
        let idx = 1;
        for (const k of Object.keys(payload)) { fields.push(`${k} = $${idx++}`); vals.push(payload[k]); }
        if (!fields.length) throw new Error('Nothing to restore');
        vals.push(contentId);
        const upd = await db.query(`UPDATE cms_templates SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, vals);
        await this._createVersionSnapshot('template', contentId, upd.rows[0], adminId);
        await this._audit(adminId, 'restore', 'template', contentId, { version });
        return upd.rows[0];
      }
      throw new Error('Unsupported content type');
    } catch (e) {
      throw e;
    }
  },

  // --- Asset helpers ---
  async updateAsset(id, patch = {}, adminId = null) {
    const existing = await this.getAsset(id);
    if (!existing) return null;
    // snapshot before change
    await this._createVersionSnapshot('asset', id, existing, adminId);
    const keys = [], vals = []; let idx = 1;
    for (const k of Object.keys(patch)) { keys.push(`${k} = $${idx++}`); vals.push(patch[k]); }
    if (!keys.length) return existing;
    vals.push(id);
    const res = await db.query(`UPDATE cms_assets SET ${keys.join(', ')} WHERE id = $${idx} RETURNING *`, vals);
    await this._audit(adminId, 'update', 'asset', id, { patch });
    return res.rows[0];
  },

  async publishAsset(id, adminId = null) {
    // Load current row
    const r0 = await db.query('SELECT * FROM cms_assets WHERE id = $1', [id]);
    const existing = r0 && r0.rows && r0.rows[0];
    if (!existing) return null;
    // snapshot pre-publish
    await this._createVersionSnapshot('asset', id, existing, adminId);
    // increment version and set status
    const res = await db.query('UPDATE cms_assets SET status = $1, version = COALESCE(version,1) + 1 WHERE id = $2 RETURNING *', ['published', id]);
    await this._audit(adminId, 'publish', 'asset', id, {});
    return res.rows[0];
  },

  async addTagToAsset(id, tag, adminId = null) {
    try {
  await db.query("UPDATE cms_assets SET tags = array_append(COALESCE(tags, '{}'::text[]), $1) WHERE id = $2", [tag, id]);
      await this._audit(adminId, 'tag:add', 'asset', id, { tag });
      return true;
    } catch (e) { return false; }
  },

  async removeTagFromAsset(id, tag, adminId = null) {
    try {
  await db.query("UPDATE cms_assets SET tags = array_remove(COALESCE(tags, '{}'::text[]), $1) WHERE id = $2", [tag, id]);
      await this._audit(adminId, 'tag:remove', 'asset', id, { tag });
      return true;
    } catch (e) { return false; }
  },

  // extend listAssets to accept tag filtering
  async listAssets({ q = '', limit = 20, offset = 0, tags = [] } = {}) {
    const like = `%${q}%`;
    const params = [like, like, Number(limit), Number(offset)];
    let sql = `SELECT * FROM cms_assets WHERE (title ILIKE $1 OR description ILIKE $2)`;
    if (tags && Array.isArray(tags) && tags.length) {
      params.push(tags);
      sql += ` AND (tags && $${params.length})`;
    }
    sql += ` ORDER BY id DESC LIMIT $3 OFFSET $4`;
    const r = await db.query(sql, params).catch(() => ({ rows: [] }));
    const countParams = [like, like];
    let countSql = `SELECT COUNT(*)::int AS total FROM cms_assets WHERE (title ILIKE $1 OR description ILIKE $2)`;
    if (tags && Array.isArray(tags) && tags.length) { countParams.push(tags); countSql += ` AND (tags && $3)`; }
    const count = await db.query(countSql, countParams).catch(() => ({ rows: [{ total: 0 }] }));
    return { items: r.rows, total: count.rows[0].total, limit: Number(limit), offset: Number(offset) };
  },

  // --- Search helpers ---
  async searchAssets({ q = '', tags = [], limit = 20, offset = 0 } = {}) {
    const like = `%${q}%`;
    const params = [like, like, Number(limit), Number(offset)];
    let sql = `SELECT * FROM cms_assets WHERE (title ILIKE $1 OR description ILIKE $2)`;
    if (tags && Array.isArray(tags) && tags.length) { params.push(tags); sql += ` AND (tags && $${params.length})`; }
    sql += ` ORDER BY id DESC LIMIT $3 OFFSET $4`;
    const r = await db.query(sql, params).catch(() => ({ rows: [] }));
    const countParams = [like, like];
    let countSql = `SELECT COUNT(*)::int AS total FROM cms_assets WHERE (title ILIKE $1 OR description ILIKE $2)`;
    if (tags && Array.isArray(tags) && tags.length) { countParams.push(tags); countSql += ` AND (tags && $3)`; }
    const countRes = await db.query(countSql, countParams).catch(() => ({ rows: [{ total: 0 }] }));
    return { items: r.rows, total: countRes.rows[0].total, limit: Number(limit), offset: Number(offset) };
  },

  async searchThemes({ q = '', limit = 20, offset = 0 } = {}) {
    const like = `%${q}%`;
    const params = [like, like, Number(limit), Number(offset)];
    const sql = `SELECT * FROM cms_themes WHERE (name ILIKE $1 OR description ILIKE $2) ORDER BY id DESC LIMIT $3 OFFSET $4`;
    const r = await db.query(sql, params).catch(() => ({ rows: [] }));
    const countRes = await db.query(`SELECT COUNT(*)::int AS total FROM cms_themes WHERE (name ILIKE $1 OR description ILIKE $2)`, [like, like]).catch(() => ({ rows: [{ total: 0 }] }));
    return { items: r.rows, total: countRes.rows[0].total, limit: Number(limit), offset: Number(offset) };
  },

  async searchTemplates({ q = '', limit = 20, offset = 0 } = {}) {
    const like = `%${q}%`;
    const params = [like, like, Number(limit), Number(offset)];
    const sql = `SELECT * FROM cms_templates WHERE (title ILIKE $1 OR description ILIKE $2) ORDER BY id DESC LIMIT $3 OFFSET $4`;
    const r = await db.query(sql, params).catch(() => ({ rows: [] }));
    const countRes = await db.query(`SELECT COUNT(*)::int AS total FROM cms_templates WHERE (title ILIKE $1 OR description ILIKE $2)`, [like, like]).catch(() => ({ rows: [{ total: 0 }] }));
    return { items: r.rows, total: countRes.rows[0].total, limit: Number(limit), offset: Number(offset) };
  },

  // --- Bulk tag helpers ---
  async addTagsToAsset(id, tags = [], adminId = null) {
    if (!tags || !tags.length) return false;
    try {
      for (const t of tags) {
        await db.query("UPDATE cms_assets SET tags = array_append(COALESCE(tags, '{}'::text[]), $1) WHERE id = $2 AND NOT (tags && ARRAY[$1])", [t, id]);
      }
      await this._audit(adminId, 'tag:bulk:add', 'asset', id, { tags });
      return true;
    } catch (e) { return false; }
  },

  async removeTagsFromAsset(id, tags = [], adminId = null) {
    if (!tags || !tags.length) return false;
    try {
      for (const t of tags) {
        await db.query("UPDATE cms_assets SET tags = array_remove(COALESCE(tags, '{}'::text[]), $1) WHERE id = $2", [t, id]);
      }
      await this._audit(adminId, 'tag:bulk:remove', 'asset', id, { tags });
      return true;
    } catch (e) { return false; }
  },

  async getAssetsByTag(tag, { limit = 50, offset = 0 } = {}) {
    const params = [tag, Number(limit), Number(offset)];
    const sql = `SELECT * FROM cms_assets WHERE tags && $1 ORDER BY id DESC LIMIT $2 OFFSET $3`;
    const r = await db.query(sql, params).catch(() => ({ rows: [] }));
    const countRes = await db.query('SELECT COUNT(*)::int AS total FROM cms_assets WHERE tags && $1', [tag]).catch(() => ({ rows: [{ total: 0 }] }));
    return { items: r.rows, total: countRes.rows[0].total, limit: Number(limit), offset: Number(offset) };
  },

  async getAllTags() {
    const r = await db.query("SELECT DISTINCT unnest(tags) AS tag FROM cms_assets WHERE tags IS NOT NULL").catch(() => ({ rows: [] }));
    return (r.rows || []).map(r0 => r0.tag).filter(Boolean);
  },

  // --- Theme / Template helpers (update, publish, versioning) ---
  async updateTheme(id, patch = {}, adminId = null) {
    const r0 = await db.query('SELECT * FROM cms_themes WHERE id = $1', [id]);
    const existing = r0 && r0.rows && r0.rows[0];
    if (!existing) return null;
    await this._createVersionSnapshot('theme', id, existing, adminId);
    // If registry_id is provided in patch, validate it. If existing row lacks registry_id, require caller to supply one.
    if (patch.hasOwnProperty('registry_id')) {
      if (!patch.registry_id || typeof patch.registry_id !== 'string') throw new Error('Missing registry_id');
      if (!themeRegistry.isValidThemeId(patch.registry_id)) throw new Error('Unknown theme id');
    } else if (!existing.registry_id) {
      throw new Error('Existing theme missing registry_id; updates must include registry_id');
    }

    const keys = [], vals = []; let idx = 1;
    for (const k of Object.keys(patch)) { keys.push(`${k} = $${idx++}`); vals.push(patch[k]); }
    if (!keys.length) return existing;
    vals.push(id);
    const res = await db.query(`UPDATE cms_themes SET ${keys.join(', ')} WHERE id = $${idx} RETURNING *`, vals);
    await this._audit(adminId, 'update', 'theme', id, { patch });
    return res.rows[0];
  },

  async publishTheme(id, adminId = null) {
    // Load current row
    const r0 = await db.query('SELECT * FROM cms_themes WHERE id = $1', [id]);
    const existing = r0 && r0.rows && r0.rows[0];
    if (!existing) return null;
    // snapshot pre-publish
    await this._createVersionSnapshot('theme', id, existing, adminId);
    // increment version and set status
    const r = await db.query('UPDATE cms_themes SET status = $1, version = COALESCE(version,1) + 1 WHERE id = $2 RETURNING *', ['published', id]);
    await this._audit(adminId, 'publish', 'theme', id, {});
    return r.rows[0];
  },

  async updateTemplate(id, patch = {}, adminId = null) {
    const r0 = await db.query('SELECT * FROM cms_templates WHERE id = $1', [id]);
    const existing = r0 && r0.rows && r0.rows[0];
    if (!existing) return null;
    await this._createVersionSnapshot('template', id, existing, adminId);
    const keys = [], vals = []; let idx = 1;
    for (const k of Object.keys(patch)) { keys.push(`${k} = $${idx++}`); vals.push(patch[k]); }
    if (!keys.length) return existing;
    vals.push(id);
    const res = await db.query(`UPDATE cms_templates SET ${keys.join(', ')} WHERE id = $${idx} RETURNING *`, vals);
    await this._audit(adminId, 'update', 'template', id, { patch });
    return res.rows[0];
  },

  async publishTemplate(id, adminId = null) {
    // Load current row
    const r0 = await db.query('SELECT * FROM cms_templates WHERE id = $1', [id]);
    const existing = r0 && r0.rows && r0.rows[0];
    if (!existing) return null;
    // snapshot pre-publish
    await this._createVersionSnapshot('template', id, existing, adminId);
    // increment version and set status
    const r = await db.query('UPDATE cms_templates SET status = $1, version = COALESCE(version,1) + 1 WHERE id = $2 RETURNING *', ['published', id]);
    await this._audit(adminId, 'publish', 'template', id, {});
    return r.rows[0];
  }
};

module.exports = cmsService;
