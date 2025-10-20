const express = require('express');
const path = require('path');
const { adminAuthenticate, logAdminAction } = require('../middleware/adminAuth');
const { readJson, writeJson } = require('../utils/jsonStore');

const router = express.Router();
const STORE = path.join(__dirname, '..', 'data', 'templates.json');

// Get templates with filtering
router.get('/', adminAuthenticate, (req, res) => {
  const { type = 'all', difficulty = 'all' } = req.query;
  let templates = readJson(STORE, []);
  
  if (type !== 'all') {
    templates = templates.filter(t => t.type === type);
  }
  
  if (difficulty !== 'all') {
    templates = templates.filter(t => t.difficulty === difficulty);
  }
  
  res.json({ templates });
});

// Create template with validation
router.post('/', adminAuthenticate, async (req, res) => {
  try {
    const { title, purpose, duration = '21 days', type = 'meditation', difficulty = 'beginner', instructions = [] } = req.body;
    
    if (!title || !purpose) {
      return res.status(400).json({ error: 'Title and purpose are required' });
    }
    
    const list = readJson(STORE, []);
    
    // Check for duplicate title
    if (list.some(t => t.title.toLowerCase() === title.toLowerCase())) {
      return res.status(400).json({ error: 'Template with this title already exists' });
    }
    
    const item = { 
      id: Date.now(), 
      title, 
      purpose, 
      duration,
      type,
      difficulty,
      instructions: Array.isArray(instructions) ? instructions : [],
      created_at: new Date().toISOString(),
      created_by: req.user.id
    };
    
    list.unshift(item);
    writeJson(STORE, list);
    
    // Log template creation
    if (typeof req.secureLog === 'function') {
      await req.secureLog('CREATE_TEMPLATE', 'template', item.id, { title: item.title, type: item.type });
    } else if (typeof req.logAdminAction === 'function') {
      await req.logAdminAction(req.user.id, 'CREATE_TEMPLATE', 'template', item.id, { title: item.title, type: item.type });
    }
    
    res.json({ template: item });
  } catch (error) {
    console.error('Template creation error:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// Update template
router.patch('/:id', adminAuthenticate, async (req, res) => {
  try {
    const list = readJson(STORE, []);
    const id = Number(req.params.id);
    const idx = list.findIndex(t => t.id === id);
    
    if (idx === -1) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    const originalTemplate = { ...list[idx] };
    list[idx] = { ...list[idx], ...req.body, id };
    
    // Ensure instructions is an array
    if (req.body.instructions && !Array.isArray(req.body.instructions)) {
      list[idx].instructions = [];
    }
    
    writeJson(STORE, list);
    
    // Log template update
    if (typeof req.secureLog === 'function') {
      await req.secureLog('UPDATE_TEMPLATE', 'template', id, { changes: req.body, original: originalTemplate });
    } else if (typeof req.logAdminAction === 'function') {
      await req.logAdminAction(req.user.id, 'UPDATE_TEMPLATE', 'template', id, { changes: req.body, original: originalTemplate });
    }
    
    res.json({ template: list[idx] });
  } catch (error) {
    console.error('Template update error:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// Delete template
router.delete('/:id', adminAuthenticate, async (req, res) => {
  try {
    const list = readJson(STORE, []);
    const id = Number(req.params.id);
    const template = list.find(t => t.id === id);
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    const filtered = list.filter(t => t.id !== id);
    writeJson(STORE, filtered);
    
    // Log template deletion
    if (typeof req.secureLog === 'function') {
      await req.secureLog('DELETE_TEMPLATE', 'template', id, { title: template.title, type: template.type });
    } else if (typeof req.logAdminAction === 'function') {
      await req.logAdminAction(req.user.id, 'DELETE_TEMPLATE', 'template', id, { title: template.title, type: template.type });
    }
    
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Template deletion error:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

// Get template details
router.get('/:id', adminAuthenticate, (req, res) => {
  const list = readJson(STORE, []);
  const template = list.find(t => t.id === Number(req.params.id));
  
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  res.json({ template });
});

module.exports = router;


