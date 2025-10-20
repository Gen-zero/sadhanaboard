const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '..', 'data', 'theme-registry.json');
const SRC_INDEX = path.join(__dirname, '..', '..', 'src', 'themes', 'index.ts');

function tryReadManifest() {
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      const txt = fs.readFileSync(MANIFEST_PATH, 'utf8');
      const parsed = JSON.parse(txt);
      if (parsed && Array.isArray(parsed.themes)) return parsed.themes.map(t => ({ id: t.id || (t.metadata && t.metadata.id), metadata: t.metadata }));
    }
  } catch (e) {
    // swallow
  }
  return null;
}

function parseSrcIndex() {
  try {
    if (!fs.existsSync(SRC_INDEX)) return [];
    const src = fs.readFileSync(SRC_INDEX, 'utf8');
    const importRegex = /import\s+(\w+)\s+from\s+'\.\/([\w-]+)';/g;
    const themes = [];
    let m;
    while ((m = importRegex.exec(src)) !== null) themes.push(m[2]);
    const items = [];
    for (const name of themes) {
      const candidates = [
        path.join(path.dirname(SRC_INDEX), `${name}.ts`),
        path.join(path.dirname(SRC_INDEX), name, 'index.ts'),
      ];
      for (const p of candidates) {
        if (!fs.existsSync(p)) continue;
        const s = fs.readFileSync(p, 'utf8');
        const metaMatch = s.match(/metadata\s*:\s*\{([\s\S]*?)\}\s*,?/m);
        if (metaMatch) {
          let body = '{' + metaMatch[1] + '}';
          body = body.replace(/\n/g, ' ');
          body = body.replace(/'/g, '"');
          body = body.replace(/([,\{\s])(\w+)\s*:/g, '$1"$2":');
          body = body.replace(/,\s*}/g, '}');
          try {
            const obj = JSON.parse(body);
            items.push({ id: obj.id || name, metadata: obj });
            break;
          } catch (e) {
            // ignore parse errors for this theme
          }
        }
      }
    }
    return items;
  } catch (e) {
    return [];
  }
}

let CACHE = null;

function loadRegistry() {
  if (CACHE) return CACHE;
  let items = tryReadManifest();
  if (!items) items = parseSrcIndex();
  CACHE = items || [];
  return CACHE;
}

function getRegistry() {
  return loadRegistry();
}

function getThemeById(id) {
  if (!id) return null;
  const reg = loadRegistry();
  return reg.find(t => String(t.id) === String(id)) || null;
}

function isValidThemeId(id) {
  return !!getThemeById(id);
}

function listThemeIds() {
  return loadRegistry().map(t => t.id);
}

module.exports = {
  getRegistry,
  getThemeById,
  isValidThemeId,
  listThemeIds,
};
