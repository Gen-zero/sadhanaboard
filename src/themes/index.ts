import type { ThemeDefinition } from './types';
import defaultTheme from './default';
import shivaTheme from './shiva';
import mahakaliTheme from './mahakali';
import mysteryTheme from './mystery';
import earthTheme from './earth';
import waterTheme from './water';
import fireTheme from './fire';
import bhairavaTheme from './bhairava';
import serenityTheme from './serenity';
import ganeshaTheme from './ganesha';
import neonTheme from './neon';
import lakshmiTheme from './lakshmi';
import taraTheme from './tara';
import vishnuTheme from './vishnu';
import krishnaTheme from './krishna';
import swamijiTheme from './swamiji';
import durgaTheme from './durga';
import cosmosTheme from './cosmos';

export type { ThemeDefinition } from './types';
const loadDefaultTheme = () => import('./default');
const loadShivaTheme = () => import('./shiva');
const loadMahakaliTheme = () => import('./mahakali');
const loadMysteryTheme = () => import('./mystery');
const loadEarthTheme = () => import('./earth');
const loadWaterTheme = () => import('./water');
const loadFireTheme = () => import('./fire');
const loadBhairavaTheme = () => import('./bhairava');
const loadSerenityTheme = () => import('./serenity');
const loadGaneshaTheme = () => import('./ganesha');
const loadNeonTheme = () => import('./neon');
const loadLakshmiTheme = () => import('./lakshmi');
const loadTaraTheme = () => import('./tara');
const loadVishnuTheme = () => import('./vishnu');
const loadKrishnaTheme = () => import('./krishna');
const loadSwamijiTheme = () => import('./swamiji');
const loadDurgaTheme = () => import('./durga');
const loadCosmosTheme = () => import('./cosmos');

// Validate theme definition
function validateTheme(def: ThemeDefinition): boolean {
  if (!def || !def.metadata) {
    console.warn('Theme validation failed: missing metadata');
    return false;
  }
  
  if (!def.metadata.id) {
    console.warn('Theme validation failed: missing id');
    return false;
  }
  
  if (!def.metadata.name) {
    console.warn('Theme validation failed: missing name');
    return false;
  }
  
  if (!def.colors) {
    console.warn('Theme validation failed: missing colors');
    return false;
  }
  
  // Check required color fields
  const requiredColors = [
    'background', 'foreground', 'primary', 'primaryForeground',
    'secondary', 'secondaryForeground', 'muted', 'mutedForeground',
    'accent', 'accentForeground', 'destructive', 'destructiveForeground',
    'border', 'input', 'ring'
  ];
  
  for (const color of requiredColors) {
    if (!def.colors[color as keyof typeof def.colors]) {
      console.warn(`Theme validation failed: missing required color ${color}`);
      return false;
    }
  }
  
  return true;
}

// Get theme health status
function getThemeHealth(def: ThemeDefinition): { status: 'healthy' | 'warning' | 'error'; issues: string[] } {
  const issues: string[] = [];
  
  if (!def) {
    return { status: 'error', issues: ['Theme definition is null or undefined'] };
  }
  
  // Check if icon asset exists (basic check)
  if (def.assets?.icon) {
    // In a real implementation, we might want to actually try loading the asset
    // For now, we'll just note it as a potential check
    // issues.push('Icon asset URL should be verified');
  }
  
  // Check if background image asset exists (basic check)
  if (def.assets?.backgroundImage) {
    // In a real implementation, we would verify the asset URL
    // issues.push('Background image URL should be verified');
  }
  
  // Check if theme is marked as unavailable
  if (def.available === false) {
    issues.push('Theme marked as unavailable');
  }
  
  // Validate required fields
  if (!validateTheme(def)) {
    issues.push('Theme validation failed');
  }
  
  let status: 'healthy' | 'warning' | 'error' = 'healthy';
  if (issues.length > 0) {
    status = issues.some(issue => issue.includes('error')) ? 'error' : 'warning';
  }
  
  return { status, issues };
}

// Guarded theme registry builder
function buildThemeRegistry(themes: ThemeDefinition[]): ThemeDefinition[] {
  const validThemes: ThemeDefinition[] = [];
  
  for (const theme of themes) {
    try {
      if (validateTheme(theme)) {
        validThemes.push(theme);
      } else {
        console.warn(`Skipping invalid theme: ${theme.metadata?.id || 'unknown'}`);
      }
    } catch (error) {
      console.warn(`Error validating theme: ${theme.metadata?.id || 'unknown'}`, error);
    }
  }
  
  return validThemes;
}

const RAW_THEME_REGISTRY: ThemeDefinition[] = [
  defaultTheme,
  shivaTheme,
  mahakaliTheme,
  mysteryTheme,
  earthTheme,
  waterTheme,
  fireTheme,
  bhairavaTheme,
  serenityTheme,
  ganeshaTheme,
  neonTheme,
  lakshmiTheme,
  taraTheme,
  vishnuTheme,
  krishnaTheme,
  swamijiTheme,
  durgaTheme,
  cosmosTheme,
];

// Debug logging
console.log('[DEBUG] Raw theme registry:', RAW_THEME_REGISTRY.map(t => ({
  id: t.metadata.id,
  name: t.metadata.name,
  category: t.metadata.category,
  available: t.available
})));

// Check for duplicates
const themeIds = RAW_THEME_REGISTRY.map(t => t.metadata.id);
const duplicateIds = themeIds.filter((id, index) => themeIds.indexOf(id) !== index);
if (duplicateIds.length > 0) {
  console.warn('[DEBUG] Duplicate theme IDs found:', duplicateIds);
} else {
  console.log('[DEBUG] No duplicate theme IDs found');
}

// Check for unused themes (themes not in validThemes list in App.tsx)
const validThemesInApp = ['default', 'earth', 'water', 'fire', 'shiva', 'bhairava', 'serenity', 'ganesha', 'mystery', 'neon', 'tara', 'durga', 'mahakali', 'swamiji', 'cosmos', 'lakshmi', 'vishnu', 'krishna'];
const unusedThemes = RAW_THEME_REGISTRY.filter(t => !validThemesInApp.includes(t.metadata.id));
if (unusedThemes.length > 0) {
  console.warn('[DEBUG] Unused themes found:', unusedThemes.map(t => t.metadata.id));
} else {
  console.log('[DEBUG] All themes are used in App.tsx');
}

const THEME_REGISTRY: ReadonlyArray<ThemeDefinition> = Object.freeze(
  buildThemeRegistry(RAW_THEME_REGISTRY)
);

// Debug logging
console.log('[DEBUG] Final theme registry:', THEME_REGISTRY.map(t => ({
  id: t.metadata.id,
  name: t.metadata.name,
  category: t.metadata.category,
  available: t.available
})));

function getThemeById(id: string): ThemeDefinition | undefined {
  return THEME_REGISTRY.find(t => t.metadata.id === id);
}

function listThemes(options?: { category?: string; available?: boolean }): ThemeDefinition[] {
  let res = [...THEME_REGISTRY];
  if (options) {
    if (options.category) res = res.filter(r => r.metadata.category === (options.category as string));
    if (typeof options.available === 'boolean') res = res.filter(r => Boolean(r.available) === options.available);
  }
  return res;
}

function getThemesByDeity(deity: string): ThemeDefinition[] {
  return THEME_REGISTRY.filter(t => String(t.metadata.deity || '').toLowerCase() === String(deity || '').toLowerCase());
}

function getLandingPageThemes(): ThemeDefinition[] {
  return THEME_REGISTRY.filter(t => Boolean(t.metadata.isLandingPage));
}

function getColorSchemeThemes(): ThemeDefinition[] {
  return THEME_REGISTRY.filter(t => t.metadata.category === 'color-scheme');
}

// Debug function for development
function debugThemes(): void {
  console.log('=== Theme Registry Debug Info ===');
  console.log(`Total themes: ${THEME_REGISTRY.length}`);
  
  THEME_REGISTRY.forEach(theme => {
    const health = getThemeHealth(theme);
    console.log(`\nTheme: ${theme.metadata.id} (${theme.metadata.name})`);
    console.log(`  Status: ${health.status}`);
    if (health.issues.length > 0) {
      console.log(`  Issues: ${health.issues.join(', ')}`);
    }
    console.log(`  Category: ${theme.metadata.category}`);
    console.log(`  Deity: ${theme.metadata.deity || 'None'}`);
    console.log(`  Icon: ${theme.metadata.icon || 'None'}`);
    console.log(`  Assets:`, theme.assets);
  });
}

// Run debug on load
if (typeof window !== 'undefined' && (window as any).location?.hostname === 'localhost') {
  setTimeout(debugThemes, 1000);
}

// Also export a function to manually trigger debug
export function triggerDebug() {
  debugThemes();
}

export {
  THEME_REGISTRY,
  getThemeById,
  listThemes,
  getThemesByDeity,
  getLandingPageThemes,
  getColorSchemeThemes,
  validateTheme,
  getThemeHealth,
  debugThemes
  // triggerDebug is already exported above
};

export default {
  THEME_REGISTRY,
  getThemeById,
  listThemes,
  getThemesByDeity,
  getLandingPageThemes,
  getColorSchemeThemes,
  validateTheme,
  getThemeHealth,
  debugThemes,
  triggerDebug // Add it to the default export
};

// Re-export utilities for convenience
export { default as themeUtils } from './utils';
export * from './utils';

// Re-export cache manager
export { themeCache } from './themeCache';

// Initialize theme cache on app load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const { themeCache } = require('./themeCache');
    THEME_REGISTRY.forEach((theme: ThemeDefinition) => {
      themeCache.set(theme.metadata.id, theme);
    });
    console.log('[ThemeCache] Initialized with all themes');
  }, 0);
}