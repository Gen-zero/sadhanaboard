/**
 * Cache Manager
 * Unified caching layer with multiple storage backends
 * Supports LocalStorage, IndexedDB, and in-memory caching
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
  scope?: string; // user-specific or global
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  itemCount: number;
}

class CacheManager {
  private localStorage: Map<string, CacheEntry<any>> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    size: 0,
    itemCount: 0,
  };
  private readonly MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit
  private readonly CLEANUP_INTERVAL = 60 * 1000; // Clean every minute
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
  }

  /**
   * Set cache value with TTL
   */
  set<T>(key: string, value: T, ttlMs: number = 5 * 60 * 1000, scope?: string): void {
    try {
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        ttl: ttlMs,
        scope,
      };

      // Store in memory
      this.localStorage.set(key, entry);

      // Also persist to browser localStorage for persistence
      const scopedKey = scope ? `${scope}:${key}` : key;
      try {
        window.localStorage.setItem(`cache:${scopedKey}`, JSON.stringify(entry));
      } catch (e) {
        // LocalStorage full - remove old entries
        this.evictOldest();
        try {
          window.localStorage.setItem(`cache:${scopedKey}`, JSON.stringify(entry));
        } catch (e2) {
          console.warn('LocalStorage full, using memory only', e2);
        }
      }

      this.updateStats();
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Get cache value
   */
  get<T>(key: string, scope?: string): T | null {
    try {
      // Try memory first
      const entry = this.localStorage.get(key);

      if (entry && !this.isExpired(entry)) {
        this.stats.hits++;
        this.updateStats();
        return entry.data as T;
      }

      // Try browser localStorage
      const scopedKey = scope ? `${scope}:${key}` : key;
      const stored = window.localStorage.getItem(`cache:${scopedKey}`);

      if (stored) {
        try {
          const entry = JSON.parse(stored) as CacheEntry<T>;
          if (!this.isExpired(entry)) {
            // Restore to memory
            this.localStorage.set(key, entry);
            this.stats.hits++;
            this.updateStats();
            return entry.data;
          }
        } catch (e) {
          // Invalid cache entry
        }
      }

      this.stats.misses++;
      this.updateStats();
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string, scope?: string): boolean {
    try {
      this.localStorage.delete(key);

      const scopedKey = scope ? `${scope}:${key}` : key;
      window.localStorage.removeItem(`cache:${scopedKey}`);

      this.updateStats();
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Delete entries matching pattern (e.g., 'books:*')
   */
  deletePattern(pattern: string, scope?: string): number {
    try {
      let deleted = 0;
      const regex = this.patternToRegex(pattern);

      // Delete from memory
      for (const [key] of this.localStorage) {
        if (regex.test(key)) {
          this.localStorage.delete(key);
          deleted++;
        }
      }

      // Delete from localStorage
      const keys = Object.keys(window.localStorage);
      for (const key of keys) {
        if (key.startsWith('cache:')) {
          const cacheKey = key.replace('cache:', '');
          const unscoped = scope ? cacheKey.replace(`${scope}:`, '') : cacheKey;
          if (regex.test(unscoped)) {
            window.localStorage.removeItem(key);
            deleted++;
          }
        }
      }

      this.updateStats();
      return deleted;
    } catch (error) {
      console.error('Cache deletePattern error:', error);
      return 0;
    }
  }

  /**
   * Clear all cache
   */
  clear(scope?: string): void {
    try {
      if (scope) {
        // Clear scope-specific
        for (const key of this.localStorage.keys()) {
          const entry = this.localStorage.get(key);
          if (entry?.scope === scope) {
            this.localStorage.delete(key);
          }
        }

        // Clear from localStorage
        const keys = Object.keys(window.localStorage);
        for (const key of keys) {
          if (key.startsWith(`cache:${scope}:`)) {
            window.localStorage.removeItem(key);
          }
        }
      } else {
        // Clear all
        this.localStorage.clear();
        const keys = Object.keys(window.localStorage);
        for (const key of keys) {
          if (key.startsWith('cache:')) {
            window.localStorage.removeItem(key);
          }
        }
      }

      this.stats = { hits: 0, misses: 0, hitRate: 0, size: 0, itemCount: 0 };
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Get or set value
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlMs: number = 5 * 60 * 1000,
    scope?: string
  ): Promise<T> {
    // Try cache first
    const cached = this.get<T>(key, scope);
    if (cached !== null) {
      return cached;
    }

    // Fetch and cache
    const data = await fetchFn();
    this.set(key, data, ttlMs, scope);
    return data;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0,
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      size: 0,
      itemCount: 0,
    };
  }

  /**
   * Start automatic cleanup
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);
  }

  /**
   * Stop cleanup
   */
  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Clean expired entries
   */
  private cleanup(): void {
    try {
      let removed = 0;

      // Clean memory
      for (const [key, entry] of this.localStorage) {
        if (this.isExpired(entry)) {
          this.localStorage.delete(key);
          removed++;
        }
      }

      // Clean localStorage
      const keys = Object.keys(window.localStorage);
      for (const key of keys) {
        if (key.startsWith('cache:')) {
          const stored = window.localStorage.getItem(key);
          if (stored) {
            try {
              const entry = JSON.parse(stored) as CacheEntry<any>;
              if (this.isExpired(entry)) {
                window.localStorage.removeItem(key);
                removed++;
              }
            } catch (e) {
              // Invalid entry, remove
              window.localStorage.removeItem(key);
            }
          }
        }
      }

      if (removed > 0) {
        this.updateStats();
      }
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }

  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Convert glob pattern to regex
   */
  private patternToRegex(pattern: string): RegExp {
    const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    const regex = escaped.replace(/\\\*/g, '.*');
    return new RegExp(`^${regex}$`);
  }

  /**
   * Evict oldest entry
   */
  private evictOldest(): void {
    let oldest: [string, CacheEntry<any>] | null = null;

    for (const entry of this.localStorage) {
      if (!oldest || entry[1].timestamp < oldest[1].timestamp) {
        oldest = entry;
      }
    }

    if (oldest) {
      this.localStorage.delete(oldest[0]);
    }
  }

  /**
   * Update cache statistics
   */
  private updateStats(): void {
    let size = 0;
    for (const entry of this.localStorage.values()) {
      size += JSON.stringify(entry).length;
    }
    this.stats.size = size;
    this.stats.itemCount = this.localStorage.size;
  }
}

// Singleton instance
let instance: CacheManager | null = null;

export const getCacheManager = (): CacheManager => {
  if (!instance) {
    instance = new CacheManager();
  }
  return instance;
};

export type { CacheEntry, CacheStats };
