import { useMemo } from 'react';
import { useSettings } from './useSettings';

/**
 * Hook that provides consistent styling for the default theme
 * Returns class names and styles that match the aesthetic seen in SadhanaHeader
 * with transparent backgrounds, white borders, and whitish-gold text elements
 */
export function useDefaultThemeStyles() {
  const { settings } = useSettings();
  
  // Check if default theme is active
  const isDefaultTheme = settings?.appearance?.colorScheme === 'default';

  const defaultThemeClasses = useMemo(() => {
    if (!isDefaultTheme) {
      return {
        // Base container styles
        container: '',
        // Card/container with background and border
        borderedContainer: '',
        // Text styles
        primaryText: '',
        secondaryText: '',
        accentText: '',
        // Button styles
        primaryButton: '',
        secondaryButton: '',
        // Gradient backgrounds
        gradientBackground: '',
        // Border styles
        border: '',
        // Glow effects
        glowEffect: '',
        // Golden text variants
        goldLight: '',
        goldMedium: '',
        goldDark: '',
      };
    }

    return {
      // Base container styles with transparent background and white border
      container: 'backdrop-blur-lg bg-transparent border border-white',
      
      // Card/container with background and border
      borderedContainer: 'backdrop-blur-lg bg-transparent border border-white',
      
      // Text styles using the theme's accent color (golden) for the golden/whitish effect
      primaryText: 'text-[hsl(var(--accent))]', // Use the theme's accent color (golden)
      secondaryText: 'text-[hsl(var(--muted-foreground))]', // Use the theme's muted foreground
      accentText: 'text-[hsl(var(--accent))]', // Use the theme's accent color (golden)
      
      // Button styles with white borders and golden backgrounds
      primaryButton: 'bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))]',
      secondaryButton: 'bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))]',
      
      // Gradient backgrounds with white/golden tones
      gradientBackground: 'bg-gradient-to-r from-white/10 via-[hsl(var(--accent))]/10 to-white/10',
      
      // Border styles
      border: 'border-white',
      
      // Glow effects
      glowEffect: 'shadow-[0_0_15px_rgba(255,215,0,0.3)]', // Using fixed gold color with alpha
      
      // Golden text variants for more nuanced styling
      goldLight: 'text-[hsl(var(--accent))]', // Light gold (same as accent)
      goldMedium: 'text-[hsl(var(--accent))]', // Medium gold (same as accent)
      goldDark: 'text-[hsl(var(--accent))]', // Dark gold (same as accent)
    };
  }, [isDefaultTheme]);

  return {
    isDefaultTheme,
    defaultThemeClasses
  };
}