/**
 * Enhanced Color Adaptation System for Themes
 * 
 * This module provides adaptive color palettes for each theme based on:
 * - Theme name and associated deity/concept
 * - Background color and gradient
 * - Visual harmony and accessibility
 */

import { ThemeColors } from './types';

/**
 * Theme Color Palette Configuration
 * Each theme has a primary color, secondary color, and derived palette
 */
export interface ThemePaletteConfig {
  themeName: string;
  primaryHue: number;      // Primary color hue (0-360)
  primarySat: number;      // Primary saturation (0-100)
  primaryLight: number;    // Primary lightness (0-100)
  secondaryHue: number;    // Secondary color hue
  accentHue: number;       // Accent color hue
  bgDarkness: 'dark' | 'light'; // Whether background is dark or light
  gradient?: string;       // Optional gradient description
}

/**
 * Predefined color schemes for each theme
 * These are optimized for visual harmony and accessibility
 */
export const THEME_COLOR_CONFIGS: Record<string, ThemePaletteConfig> = {
  // Default Theme - Golden & Spiritual
  default: {
    themeName: 'Default',
    primaryHue: 45,      // Gold
    primarySat: 100,
    primaryLight: 50,
    secondaryHue: 270,   // Purple-blue
    accentHue: 45,       // Gold
    bgDarkness: 'light',
    gradient: 'from-purple-200 via-purple-100 to-gold-100'
  },

  // Shiva Theme - Deep Mystical Blue & Blacks
  shiva: {
    themeName: 'Lord Shiva',
    primaryHue: 280,     // Deep purple-blue
    primarySat: 100,
    primaryLight: 45,
    secondaryHue: 250,   // Violet
    accentHue: 200,      // Cyan (third eye)
    bgDarkness: 'dark',
    gradient: 'from-slate-900 via-purple-900 to-blue-900'
  },

  // Mahakali Theme - Dark Red & Black
  mahakali: {
    themeName: 'Mahakali',
    primaryHue: 0,       // Deep red
    primarySat: 100,
    primaryLight: 40,
    secondaryHue: 280,   // Purple
    accentHue: 355,      // Crimson
    bgDarkness: 'dark',
    gradient: 'from-gray-950 via-red-900 to-purple-900'
  },

  // Earth Theme - Browns & Greens
  earth: {
    themeName: 'Earth',
    primaryHue: 120,     // Green
    primarySat: 70,
    primaryLight: 45,
    secondaryHue: 25,    // Brown
    accentHue: 60,       // Yellow-green
    bgDarkness: 'light',
    gradient: 'from-green-100 via-amber-50 to-green-50'
  },

  // Water Theme - Blues & Teals
  water: {
    themeName: 'Water',
    primaryHue: 200,     // Ocean blue
    primarySat: 100,
    primaryLight: 48,
    secondaryHue: 180,   // Cyan
    accentHue: 170,      // Teal
    bgDarkness: 'dark',
    gradient: 'from-blue-900 via-cyan-800 to-teal-900'
  },

  // Fire Theme - Reds & Oranges
  fire: {
    themeName: 'Fire',
    primaryHue: 25,      // Orange
    primarySat: 100,
    primaryLight: 55,
    secondaryHue: 0,     // Red
    accentHue: 40,       // Golden orange
    bgDarkness: 'light',
    gradient: 'from-orange-100 via-red-100 to-yellow-100'
  },

  // Bhairava Theme - Dark Orange & Gold
  bhairava: {
    themeName: 'Bhairava',
    primaryHue: 30,      // Deep orange
    primarySat: 90,
    primaryLight: 45,
    secondaryHue: 0,     // Red
    accentHue: 45,       // Gold
    bgDarkness: 'dark',
    gradient: 'from-slate-900 via-orange-900 to-red-900'
  },

  // Serenity Theme - Soft Blues & Whites
  serenity: {
    themeName: 'Serenity',
    primaryHue: 200,     // Light blue
    primarySat: 60,
    primaryLight: 55,
    secondaryHue: 180,   // Cyan
    accentHue: 240,      // Light violet
    bgDarkness: 'light',
    gradient: 'from-blue-50 via-indigo-50 to-blue-100'
  },

  // Ganesha Theme - Red & Gold
  ganesha: {
    themeName: 'Lord Ganesha',
    primaryHue: 0,       // Red
    primarySat: 100,
    primaryLight: 50,
    secondaryHue: 45,    // Gold
    accentHue: 30,       // Orange
    bgDarkness: 'light',
    gradient: 'from-red-100 via-yellow-50 to-orange-100'
  },

  // Neon Theme - Bright Cyberpunk
  neon: {
    themeName: 'Neon',
    primaryHue: 120,     // Neon green
    primarySat: 100,
    primaryLight: 50,
    secondaryHue: 280,   // Neon purple
    accentHue: 0,        // Neon red
    bgDarkness: 'dark',
    gradient: 'from-gray-950 via-purple-950 to-gray-950'
  },

  // Lakshmi Theme - Gold & Red
  lakshmi: {
    themeName: 'Lakshmi',
    primaryHue: 45,      // Gold
    primarySat: 100,
    primaryLight: 50,
    secondaryHue: 0,     // Red
    accentHue: 50,       // Bright gold
    bgDarkness: 'light',
    gradient: 'from-yellow-100 via-orange-50 to-red-100'
  },

  // Tara Theme - Green & Gold
  tara: {
    themeName: 'Tara',
    primaryHue: 120,     // Green
    primarySat: 80,
    primaryLight: 45,
    secondaryHue: 45,    // Gold
    accentHue: 100,      // Yellow-green
    bgDarkness: 'light',
    gradient: 'from-green-100 via-yellow-50 to-green-100'
  },

  // Durga Theme - Red & Gold
  durga: {
    themeName: 'Durga',
    primaryHue: 0,       // Red
    primarySat: 100,
    primaryLight: 50,
    secondaryHue: 45,    // Gold
    accentHue: 355,      // Deep red
    bgDarkness: 'dark',
    gradient: 'from-red-900 via-orange-800 to-red-950'
  },

  // Cosmos Theme - Deep Purple & Indigo
  cosmos: {
    themeName: 'Cosmic Nebula',
    primaryHue: 260,     // Deep purple
    primarySat: 100,
    primaryLight: 45,
    secondaryHue: 280,   // Violet
    accentHue: 180,      // Cyan
    bgDarkness: 'dark',
    gradient: 'from-indigo-950 via-purple-900 to-violet-950'
  },

  // Mystery Theme - Dark Blues & Purples
  mystery: {
    themeName: 'Mystery',
    primaryHue: 270,     // Purple
    primarySat: 80,
    primaryLight: 45,
    secondaryHue: 240,   // Blue
    accentHue: 200,      // Cyan
    bgDarkness: 'dark',
    gradient: 'from-slate-950 via-purple-900 to-blue-950'
  },

  // Swamiji Theme - Saffron & Gold
  swamiji: {
    themeName: 'Swamiji',
    primaryHue: 30,      // Saffron
    primarySat: 100,
    primaryLight: 50,
    secondaryHue: 45,    // Gold
    accentHue: 35,       // Deep saffron
    bgDarkness: 'light',
    gradient: 'from-orange-100 via-yellow-50 to-amber-100'
  },

  // Vishnu Theme - Deep Blue
  vishnu: {
    themeName: 'Lord Vishnu',
    primaryHue: 240,     // Deep blue
    primarySat: 100,
    primaryLight: 45,
    secondaryHue: 180,   // Cyan
    accentHue: 200,      // Turquoise
    bgDarkness: 'dark',
    gradient: 'from-blue-950 via-cyan-900 to-blue-950'
  },

  // Krishna Theme - Dark Green
  krishna: {
    themeName: 'Lord Krishna',
    primaryHue: 120,     // Forest green
    primarySat: 100,
    primaryLight: 30,
    secondaryHue: 45,    // Gold
    accentHue: 180,      // Cyan
    bgDarkness: 'dark',
    gradient: 'from-green-950 via-emerald-900 to-green-950'
  },

  // Narasimha Theme - Orange & Crimson
  narasimha: {
    themeName: 'Lord Narasimha',
    primaryHue: 20,      // Fiery orange
    primarySat: 100,
    primaryLight: 50,
    secondaryHue: 355,   // Crimson
    accentHue: 45,       // Gold
    bgDarkness: 'dark',
    gradient: 'from-gray-950 via-red-900 to-orange-950'
  },

  // Chaitanya Theme - Gold & Rose
  chaitanya: {
    themeName: 'Chaitanya',
    primaryHue: 45,      // Gold
    primarySat: 100,
    primaryLight: 50,
    secondaryHue: 160,   // Emerald green
    accentHue: 345,      // Rose pink
    bgDarkness: 'light',
    gradient: 'from-yellow-100 via-orange-50 to-pink-100'
  },

  // Premanand Theme - Saffron & Burgundy
  premanand: {
    themeName: 'Premanand',
    primaryHue: 35,      // Saffron
    primarySat: 100,
    primaryLight: 55,
    secondaryHue: 220,   // Navy blue
    accentHue: 355,      // Burgundy
    bgDarkness: 'light',
    gradient: 'from-orange-100 via-red-50 to-yellow-100'
  },

  // Ayyappan Theme - Ocean Blue & Gold
  ayyappan: {
    themeName: 'Swami Ayyappan',
    primaryHue: 220,     // Ocean blue
    primarySat: 100,
    primaryLight: 45,
    secondaryHue: 50,    // Gold
    accentHue: 50,       // Bright gold
    bgDarkness: 'dark',
    gradient: 'from-blue-950 via-indigo-900 to-blue-950'
  },

  // Android Theme - Material Blue
  android: {
    themeName: 'Android',
    primaryHue: 225,     // Material blue
    primarySat: 73,
    primaryLight: 52,
    secondaryHue: 210,   // Light blue
    accentHue: 225,      // Material blue
    bgDarkness: 'light',
    gradient: 'from-blue-50 via-white to-blue-50'
  }
};

/**
 * Generate HSL colors from a hue, saturation, and lightness
 */
function generateHSL(hue: number, sat: number, light: number): string {
  return `${hue} ${sat}% ${light}%`;
}

/**
 * Generate adaptive colors for a theme based on its configuration
 */
export function generateAdaptiveColors(themeId: string, config: ThemePaletteConfig): ThemeColors {
  const isDark = config.bgDarkness === 'dark';

  // Base colors
  const primary = generateHSL(config.primaryHue, config.primarySat, config.primaryLight);
  const secondary = generateHSL(
    config.secondaryHue,
    Math.max(config.primarySat - 20, 40),
    isDark ? config.primaryLight + 15 : config.primaryLight - 15
  );
  const accent = generateHSL(config.accentHue, 100, isDark ? 50 : 55);

  // Background and foreground based on theme darkness
  const bgLight = isDark ? 8 : 94;
  const fgLight = isDark ? 95 : 12;
  const cardLight = isDark ? bgLight + 6 : bgLight - 6;
  const borderLight = isDark ? bgLight + 12 : bgLight - 12;

  // Generate muted colors
  const mutedHue = config.primaryHue;
  const mutedLight = isDark ? bgLight + 18 : bgLight - 18;

  return {
    // Base colors
    background: generateHSL(config.primaryHue, config.primarySat - 70, bgLight),
    foreground: generateHSL(config.primaryHue, config.primarySat - 60, fgLight),

    // Cards
    card: generateHSL(config.primaryHue, config.primarySat - 60, cardLight),
    cardForeground: generateHSL(config.primaryHue, config.primarySat - 60, isDark ? 92 : 15),

    // Popover
    popover: generateHSL(config.primaryHue, config.primarySat - 65, isDark ? cardLight + 4 : cardLight - 4),
    popoverForeground: generateHSL(config.primaryHue, config.primarySat - 60, isDark ? 90 : 18),

    // Primary color
    primary,
    primaryForeground: generateHSL(0, 0, isDark ? 100 : 0),

    // Secondary color
    secondary,
    secondaryForeground: generateHSL(0, 0, isDark ? 95 : 10),

    // Muted
    muted: generateHSL(mutedHue, config.primarySat - 50, mutedLight),
    mutedForeground: generateHSL(mutedHue, config.primarySat - 40, isDark ? 70 : 45),

    // Accent
    accent,
    accentForeground: generateHSL(config.accentHue, config.primarySat - 70, isDark ? 15 : 95),

    // Destructive
    destructive: generateHSL(0, 84, 58),
    destructiveForeground: generateHSL(0, 0, isDark ? 95 : 100),

    // Borders and inputs
    border: generateHSL(config.primaryHue, config.primarySat - 50, borderLight),
    input: generateHSL(config.primaryHue, config.primarySat - 60, isDark ? cardLight + 2 : cardLight - 2),
    ring: primary,

    // Sidebar variants
    sidebarBackground: generateHSL(config.primaryHue, config.primarySat - 65, isDark ? bgLight - 2 : bgLight + 2),
    sidebarForeground: generateHSL(config.primaryHue, config.primarySat - 60, isDark ? 93 : 14),
    sidebarPrimary: primary,
    sidebarPrimaryForeground: generateHSL(0, 0, isDark ? 100 : 0),
    sidebarAccent: accent,
    sidebarAccentForeground: generateHSL(config.accentHue, config.primarySat - 70, isDark ? 18 : 92),
    sidebarBorder: generateHSL(config.primaryHue, config.primarySat - 50, borderLight),
    sidebarRing: primary
  };
}

/**
 * Get adaptive colors for a specific theme
 */
export function getAdaptiveColors(themeId: string): ThemeColors {
  const config = THEME_COLOR_CONFIGS[themeId];
  if (!config) {
    console.warn(`No color configuration found for theme: ${themeId}, using default`);
    return generateAdaptiveColors(themeId, THEME_COLOR_CONFIGS['default']);
  }
  return generateAdaptiveColors(themeId, config);
}

/**
 * Get all adaptive color configurations
 */
export function getAllAdaptiveColors(): Record<string, ThemeColors> {
  const result: Record<string, ThemeColors> = {};
  Object.entries(THEME_COLOR_CONFIGS).forEach(([themeId, config]) => {
    result[themeId] = generateAdaptiveColors(themeId, config);
  });
  return result;
}
