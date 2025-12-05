const CmsAsset = require('../schemas/CmsAsset');
const CmsTheme = require('../schemas/CmsTheme');
const CmsTemplate = require('../schemas/CmsTemplate');
const CmsAssetVariant = require('../schemas/CmsAssetVariant');
const CmsAuditTrail = require('../schemas/CmsAuditTrail');
const CmsVersionHistory = require('../schemas/CmsVersionHistory');
const path = require('path');
const fs = require('fs');
const themeRegistry = require('../utils/themeRegistry');

const cmsService = {
  async createAsset({ title, description, type, filePath, fileSize, mimeType, metadata = {}, tags = [], categoryId = null, createdBy = null }) {
    const asset = new CmsAsset({
      title, description, type, filePath, fileSize, mimeType, metadata, tags, categoryId, createdBy
    });
    const result = await asset.save();
    return result.toJSON();
  },

  async getAsset(id) {
    const result = await CmsAsset.findById(id).lean();
    return result || null;
  },

  async listAssets({ q = '', limit = 20, offset = 0, tags = [] } = {}) {
    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (tags && Array.isArray(tags) && tags.length) {
      query.tags = { $in: tags };
    }

    const [items, total] = await Promise.all([
      CmsAsset.find(query).sort({ _id: -1 }).limit(Number(limit)).skip(Number(offset)).lean(),
      CmsAsset.countDocuments(query)
    ]);
    return { items, total, limit: Number(limit), offset: Number(offset) };
  },

  async createTheme(theme) {
    if (!theme.registryId || typeof theme.registryId !== 'string') throw new Error('Missing registryId');
    if (!themeRegistry.isValidThemeId(theme.registryId)) throw new Error('Unknown theme id');

    const newTheme = new CmsTheme({
      name: theme.name,
      deity: theme.deity,
      description: theme.description,
      colorPalette: theme.colorPalette || {},
      cssVariables: theme.cssVariables || {},
      previewImage: theme.previewImage || null,
      status: theme.status || 'draft',
      version: theme.version || 1,
      createdBy: theme.createdBy || null,
      registryId: theme.registryId
    });
    const result = await newTheme.save();
    return result.toJSON();
  },

  async listThemes({ q = '', limit = 20, offset = 0 } = {}) {
    const query = {};
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const [rows, total] = await Promise.all([
      CmsTheme.find(query).sort({ _id: -1 }).limit(Number(limit)).skip(Number(offset)).lean(),
      CmsTheme.countDocuments(query)
    ]);

    // Enrich items with registry metadata
    const registry = themeRegistry.getRegistry() || [];
    const byId = Object.fromEntries((registry || []).map(t => [String(t.id), t.metadata]));
    const items = (rows || []).map(it => ({
      ...it,
      registry: it.registryId ? byId[String(it.registryId)] || null : null
    }));
    return { items, total, limit: Number(limit), offset: Number(offset) };
  },

  async createTemplate(template) {
    const newTemplate = new CmsTemplate({
      title: template.title,
      description: template.description,
      type: template.type,
      difficultyLevel: template.difficultyLevel,
      durationMinutes: template.durationMinutes || null,
      instructions: template.instructions || [],
      components: template.components || [],
      tags: template.tags || [],
      categoryId: template.categoryId || null,
      status: template.status || 'draft',
      version: template.version || 1,
      createdBy: template.createdBy || null
    });
    const result = await newTemplate.save();
    return result.toJSON();
  },

  async listTemplates({ q = '', limit = 20, offset = 0 } = {}) {
    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      CmsTemplate.find(query).sort({ _id: -1 }).limit(Number(limit)).skip(Number(offset)).lean(),
      CmsTemplate.countDocuments(query)
    ]);
    return { items, total, limit: Number(limit), offset: Number(offset) };
  },

  async insertVariants(assetId, variants = []) {
    if (!variants || !variants.length) return [];
    const docs = variants.map(v => ({
      assetId,
      variantType: v.variantType,
      filePath: v.filePath,
      fileSize: v.fileSize || null
    }));
    const results = await CmsAssetVariant.insertMany(docs);
    return results.map(r => r.toJSON());
  },

  async getVariantsForAsset(assetId) {
    const results = await CmsAssetVariant.find({ assetId }).sort({ _id: 1 }).lean();
    return results || [];
  },

  // --- Audit / Versioning helpers ---
  async _audit(adminId, action, contentType, contentId, meta = {}) {
    try {
      await CmsAuditTrail.create({ adminId, action, contentType, contentId, meta });
    } catch (e) {
      // swallow audit errors to avoid breaking main flows
    }
  },

  async _createVersionSnapshot(contentType, contentId, payload, createdBy = null) {
    try {
      const lastVersion = await CmsVersionHistory.findOne({ contentType, contentId }).sort({ version: -1 }).select('version');
      const next = (lastVersion?.version || 0) + 1;
      await CmsVersionHistory.create({ contentType, contentId, version: next, payload: payload || {}, createdBy });
      return next;
    } catch (e) {
      return null;
    }
  },

  async getVersionHistory(contentType, contentId, { limit = 50, offset = 0 } = {}) {
    const results = await CmsVersionHistory.find({ contentType, contentId })
      .sort({ version: -1 })
      .limit(Number(limit))
      .skip(Number(offset))
      .lean();
    return results || [];
  },

  async restoreVersion(contentType, contentId, version, adminId = null) {
    const versionDoc = await CmsVersionHistory.findOne({ contentType, contentId, version });
    if (!versionDoc) throw new Error('Version not found');
    const payload = versionDoc.payload || {};

    try {
      if (contentType === 'asset') {
        const updated = await CmsAsset.findByIdAndUpdate(contentId, payload, { new: true });
        await this._createVersionSnapshot('asset', contentId, updated, adminId);
        await this._audit(adminId, 'restore', 'asset', contentId, { version });
        return updated?.toJSON();
      }
      if (contentType === 'theme') {
        const updated = await CmsTheme.findByIdAndUpdate(contentId, payload, { new: true });
        await this._createVersionSnapshot('theme', contentId, updated, adminId);
        await this._audit(adminId, 'restore', 'theme', contentId, { version });
        return updated?.toJSON();
      }
      if (contentType === 'template') {
        const updated = await CmsTemplate.findByIdAndUpdate(contentId, payload, { new: true });
        await this._createVersionSnapshot('template', contentId, updated, adminId);
        await this._audit(adminId, 'restore', 'template', contentId, { version });
        return updated?.toJSON();
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
    await this._createVersionSnapshot('asset', id, existing, adminId);
    const updated = await CmsAsset.findByIdAndUpdate(id, patch, { new: true });
    await this._audit(adminId, 'update', 'asset', id, { patch });
    return updated?.toJSON();
  },

  async publishAsset(id, adminId = null) {
    const existing = await this.getAsset(id);
    if (!existing) return null;
    await this._createVersionSnapshot('asset', id, existing, adminId);
    const updated = await CmsAsset.findByIdAndUpdate(id, { status: 'published', $inc: { version: 1 } }, { new: true });
    await this._audit(adminId, 'publish', 'asset', id, {});
    return updated?.toJSON();
  },

  async addTagToAsset(id, tag, adminId = null) {
    try {
      await CmsAsset.findByIdAndUpdate(id, { $addToSet: { tags: tag } });
      await this._audit(adminId, 'tag:add', 'asset', id, { tag });
      return true;
    } catch (e) { return false; }
  },

  async removeTagFromAsset(id, tag, adminId = null) {
    try {
      await CmsAsset.findByIdAndUpdate(id, { $pull: { tags: tag } });
      await this._audit(adminId, 'tag:remove', 'asset', id, { tag });
      return true;
    } catch (e) { return false; }
  },

  // extend listAssets to accept tag filtering
  // (Already implemented in main listAssets method above)

  // --- Search helpers ---
  async searchAssets({ q = '', tags = [], limit = 20, offset = 0 } = {}) {
    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (tags && Array.isArray(tags) && tags.length) {
      query.tags = { $in: tags };
    }

    const [items, total] = await Promise.all([
      CmsAsset.find(query).sort({ _id: -1 }).limit(Number(limit)).skip(Number(offset)).lean(),
      CmsAsset.countDocuments(query)
    ]);
    return { items, total, limit: Number(limit), offset: Number(offset) };
  },

  async searchThemes({ q = '', limit = 20, offset = 0 } = {}) {
    const query = {};
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      CmsTheme.find(query).sort({ _id: -1 }).limit(Number(limit)).skip(Number(offset)).lean(),
      CmsTheme.countDocuments(query)
    ]);
    return { items, total, limit: Number(limit), offset: Number(offset) };
  },

  async searchTemplates({ q = '', limit = 20, offset = 0 } = {}) {
    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      CmsTemplate.find(query).sort({ _id: -1 }).limit(Number(limit)).skip(Number(offset)).lean(),
      CmsTemplate.countDocuments(query)
    ]);
    return { items, total, limit: Number(limit), offset: Number(offset) };
  },

  // --- Bulk tag helpers ---
  async addTagsToAsset(id, tags = [], adminId = null) {
    if (!tags || !tags.length) return false;
    try {
      await CmsAsset.findByIdAndUpdate(id, { $addToSet: { tags: { $each: tags } } });
      await this._audit(adminId, 'tag:bulk:add', 'asset', id, { tags });
      return true;
    } catch (e) { return false; }
  },

  async removeTagsFromAsset(id, tags = [], adminId = null) {
    if (!tags || !tags.length) return false;
    try {
      await CmsAsset.findByIdAndUpdate(id, { $pullAll: { tags } });
      await this._audit(adminId, 'tag:bulk:remove', 'asset', id, { tags });
      return true;
    } catch (e) { return false; }
  },

  async getAssetsByTag(tag, { limit = 50, offset = 0 } = {}) {
    const [items, total] = await Promise.all([
      CmsAsset.find({ tags: tag }).sort({ _id: -1 }).limit(Number(limit)).skip(Number(offset)).lean(),
      CmsAsset.countDocuments({ tags: tag })
    ]);
    return { items, total, limit: Number(limit), offset: Number(offset) };
  },

  async getAllTags() {
    const assets = await CmsAsset.find({ tags: { $ne: [] } }).select('tags').lean();
    const allTags = new Set();
    (assets || []).forEach(a => (a.tags || []).forEach(t => allTags.add(t)));
    return Array.from(allTags);
  },

  // --- Theme / Template helpers (update, publish, versioning) ---
  async updateTheme(id, patch = {}, adminId = null) {
    const existing = await CmsTheme.findById(id);
    if (!existing) return null;

    if (patch.hasOwnProperty('registryId')) {
      if (!patch.registryId || typeof patch.registryId !== 'string') throw new Error('Missing registryId');
      if (!themeRegistry.isValidThemeId(patch.registryId)) throw new Error('Unknown theme id');
    } else if (!existing.registryId) {
      throw new Error('Existing theme missing registryId; updates must include registryId');
    }

    await this._createVersionSnapshot('theme', id, existing.toJSON(), adminId);
    const updated = await CmsTheme.findByIdAndUpdate(id, patch, { new: true });
    await this._audit(adminId, 'update', 'theme', id, { patch });
    return updated?.toJSON();
  },

  async publishTheme(id, adminId = null) {
    const existing = await CmsTheme.findById(id);
    if (!existing) return null;
    await this._createVersionSnapshot('theme', id, existing.toJSON(), adminId);
    const updated = await CmsTheme.findByIdAndUpdate(id, { status: 'published', $inc: { version: 1 } }, { new: true });
    await this._audit(adminId, 'publish', 'theme', id, {});
    return updated?.toJSON();
  },

  async updateTemplate(id, patch = {}, adminId = null) {
    const existing = await CmsTemplate.findById(id);
    if (!existing) return null;
    await this._createVersionSnapshot('template', id, existing.toJSON(), adminId);
    const updated = await CmsTemplate.findByIdAndUpdate(id, patch, { new: true });
    await this._audit(adminId, 'update', 'template', id, { patch });
    return updated?.toJSON();
  },

  async publishTemplate(id, adminId = null) {
    const existing = await CmsTemplate.findById(id);
    if (!existing) return null;
    await this._createVersionSnapshot('template', id, existing.toJSON(), adminId);
    const updated = await CmsTemplate.findByIdAndUpdate(id, { status: 'published', $inc: { version: 1 } }, { new: true });
    await this._audit(adminId, 'publish', 'template', id, {});
    return updated?.toJSON();
  }
};

module.exports = cmsService;
