const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function migrateAssets() {
  const dataPath = path.join(__dirname, '..', 'data', 'assets.json');
  if (!fs.existsSync(dataPath)) return console.log('No assets.json found');
  const raw = fs.readFileSync(dataPath, 'utf8');
  const arr = JSON.parse(raw);
  console.log(`Migrating ${arr.length} assets`);
  for (const a of arr) {
    try {
      await db.query('INSERT INTO cms_assets (id, title, description, type, file_path, file_size, mime_type, metadata, tags, category_id, status, created_by, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT (id) DO NOTHING', [a.id || null, a.title || null, a.description || null, a.type || null, a.file_path || null, a.file_size || null, a.mime_type || null, a.metadata || {}, a.tags || [], a.category_id || null, a.status || 'draft', a.created_by || null, a.created_at || new Date()]);
    } catch (e) { console.error('asset migrate error', e); }
  }
}

async function migrateThemes() {
  const dataPath = path.join(__dirname, '..', 'data', 'themes.json');
  if (!fs.existsSync(dataPath)) return console.log('No themes.json found');
  const arr = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Migrating ${arr.length} themes`);
  for (const t of arr) {
    try {
      await db.query('INSERT INTO cms_themes (id, name, deity, description, color_palette, css_variables, preview_image, status, version, created_by, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (id) DO NOTHING', [t.id || null, t.name || null, t.deity || null, t.description || null, t.color_palette || {}, t.css_variables || {}, t.preview_image || null, t.status || 'draft', t.version || 1, t.created_by || null, t.created_at || new Date()]);
    } catch (e) { console.error('theme migrate error', e); }
  }
}

async function migrateTemplates() {
  const dataPath = path.join(__dirname, '..', 'data', 'templates.json');
  if (!fs.existsSync(dataPath)) return console.log('No templates.json found');
  const arr = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Migrating ${arr.length} templates`);
  for (const t of arr) {
    try {
      await db.query('INSERT INTO cms_templates (id, title, description, type, difficulty_level, duration_minutes, instructions, components, tags, category_id, status, version, created_by, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) ON CONFLICT (id) DO NOTHING', [t.id || null, t.title || null, t.description || null, t.type || null, t.difficulty_level || null, t.duration_minutes || null, t.instructions || [], t.components || [], t.tags || [], t.category_id || null, t.status || 'draft', t.version || 1, t.created_by || null, t.created_at || new Date()]);
    } catch (e) { console.error('template migrate error', e); }
  }
}

async function run() {
  console.log('Starting CMS migration');
  await migrateAssets();
  await migrateThemes();
  await migrateTemplates();
  console.log('CMS migration complete');
  process.exit(0);
}

if (require.main === module) {
  run().catch(err => { console.error(err); process.exit(1); });
}

module.exports = { run };
