#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.resolve(__dirname, '../src/themes');
const OUT_PATH = path.resolve(__dirname, '../backend/data/theme-registry.json');

// The manifest is intended for backend/registry use (search, listings, basic info).
// It should only contain serializable data. The frontend theme definitions may
// include runtime-only fields (React components, imported icons, functions)
// which cannot be serialized. `filterSerializableMetadata` strips those fields.
function filterSerializableMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') return {};
  const allowed = [
    'id',
    'name',
    'description',
    'deity',
    'category',
    'isLandingPage',
    'landingPagePath',
    'gradient'
  ];
  const out = {};
  for (const k of Object.keys(metadata)) {
    if (allowed.includes(k)) {
      out[k] = metadata[k];
    }
    // skip any obviously non-serializable fields like `icon`
  }
  return out;
}

function readIndex() {
  const idxPath = path.join(THEMES_DIR, 'index.ts');
  const src = fs.readFileSync(idxPath, 'utf8');
  // find imports like: import defaultTheme from './default';
  const importRegex = /import\s+(\w+)\s+from\s+'\.\/([\w-]+)';/g;
  const themes = [];
  let m;
  while ((m = importRegex.exec(src)) !== null) {
    themes.push(m[2]);
  }
  return themes;
}

function extractMetadataFromFile(themeName) {
  const candidates = [
    path.join(THEMES_DIR, `${themeName}.ts`),
    path.join(THEMES_DIR, themeName, 'index.ts'),
  ];
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, 'utf8');
    // attempt to locate `metadata: { ... }` block
    const metaMatch = src.match(/metadata\s*:\s*\{([\s\S]*?)\}\s*,?/m);
    if (metaMatch) {
      const body = metaMatch[1];
      // crude transform to JSON: wrap keys in double quotes, convert single quotes to double, remove trailing commas
      let jsonish = '{' + body + '}';
      // remove newlines for easier processing
      jsonish = jsonish.replace(/\n/g, ' ');
      // replace single quotes with double
      jsonish = jsonish.replace(/'/g, '"');
      // quote unquoted keys
      jsonish = jsonish.replace(/([,\{\s])(\w+)\s*:/g, '$1"$2":');
      // remove trailing commas before closing braces
      jsonish = jsonish.replace(/,\s*}/g, '}');
      try {
        const obj = JSON.parse(jsonish);
        // Return only serializable/allowed fields for the manifest
        return filterSerializableMetadata(obj);
      } catch (e) {
        // Suppress the note about non-serializable fields to reduce console noise
        // console.log(`Note: Theme '${themeName}' contains non-serializable fields (React components/imports), using fallback parser`);
        // Fallback: attempt a tolerant extraction of simple key: value pairs from the
        // metadata body. This handles cases where values reference local variables
        // (e.g. icon: skullPath) or use unquoted keys/values.
        const tolerant = { id: themeName, _parseError: e.message };
        const pairRegex = /([a-zA-Z0-9_\-]+)\s*:\s*(?:"([^"]*)"|'([^']*)'|([A-Za-z0-9_.$\-]+))/g;
        let pm;
        while ((pm = pairRegex.exec(body)) !== null) {
          const key = pm[1];
          // Skip icon and other runtime-only fields
          if (key === 'icon') continue;
          const val = pm[2] ?? pm[3] ?? pm[4] ?? null;
          if (val !== null) {
            const num = Number(val);
            tolerant[key] = Number.isFinite(num) && String(num) === val ? num : val;
          } else {
            tolerant[key] = null;
          }
        }
        // Filter to allowed serializable fields before returning
        return filterSerializableMetadata(tolerant);
      }
    }
  }
  return null;
}

function buildManifest() {
  const themeNames = readIndex();
  const items = [];
  for (const name of themeNames) {
    const metadata = extractMetadataFromFile(name);
    // include id and available if present
    if (!metadata) {
      // no metadata found at all, use fallback id
      items.push({ id: name, metadata: {} });
    } else {
      items.push({ id: metadata.id || name, metadata });
    }
  }
  return items;
}

function ensureOutDir() {
  const dir = path.dirname(OUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const manifest = buildManifest();
  ensureOutDir();
  fs.writeFileSync(OUT_PATH, JSON.stringify({ themes: manifest }, null, 2), 'utf8');
  // Only log on first creation or significant changes
  // console.log('Wrote theme registry manifest to', OUT_PATH);
}

main();