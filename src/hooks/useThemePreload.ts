import { useEffect } from 'react';
import { themeCache } from '@/themes/themeCache';
import { listThemes } from '@/themes';
import { useSettings } from './useSettings';

/**
 * Hook to preload themes intelligently
 * - Preload top themes on app init
 * - Preload visible themes when settings open
 * - Preload adjacent themes during idle time
 */
export function useThemePreload() {
  const { settings } = useSettings();

  // Preload initial themes on app load
  useEffect(() => {
    const initializeThemeCache = async () => {
      const allThemes = listThemes();
      
      // Preload top general themes (high-priority)
      const topThemes = [
        'default',
        'earth',
        'water',
        'fire',
        'shiva',
      ];

      try {
        await themeCache.preloadThemes(topThemes, allThemes);
        console.log('[ThemePreload] Preloaded top 5 themes');
      } catch (e) {
        console.warn('[ThemePreload] Failed to preload top themes:', e);
      }
    };

    initializeThemeCache();
  }, []);

  // Prefetch adjacent themes when user opens settings
  useEffect(() => {
    if (settings?.appearance?.colorScheme) {
      const allThemes = listThemes();
      themeCache.prefetchAdjacentThemes(
        settings.appearance.colorScheme,
        allThemes
      );
    }
  }, [settings?.appearance?.colorScheme]);

  return { themeCache };
}

export default useThemePreload;
