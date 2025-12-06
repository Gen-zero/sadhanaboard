import type { ThemeDefinition } from './types';

interface CachedTheme {
  definition: ThemeDefinition;
  cssUrl: string | null;
  cssLoaded: boolean;
  timestamp: number;
}

interface PreloadQueueItem {
  themeId: string;
  priority: 'high' | 'normal' | 'low';
}

class ThemeCacheManager {
  private cache = new Map<string, CachedTheme>();
  private cssCache = new Map<string, string>();
  private preloadQueue: PreloadQueueItem[] = [];
  private isPreloading = false;
  private maxAge = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Add theme to cache
   */
  set(themeId: string, theme: ThemeDefinition): void {
    this.cache.set(themeId, {
      definition: theme,
      cssUrl: theme.assets?.css || null,
      cssLoaded: false,
      timestamp: Date.now(),
    });

    // Persist to localStorage
    try {
      const cached = this.cache.get(themeId);
      if (cached) {
        localStorage.setItem(
          `theme-cache-${themeId}`,
          JSON.stringify({ 
            cssUrl: cached.cssUrl,
            cssLoaded: cached.cssLoaded,
            timestamp: cached.timestamp 
          })
        );
      }
    } catch (e) {
      console.warn('Failed to persist theme cache to localStorage', e);
    }
  }

  /**
   * Get theme from cache
   */
  get(themeId: string): CachedTheme | undefined {
    const cached = this.cache.get(themeId);
    
    if (!cached) {
      // Try to restore from localStorage
      try {
        const stored = localStorage.getItem(`theme-cache-${themeId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Date.now() - parsed.timestamp < this.maxAge) {
            return {
              ...parsed,
              definition: {} as ThemeDefinition, // Will be loaded separately
            };
          }
        }
      } catch (e) {
        console.warn('Failed to restore theme cache from localStorage', e);
      }
      return undefined;
    }

    // Check if expired
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(themeId);
      return undefined;
    }

    return cached;
  }

  /**
   * Mark CSS as loaded
   */
  markCSSLoaded(themeId: string): void {
    const cached = this.cache.get(themeId);
    if (cached) {
      cached.cssLoaded = true;
      // Update localStorage
      try {
        localStorage.setItem(
          `theme-cache-${themeId}`,
          JSON.stringify({
            cssUrl: cached.cssUrl,
            cssLoaded: true,
            timestamp: cached.timestamp,
          })
        );
      } catch (e) {
        console.warn('Failed to update theme cache in localStorage', e);
      }
    }
  }

  /**
   * Check if theme is cached
   */
  has(themeId: string): boolean {
    return this.cache.has(themeId) || !!this.get(themeId);
  }

  /**
   * Check if CSS is loaded for theme
   */
  isCSSLoaded(themeId: string): boolean {
    return this.cache.get(themeId)?.cssLoaded ?? false;
  }

  /**
   * Preload theme CSS file
   */
  async preloadCSS(themeId: string, cssUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check cache first
      if (this.cssCache.has(cssUrl)) {
        this.markCSSLoaded(themeId);
        resolve();
        return;
      }

      // Load via link tag
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = cssUrl;

      const timeout = setTimeout(() => {
        reject(new Error(`CSS preload timeout for ${cssUrl}`));
      }, 5000);

      const onLoad = () => {
        clearTimeout(timeout);
        this.cssCache.set(cssUrl, '');
        this.markCSSLoaded(themeId);
        link.remove();
        resolve();
      };

      const onError = () => {
        clearTimeout(timeout);
        link.remove();
        reject(new Error(`Failed to preload CSS: ${cssUrl}`));
      };

      link.onload = onLoad;
      link.onerror = onError;
      document.head.appendChild(link);
    });
  }

  /**
   * Preload multiple themes
   */
  async preloadThemes(themeIds: string[], themeRegistry: ThemeDefinition[]): Promise<void> {
    const preloadTasks = themeIds
      .map(id => themeRegistry.find(t => t.metadata.id === id))
      .filter((t): t is ThemeDefinition => !!t)
      .map(theme => {
        this.set(theme.metadata.id, theme);
        
        if (theme.assets?.css) {
          return this.preloadCSS(theme.metadata.id, theme.assets.css)
            .catch(e => console.warn(`Failed to preload ${theme.metadata.id}:`, e));
        }
        return Promise.resolve();
      });

    await Promise.allSettled(preloadTasks);
  }

  /**
   * Prefetch adjacent themes when user opens settings
   */
  async prefetchAdjacentThemes(
    currentThemeId: string,
    allThemes: ThemeDefinition[]
  ): Promise<void> {
    // Get theme categories to find adjacent themes
    const currentTheme = allThemes.find(t => t.metadata.id === currentThemeId);
    const currentCategory = currentTheme?.metadata.category;

    // Find themes in same category
    const adjacentThemes = allThemes
      .filter(t => t.metadata.category === currentCategory)
      .slice(0, 5);

    // Use requestIdleCallback for non-blocking preload
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        this.preloadThemes(
          adjacentThemes.map(t => t.metadata.id),
          allThemes
        ).catch(e => console.warn('Background preload failed:', e));
      }, { timeout: 10000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.preloadThemes(
          adjacentThemes.map(t => t.metadata.id),
          allThemes
        ).catch(e => console.warn('Background preload failed:', e));
      }, 2000);
    }
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
    this.cssCache.clear();
  }

  /**
   * Get cache stats for debugging
   */
  getStats(): {
    cachedThemes: number;
    cachedCSS: number;
    totalSize: string;
  } {
    let totalSize = 0;
    this.cache.forEach(c => {
      totalSize += JSON.stringify(c).length;
    });

    return {
      cachedThemes: this.cache.size,
      cachedCSS: this.cssCache.size,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
    };
  }
}

export const themeCache = new ThemeCacheManager();
export default themeCache;
