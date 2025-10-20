const express = require('express');
const path = require('path');
const multer = require('multer');
const { adminAuthenticate, logAdminAction } = require('../middleware/adminAuth');
const { ensureDir, readJson, writeJson } = require('../utils/jsonStore');

const router = express.Router();
const STORE = path.join(__dirname, '..', 'data', 'assets.json');
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'admin');
ensureDir(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/jpeg': true,
    'image/png': true,
    'image/gif': true,
    'image/webp': true,
    'audio/mpeg': true,
    'audio/wav': true,
    'audio/ogg': true,
    'video/mp4': true,
    'video/webm': true,
    'application/pdf': true
  };
  
  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Get assets with pagination and filtering
router.get('/', adminAuthenticate, (req, res) => {
  const { type = 'all', limit = 20, offset = 0, search = '' } = req.query;
  const data = readJson(STORE, {});
  // Support both array and object shapes: { assets: [...], ... }
  let list = Array.isArray(data) ? data : (data.assets || []);

  // Filter by type
  if (type !== 'all') {
    list = list.filter(asset => asset.type === type);
  }

  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase();
    list = list.filter(asset => 
      (asset.title || '').toString().toLowerCase().includes(searchLower) ||
      (asset.type || '').toString().toLowerCase().includes(searchLower)
    );
  }

  const total = list.length;
  const paginatedList = list.slice(Number(offset), Number(offset) + Number(limit));

  res.json({ 
    assets: paginatedList,
    total,
    limit: Number(limit),
    offset: Number(offset)
  });
});

// Get single asset by id
router.get('/:id', adminAuthenticate, (req, res) => {
  const data = readJson(STORE, {});
  const list = Array.isArray(data) ? data : (data.assets || []);
  const id = Number(req.params.id);
  const asset = list.find(a => a.id === id);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  res.json({ asset });
});

// Upload asset with enhanced metadata
router.post('/', adminAuthenticate, upload.single('file'), async (req, res) => {
  try {
    const data = readJson(STORE, {});
    const list = Array.isArray(data) ? data : (data.assets || []);
    const id = Date.now();
    const { title = '', type = 'image', description = '', tags = '' } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const filePath = `/uploads/admin/${req.file.filename}`;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;
    
    const item = { 
      id, 
      title: title || req.file.originalname, 
      type: type || mimeType.split('/')[0], 
      description,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      filePath, 
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileSize,
      mimeType,
      created_at: new Date().toISOString(),
      uploaded_by: req.user.id
    };
    
    list.unshift(item);
    // persist preserving wrapper
    if (Array.isArray(data)) {
      writeJson(STORE, list);
    } else {
      data.assets = list;
      writeJson(STORE, data);
    }
    
    // Log asset upload (use secureLog to auto-inject IP/UA/correlation)
    if (typeof req.secureLog === 'function') {
      await req.secureLog('UPLOAD_ASSET', 'asset', id, {
        title: item.title,
        type: item.type,
        fileSize: item.fileSize
      });
    } else if (typeof req.logAdminAction === 'function') {
      await req.logAdminAction(req.user.id, 'UPLOAD_ASSET', 'asset', id, {
        title: item.title,
        type: item.type,
        fileSize: item.fileSize
      });
    }
    
    res.json({ asset: item });
  } catch (error) {
    console.error('Asset upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Update asset metadata
router.patch('/:id', adminAuthenticate, async (req, res) => {
  try {
    const data = readJson(STORE, {});
    const list = Array.isArray(data) ? data : (data.assets || []);
    const id = Number(req.params.id);
    const idx = list.findIndex(a => a.id === id);
    
    if (idx === -1) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    const originalAsset = { ...list[idx] };
    list[idx] = { ...list[idx], ...req.body, id };
    
    // Process tags if provided
    if (req.body.tags && typeof req.body.tags === 'string') {
      list[idx].tags = req.body.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }
    
    if (Array.isArray(data)) {
      writeJson(STORE, list);
    } else {
      data.assets = list;
      writeJson(STORE, data);
    }
    
    // Log asset update
    if (typeof req.secureLog === 'function') {
      await req.secureLog('UPDATE_ASSET', 'asset', id, {
        changes: req.body,
        original: originalAsset
      });
    } else if (typeof req.logAdminAction === 'function') {
      await req.logAdminAction(req.user.id, 'UPDATE_ASSET', 'asset', id, {
        changes: req.body,
        original: originalAsset
      });
    }
    
    res.json({ asset: list[idx] });
  } catch (error) {
    console.error('Asset update error:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete asset
router.delete('/:id', adminAuthenticate, async (req, res) => {
  try {
    const data = readJson(STORE, {});
    const list = Array.isArray(data) ? data : (data.assets || []);
    const id = Number(req.params.id);
    const asset = list.find(a => a.id === id);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    const filtered = list.filter(a => a.id !== id);
    if (Array.isArray(data)) {
      writeJson(STORE, filtered);
    } else {
      data.assets = filtered;
      writeJson(STORE, data);
    }
    
    // Optionally delete the actual file
    if (asset.fileName) {
      const fs = require('fs');
      const filePath = path.join(UPLOAD_DIR, asset.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Log asset deletion
    if (typeof req.secureLog === 'function') {
      await req.secureLog('DELETE_ASSET', 'asset', id, {
        title: asset.title,
        type: asset.type
      });
    } else if (typeof req.logAdminAction === 'function') {
      await req.logAdminAction(req.user.id, 'DELETE_ASSET', 'asset', id, {
        title: asset.title,
        type: asset.type
      });
    }
    
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Asset deletion error:', error);
    res.status(500).json({ error: 'Deletion failed' });
  }
});

// Get asset statistics
router.get('/stats', adminAuthenticate, (req, res) => {
  const data = readJson(STORE, {});
  const list = Array.isArray(data) ? data : (data.assets || []);
  
  const stats = {
    total: list.length,
    byType: {},
    totalSize: 0,
    recentUploads: list.slice(0, 5)
  };
  
  list.forEach(asset => {
    // Count by type
    stats.byType[asset.type] = (stats.byType[asset.type] || 0) + 1;
    
    // Calculate total size
    if (asset.fileSize) {
      stats.totalSize += asset.fileSize;
    }
  });
  
  res.json(stats);
});

module.exports = router;


