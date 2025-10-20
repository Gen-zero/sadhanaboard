const express = require('express');
const router = express.Router();
const db = require('../config/db');
const cmsService = require('../services/cmsService');
const mediaService = require('../services/mediaProcessingService');
const { adminAuthenticate } = require('../middleware/adminAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// reuse tmp dir; validate and limit uploads
const upload = multer({ dest: './uploads/tmp', limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  // simple allow list for images/audio/video/pdf
  const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|pdf|mp3|wav/;
  if (allowed.test(file.mimetype)) return cb(null, true);
  cb(null, false);
} });

// List assets
router.get('/assets', adminAuthenticate, async (req, res) => {
  try {
    const { q, limit = 20, offset = 0 } = req.query;
    const r = await cmsService.listAssets({ q, limit, offset });
    res.json(r);
  } catch (e) {
    console.error('cms assets list error', e);
    res.status(500).json({ message: 'Failed to list assets' });
  }
});

// Upload asset and enqueue processing
router.post('/assets', adminAuthenticate, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    const meta = req.body || {};
    // Move file from tmp to uploads/cms and sanitize filename
    const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    const destDir = path.join(__dirname, '..', 'uploads', 'cms');
    const destPath = path.join(destDir, `${Date.now()}-${safeName}`);
    fs.renameSync(file.path, destPath);

    const publicPath = `/uploads/cms/${path.basename(destPath)}`;

    const created = await cmsService.createAsset({ title: meta.title || file.originalname, description: meta.description || '', type: meta.type || file.mimetype, file_path: publicPath, file_size: file.size, mime_type: file.mimetype, metadata: meta.metadata ? JSON.parse(meta.metadata) : {}, created_by: req.user && req.user.id });

    // Try to generate image variants synchronously but do not block response; persist if successful
    (async () => {
      try {
        const variants = await mediaService.generateImageVariants(created.id, destPath, destDir);
        if (variants && variants.length) {
          await cmsService.insertVariants(created.id, variants.map(v => ({ variant_type: v.variant_type, file_path: `/uploads/cms/${path.basename(v.file_path)}`, file_size: v.file_size, metadata: v.metadata || {} })));
        }
      } catch (err) {
        console.error('background variant generation failed', err);
      }
    })();

    res.json({ asset: created });
  } catch (e) {
    console.error('asset upload error', e);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Get asset
router.get('/assets/:id', adminAuthenticate, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const asset = await cmsService.getAsset(id);
    if (!asset) return res.status(404).json({ message: 'Not found' });
    const variants = await cmsService.getVariantsForAsset(id);
    res.json({ asset, variants });
  } catch (e) {
    console.error('get asset error', e);
    res.status(500).json({ message: 'Failed to fetch asset' });
  }
});

// Basic theme creation - allow creating CMS theme records but validate referenced registry id when supplied
router.post('/themes', adminAuthenticate, async (req, res) => {
  try {
    const theme = req.body;
    // Require registry_id and validate via service
    const created = await cmsService.createTheme(theme);
    res.json({ theme: created });
  } catch (e) {
    console.error('create theme error', e);
    if (/Missing registry_id/.test(String(e.message || ''))) return res.status(400).json({ message: 'Missing registry_id' });
    if (/Unknown theme id/.test(String(e.message || ''))) return res.status(400).json({ message: 'Unknown theme id' });
    res.status(500).json({ message: 'Failed to create theme' });
  }
});

// List themes
router.get('/themes', adminAuthenticate, async (req, res) => {
  try {
    const params = { q: req.query.q || '', limit: req.query.limit || 20, offset: req.query.offset || 0 };
    const out = await cmsService.listThemes(params);
    res.json(out);
  } catch (e) {
    console.error('list themes error', e);
    res.status(500).json({ message: 'Failed to list themes' });
  }
});

// Basic template CRUD
router.post('/templates', adminAuthenticate, async (req, res) => {
  try {
    const template = req.body;
    const created = await cmsService.createTemplate(template);
    res.json({ template: created });
  } catch (e) {
    console.error('create template error', e);
    res.status(500).json({ message: 'Failed to create template' });
  }
});

// List templates
router.get('/templates', adminAuthenticate, async (req, res) => {
  try {
    const params = { q: req.query.q || '', limit: req.query.limit || 20, offset: req.query.offset || 0 };
    const out = await cmsService.listTemplates(params);
    res.json(out);
  } catch (e) {
    console.error('list templates error', e);
    res.status(500).json({ message: 'Failed to list templates' });
  }
});

module.exports = router;
