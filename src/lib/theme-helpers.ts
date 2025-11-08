/**
 * Theme Helpers - Quick Reference
 * Import and use these helpers for theme-adaptive styling
 */

// Re-export theme hooks for convenience
export { useThemeColors, useThemeIconColor, useIsTheme } from '@/hooks/useThemeColors';

// Re-export theme utilities
export { ThemeAwareIcon, withThemeColor } from '@/components/ThemeAwareIcon';
export type { ThemeAwareIconProps } from '@/components/ThemeAwareIcon';

// Re-export theme functions
export { 
  getThemeById, 
  listThemes, 
  getThemesByDeity,
  getLandingPageThemes,
  getColorSchemeThemes,
  themeUtils 
} from '@/themes';

export type { ThemeDefinition, ThemeColors, ThemeMetadata } from '@/themes/types';

/**
 * Quick reference for common theme patterns
 */
export const themePatterns = {
  /**
   * Get a theme-aware button class string
   */
  button: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary/30 text-secondary-foreground hover:bg-secondary/40 backdrop-blur-sm',
    outline: 'border border-primary bg-transparent hover:bg-primary/10',
    ghost: 'hover:bg-accent/30 hover:text-accent-foreground',
  },
  
  /**
   * Get a theme-aware card class string
   */
  card: {
    default: 'bg-card border border-border rounded-lg',
    highlighted: 'bg-card border border-primary/30 rounded-lg',
    soft: 'bg-card/50 border border-border rounded-lg backdrop-blur-sm',
  },
  
  /**
   * Get a theme-aware badge class string
   */
  badge: {
    primary: 'bg-primary/20 text-primary border border-primary/30',
    secondary: 'bg-secondary/20 text-secondary border border-secondary/30',
    accent: 'bg-accent/20 text-accent border border-accent/30',
  },
  
  /**
   * Get a theme-aware loading spinner class string
   */
  spinner: {
    primary: 'border-4 border-primary border-t-transparent rounded-full animate-spin',
    accent: 'border-4 border-accent border-t-transparent rounded-full animate-spin',
  },
  
  /**
   * Get a theme-aware text class string
   */
  text: {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    muted: 'text-muted-foreground',
    foreground: 'text-foreground',
  },
  
  /**
   * Get a theme-aware background class string
   */
  background: {
    primary: 'bg-primary',
    primarySoft: 'bg-primary/10',
    secondary: 'bg-secondary',
    secondarySoft: 'bg-secondary/10',
    accent: 'bg-accent',
    accentSoft: 'bg-accent/10',
    card: 'bg-card',
    muted: 'bg-muted',
  },
  
  /**
   * Get a theme-aware border class string
   */
  border: {
    default: 'border-border',
    primary: 'border-primary',
    primarySoft: 'border-primary/20',
    secondary: 'border-secondary',
    accent: 'border-accent',
  },
} as const;

/**
 * Helper function to combine theme classes
 */
export function themeClass(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Helper to check if a theme is dark-based
 */
export function isDarkTheme(themeId: string): boolean {
  const darkThemes = ['default', 'shiva', 'bhairava', 'mahakali', 'mystery', 'tara', 'cosmos', 'durga'];
  return darkThemes.includes(themeId);
}

/**
 * Helper to get theme icon/emoji representation
 */
export function getThemeEmoji(themeId: string): string {
  const emojiMap: Record<string, string> = {
    default: '🌌',
    earth: '🌍',
    water: '🌊',
    fire: '🔥',
    shiva: '🔱',
    bhairava: '💀',
    serenity: '☮️',
    ganesha: '🐘',
    mahakali: '⚡',
    mystery: '🌿',
    neon: '⚡',
    lakshmi: '💰',
    tara: '⭐',
    vishnu: '🦅',
    krishna: '🎵',
    swamiji: '🕉️',
    cosmos: '✨',
    durga: '🦁',
  };
  return emojiMap[themeId] || '🎨';
}

/**
 * CSS-in-JS helper for theme colors
 */
export function getCSSColorValue(hslString: string, opacity?: number): string {
  if (opacity !== undefined) {
    return `hsl(${hslString} / ${opacity})`;
  }
  return `hsl(${hslString})`;
}

/**
 * Type guard for theme categories
 */
export function isThemeCategory(category: string): category is 'landing' | 'color-scheme' | 'hybrid' {
  return ['landing', 'color-scheme', 'hybrid'].includes(category);
}
