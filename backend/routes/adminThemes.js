const express = require('express');
const path = require('path');
const { adminAuthenticate, logAdminAction } = require('../middleware/adminAuth');
const { readJson, writeJson } = require('../utils/jsonStore');
const themeRegistry = require('../utils/themeRegistry');

const router = express.Router();
const STORE = path.join(__dirname, '..', 'data', 'themes.json');

// Get themes with filtering
router.get('/', adminAuthenticate, (req, res) => {
  const { available = 'all' } = req.query;
  // Merge registry metadata with persisted overrides (available flag and stored colors)
  const registry = themeRegistry.getRegistry();
  const overrides = readJson(STORE, []);
  // build map keyed by themeId (migrate legacy numeric IDs to legacy:<num>)
  const overrideMap = new Map();
  (overrides || []).forEach(o => {
    const key = o.themeId || (typeof o.id !== 'undefined' ? `legacy:${o.id}` : null);
    if (key) overrideMap.set(String(key), o);
  });
  let themes = registry.map(t => {
    const ov = overrideMap.get(String(t.id)) || {};
    return Object.assign({}, { id: t.id, metadata: t.metadata }, { available: typeof ov.available === 'boolean' ? ov.available : true }, { overrides: ov });
  });

  if (available === 'true') themes = themes.filter(t => t.available === true);
  else if (available === 'false') themes = themes.filter(t => t.available === false);

  res.json({ themes });
});

// Toggle availability for a registry theme (create/delete replaced by toggling available flag)
router.post('/:id/availability', adminAuthenticate, async (req, res) => {
  try {
    const id = req.params.id;
    if (!themeRegistry.isValidThemeId(id)) return res.status(400).json({ error: 'Unknown theme id' });
    const { available } = req.body;
    const list = readJson(STORE, []);
    const now = new Date().toISOString();
    // find existing override by themeId or legacy numeric id
    const idx = list.findIndex(t => String(t.themeId) === String(id) || String(t.id) === String(id) || String(t.id) === String(Number(id)));
    if (idx === -1) {
      // write using themeId string key
      list.push({ themeId: id, available: !!available, updated_at: now, updated_by: req.user && req.user.id });
    } else {
      // if existing is numeric legacy, convert to themeId
      const existing = list[idx];
      const newObj = Object.assign({}, existing, { themeId: id, available: !!available, updated_at: now, updated_by: req.user && req.user.id });
      // remove legacy numeric id field
      delete newObj.id;
      list[idx] = newObj;
    }
    // persist
    writeJson(STORE, list);
    if (typeof req.logAdminAction === 'function') {
      await req.logAdminAction(req.user.id, 'TOGGLE_THEME_AVAILABILITY', 'theme', id, { available: !!available });
    }
    res.json({ id, available: !!available });
  } catch (e) {
    console.error('toggle availability error', e);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

// Update theme
// Allow limited updates to persisted overrides (e.g., stored colors) but only for existing stored entries
router.patch('/:id', adminAuthenticate, async (req, res) => {
  try {
  const id = req.params.id;
  const list = readJson(STORE, []);
  const idx = list.findIndex(t => String(t.themeId) === String(id) || String(t.id) === String(id) || String(t.id) === String(Number(id)));
    if (idx === -1) return res.status(404).json({ error: 'Theme override not found' });
    const allowed = ['colors', 'notes'];
    const patch = {};
    for (const k of Object.keys(req.body || {})) if (allowed.includes(k)) patch[k] = req.body[k];
    if (!Object.keys(patch).length) return res.status(400).json({ error: 'No updatable fields' });
    const original = Object.assign({}, list[idx]);
    list[idx] = Object.assign({}, list[idx], patch, { updated_at: new Date().toISOString(), updated_by: req.user && req.user.id });
    writeJson(STORE, list);
    if (typeof req.logAdminAction === 'function') await req.logAdminAction(req.user.id, 'UPDATE_THEME_OVERRIDE', 'theme', id, { patch, original });
    res.json({ theme: list[idx] });
  } catch (e) {
    console.error('Theme override update error', e);
    res.status(500).json({ error: 'Failed to update theme override' });
  }
});

// Delete theme
// Deleting an override clears persisted entry (reverts to registry defaults)
router.delete('/:id', adminAuthenticate, async (req, res) => {
  try {
  const id = req.params.id;
  const list = readJson(STORE, []);
  const exists = list.some(t => String(t.themeId) === String(id) || String(t.id) === String(id) || String(t.id) === String(Number(id)));
  if (!exists) return res.status(404).json({ error: 'Theme override not found' });
  const filtered = list.filter(t => !(String(t.themeId) === String(id) || String(t.id) === String(id) || String(t.id) === String(Number(id))));
    writeJson(STORE, filtered);
    if (typeof req.logAdminAction === 'function') await req.logAdminAction(req.user.id, 'DELETE_THEME_OVERRIDE', 'theme', id, {});
    res.json({ message: 'Theme override removed' });
  } catch (e) {
    console.error('Theme override deletion error', e);
    res.status(500).json({ error: 'Failed to remove override' });
  }
});

// Preview theme
router.get('/:id/preview', adminAuthenticate, (req, res) => {
  const id = req.params.id;
  const registryTheme = themeRegistry.getThemeById(id);
  const overrides = readJson(STORE, []);
  const ov = overrides.find(o => String(o.themeId) === String(id) || String(o.id) === String(id) || String(o.id) === String(Number(id))) || {};
  if (!registryTheme && !ov) return res.status(404).json({ error: 'Theme not found' });
  // prefer registry metadata colors if present
  const colors = (registryTheme && registryTheme.metadata && registryTheme.metadata.colors) || ov.colors || {};
  const css = `:root {
    --primary: ${colors.primary || '#8B2A94'};
    --secondary: ${colors.secondary || '#4A1547'};
    --accent: ${colors.accent || '#E91E63'};
    --border: ${colors.border || '#e5e7eb'};
    --success: ${colors.success || '#16a34a'};
    --warning: ${colors.warning || '#f59e0b'};
    --error: ${colors.error || '#ef4444'};
    --info: ${colors.info || '#3b82f6'};
  }`;
  res.json({ id, preview: { css }, registry: registryTheme || null, override: ov });
});

// Expose raw registry (read-only)
router.get('/registry/raw', adminAuthenticate, (req, res) => {
  const registry = themeRegistry.getRegistry();
  res.json({ themes: registry });
});

module.exports = router;


