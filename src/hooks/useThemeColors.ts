import { useMemo } from 'react';
import { useSettings } from './useSettings';
import { getThemeById } from '@/themes';

/**
 * Hook to get theme-aware color values for the current active theme.
 * Returns HSL color values that can be used directly in Tailwind classes or CSS.
 * 
 * @example
 * ```tsx
 * const { colors, classes, styles, scheme } = useThemeColors();
 * 
 * // Use raw colors
 * <div style={{ backgroundColor: `hsl(${colors.primary})` }} />
 * 
 * // Use Tailwind classes
 * <button className={classes.primaryBg} />
 * 
 * // Use inline styles
 * <span style={styles.primary} />
 * 
 * // Check current scheme
 * if (scheme === 'mahakali') { ... }
 * ```
 */
export function useThemeColors() {
  const { settings } = useSettings();
  const colorScheme = settings?.appearance?.colorScheme || 'default';
  
  const themeColors = useMemo(() => {
    const theme = getThemeById(colorScheme);
    
    if (!theme) {
      // Fallback to default theme colors
      return {
        primary: '270 60% 50%',
        primaryForeground: '60 100% 97%',
        secondary: '270 30% 25%',
        secondaryForeground: '60 100% 97%',
        accent: '270 50% 40%',
        accentForeground: '60 100% 97%',
        muted: '210 22% 25%',
        mutedForeground: '208 11% 70%',
        background: '210 30% 13%',
        foreground: '60 100% 97%',
        border: '210 16% 25%',
        ring: '270 60% 50%',
        destructive: '0 84.2% 58%',
        destructiveForeground: '60 100% 97%',
      };
    }
    
    return theme.colors;
  }, [colorScheme]);
  
  /**
   * Get Tailwind utility classes for theme-aware colors
   */
  const getColorClasses = useMemo(() => ({
    // Background classes
    primaryBg: 'bg-primary',
    secondaryBg: 'bg-secondary',
    accentBg: 'bg-accent',
    mutedBg: 'bg-muted',
    
    // Text classes
    primaryText: 'text-primary',
    secondaryText: 'text-secondary',
    accentText: 'text-accent',
    mutedText: 'text-muted-foreground',
    foregroundText: 'text-foreground',
    
    // Border classes
    primaryBorder: 'border-primary',
    secondaryBorder: 'border-secondary',
    accentBorder: 'border-accent',
    defaultBorder: 'border-border',
    
    // Hover states
    primaryHover: 'hover:bg-primary/90',
    secondaryHover: 'hover:bg-secondary/90',
    accentHover: 'hover:bg-accent/90',
    
    // Ring/focus states
    primaryRing: 'ring-primary',
    accentRing: 'ring-accent',
  }), []);
  
  /**
   * Get inline style object for theme colors
   */
  const getInlineStyles = useMemo(() => ({
    primary: { color: `hsl(${themeColors.primary})` },
    primaryBg: { backgroundColor: `hsl(${themeColors.primary})` },
    secondary: { color: `hsl(${themeColors.secondary})` },
    secondaryBg: { backgroundColor: `hsl(${themeColors.secondary})` },
    accent: { color: `hsl(${themeColors.accent})` },
    accentBg: { backgroundColor: `hsl(${themeColors.accent})` },
    border: { borderColor: `hsl(${themeColors.border})` },
  }), [themeColors]);
  
  return {
    /** Raw theme color values (HSL format) */
    colors: themeColors,
    /** Tailwind utility classes for theme colors */
    classes: getColorClasses,
    /** Inline style objects for theme colors */
    styles: getInlineStyles,
    /** Current color scheme ID */
    scheme: colorScheme,
  };
}

/**
 * Hook to get icon color based on current theme
 */
export function useThemeIconColor(): string {
  const { colors } = useThemeColors();
  return `hsl(${colors.primary})`;
}

/**
 * Hook to check if current theme is a specific one
 */
export function useIsTheme(themeId: string): boolean {
  const { scheme } = useThemeColors();
  return scheme === themeId;
}
