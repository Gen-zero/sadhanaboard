/**
 * Cache Service
 * 
 * Provides in-memory and Redis caching for frequently accessed data
 * Improves query performance by caching frequently accessed records
 * 
 * Usage:
 *   const cached = await cacheService.get('key');
 *   await cacheService.set('key', data, 3600); // 1 hour TTL
 *   await cacheService.delete('key');
 */

const redis = require('redis');

class CacheService {
  constructor() {
    this.inMemoryCache = new Map();
    this.redisClient = null;
    this.useRedis = false;
    this.ttlDefault = 3600; // 1 hour default
  }

  /**
   * Initialize Redis connection (optional)
   * If Redis is not available, falls back to in-memory cache
   */
  async initialize() {
    try {
      if (process.env.REDIS_URL) {
        this.redisClient = redis.createClient({
          url: process.env.REDIS_URL,
          socket: {
            reconnectStrategy: (retries) => Math.min(retries * 50, 500),
            connectTimeout: 5000
          }
        });

        this.redisClient.on('error', (err) => {
          console.warn('Redis Error - Falling back to in-memory cache:', err.message);
          this.useRedis = false;
        });

        this.redisClient.on('connect', () => {
          console.log('✅ Redis cache connected');
          this.useRedis = true;
        });

        await this.redisClient.connect();
      } else {
        console.log('⚠️  Redis not configured - Using in-memory cache');
        this.useRedis = false;
      }
    } catch (error) {
      console.warn('Redis initialization failed - Using in-memory cache:', error.message);
      this.useRedis = false;
    }
  }

  /**
   * Generate cache key with namespace
   * @param {String} namespace - Cache namespace
   * @param {String} key - Cache key
   * @returns {String} Full cache key
   */
  generateKey(namespace, key) {
    return `${namespace}:${key}`;
  }

  /**
   * Get value from cache
   * @param {String} key - Cache key
   * @returns {Promise<Any>} Cached value or null
   */
  async get(key) {
    try {
      // Try Redis first
      if (this.useRedis && this.redisClient) {
        const redisValue = await this.redisClient.get(key);
        if (redisValue) {
          try {
            return JSON.parse(redisValue);
          } catch {
            return redisValue;
          }
        }
      }

      // Fall back to in-memory cache
      if (this.inMemoryCache.has(key)) {
        const cached = this.inMemoryCache.get(key);
        
        // Check if expired
        if (cached.expiresAt && cached.expiresAt < Date.now()) {
          this.inMemoryCache.delete(key);
          return null;
        }

        return cached.value;
      }

      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set value in cache
   * @param {String} key - Cache key
   * @param {Any} value - Value to cache
   * @param {Number} ttl - Time-to-live in seconds (default: 1 hour)
   */
  async set(key, value, ttl = this.ttlDefault) {
    try {
      // Store in Redis if available
      if (this.useRedis && this.redisClient) {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        await this.redisClient.setEx(key, ttl, serialized);
      }

      // Also store in in-memory cache
      this.inMemoryCache.set(key, {
        value,
        expiresAt: Date.now() + (ttl * 1000)
      });

      // Cleanup very old entries from in-memory cache
      if (this.inMemoryCache.size > 1000) {
        this.cleanupOldEntries();
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete value from cache
   * @param {String} key - Cache key
   */
  async delete(key) {
    try {
      // Delete from Redis
      if (this.useRedis && this.redisClient) {
        await this.redisClient.del(key);
      }

      // Delete from in-memory cache
      this.inMemoryCache.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Clear cache by pattern (Redis only)
   * @param {String} pattern - Key pattern (e.g., 'user:*')
   */
  async deletePattern(pattern) {
    try {
      if (this.useRedis && this.redisClient) {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length > 0) {
          await this.redisClient.del(keys);
        }
      }

      // Clear in-memory cache matching pattern
      const regex = new RegExp(pattern.replace('*', '.*'));
      for (const key of this.inMemoryCache.keys()) {
        if (regex.test(key)) {
          this.inMemoryCache.delete(key);
        }
      }
    } catch (error) {
      console.error('Cache pattern delete error:', error);
    }
  }

  /**
   * Clear all cache
   */
  async clear() {
    try {
      if (this.useRedis && this.redisClient) {
        await this.redisClient.flushDb();
      }
      this.inMemoryCache.clear();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  async getStats() {
    const stats = {
      backend: this.useRedis ? 'Redis' : 'In-Memory',
      inMemorySize: this.inMemoryCache.size,
      redisInfo: null
    };

    if (this.useRedis && this.redisClient) {
      try {
        const info = await this.redisClient.info('memory');
        stats.redisInfo = info;
      } catch (error) {
        console.warn('Unable to get Redis info:', error.message);
      }
    }

    return stats;
  }

  /**
   * Clean up expired entries from in-memory cache
   * (Called automatically when cache size exceeds 1000 entries)
   */
  cleanupOldEntries() {
    const now = Date.now();
    let deleted = 0;

    for (const [key, cached] of this.inMemoryCache.entries()) {
      if (cached.expiresAt && cached.expiresAt < now) {
        this.inMemoryCache.delete(key);
        deleted++;
      }
    }

    console.log(`🧹 Cache cleanup: removed ${deleted} expired entries`);
  }

  /**
   * Get or set pattern: get from cache or execute function and cache result
   * @param {String} key - Cache key
   * @param {Function} fn - Async function to execute if cache miss
   * @param {Number} ttl - Time-to-live in seconds
   * @returns {Promise<Any>} Cached or freshly fetched value
   */
  async getOrSet(key, fn, ttl = this.ttlDefault) {
    try {
      // Try to get from cache
      const cached = await this.get(key);
      if (cached !== null) {
        return cached;
      }

      // Cache miss - execute function
      const value = await fn();

      // Cache the result
      if (value !== null && value !== undefined) {
        await this.set(key, value, ttl);
      }

      return value;
    } catch (error) {
      console.error('GetOrSet error:', error);
      // Return null but don't throw
      return null;
    }
  }

  /**
   * Disconnect from Redis (if using Redis)
   */
  async disconnect() {
    if (this.useRedis && this.redisClient) {
      try {
        await this.redisClient.disconnect();
        console.log('🔌 Redis disconnected');
      } catch (error) {
        console.error('Error disconnecting from Redis:', error);
      }
    }
  }
}

// Export singleton instance
module.exports = new CacheService();
