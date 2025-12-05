/**
 * Rate Limiting Service
 * Token bucket algorithm for API rate limiting
 */

class RateLimiter {
  constructor(options = {}) {
    this.limits = options.limits || this.getDefaultLimits();
    this.store = new Map(); // In production: use Redis
    this.cleanup = options.cleanup || true;
    this.cleanupInterval = options.cleanupInterval || 60000; // 1 minute

    if (this.cleanup) {
      setInterval(() => this.cleanupExpired(), this.cleanupInterval);
    }
  }

  /**
   * Default rate limits by role
   */
  getDefaultLimits() {
    return {
      public: {
        window: 60, // 1 minute
        max: 100, // 100 requests per minute
      },
      guest: {
        window: 60,
        max: 300,
      },
      user: {
        window: 60,
        max: 1000,
      },
      mentor: {
        window: 60,
        max: 2000,
      },
      admin: {
        window: 60,
        max: 5000,
      },
      superadmin: {
        window: 60,
        max: 10000,
      },
    };
  }

  /**
   * Check if request is allowed
   * Returns: { allowed: boolean, remaining: number, resetTime: timestamp }
   */
  isAllowed(key, role = 'public', weight = 1) {
    const limit = this.limits[role] || this.limits.public;
    const now = Date.now();
    const windowMs = limit.window * 1000;

    // Get or create bucket
    let bucket = this.store.get(key);

    if (!bucket) {
      bucket = {
        tokens: limit.max,
        lastRefill: now,
        requests: 0,
        firstRequest: now,
        requestLog: [],
      };
      this.store.set(key, bucket);
    }

    // Refill tokens based on time elapsed
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = (timePassed / windowMs) * limit.max;

    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(limit.max, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }

    // Check if request is allowed
    const allowed = bucket.tokens >= weight;

    if (allowed) {
      bucket.tokens -= weight;
      bucket.requests += 1;
      bucket.requestLog.push(now);

      // Keep only recent requests
      bucket.requestLog = bucket.requestLog.filter(t => t > now - windowMs);
    }

    const resetTime = bucket.firstRequest + windowMs;
    const remaining = Math.floor(bucket.tokens);

    return {
      allowed,
      limit: limit.max,
      remaining: Math.max(0, remaining),
      resetTime,
      retryAfter: allowed ? null : Math.ceil((weight - bucket.tokens) / (limit.max / windowMs)),
    };
  }

  /**
   * Get current rate limit status
   */
  getStatus(key) {
    const bucket = this.store.get(key);
    if (!bucket) {
      return null;
    }

    return {
      tokens: Math.floor(bucket.tokens),
      requests: bucket.requests,
      firstRequest: bucket.firstRequest,
      lastRefill: bucket.lastRefill,
      requestsInWindow: bucket.requestLog.length,
    };
  }

  /**
   * Reset rate limit for key
   */
  reset(key) {
    this.store.delete(key);
  }

  /**
   * Reset all rate limits
   */
  resetAll() {
    this.store.clear();
  }

  /**
   * Cleanup expired buckets
   */
  cleanupExpired() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [key, bucket] of this.store.entries()) {
      if (now - bucket.lastRefill > maxAge) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    const stats = {
      activeKeys: this.store.size,
      byteSize: JSON.stringify([...this.store]).length,
      buckets: Array.from(this.store.entries()).map(([key, bucket]) => ({
        key: key.substring(0, 20) + '...', // Masked
        tokens: Math.floor(bucket.tokens),
        requests: bucket.requests,
        requestsInWindow: bucket.requestLog.length,
      })),
    };

    return stats;
  }

  /**
   * Set custom limit for key
   */
  setCustomLimit(key, max, window) {
    let bucket = this.store.get(key);
    if (!bucket) {
      bucket = {
        tokens: max,
        lastRefill: Date.now(),
        requests: 0,
        firstRequest: Date.now(),
        requestLog: [],
      };
    }
    bucket.customLimit = { max, window };
    this.store.set(key, bucket);
  }
}

/**
 * IP-based rate limiter for DDoS protection
 */
class IPRateLimiter {
  constructor(options = {}) {
    this.store = new Map();
    this.blacklist = new Set(options.blacklist || []);
    this.whitelist = new Set(options.whitelist || []);
    this.thresholds = options.thresholds || {
      requests: 1000, // Max requests
      window: 60, // Per minute
      suspiciousThreshold: 500, // Suspicious activity threshold
    };
    this.suspiciousIPs = new Map();
    this.cleanup = options.cleanup || true;

    if (this.cleanup) {
      setInterval(() => this.cleanupExpired(), 60000);
    }
  }

  /**
   * Check if IP is rate limited
   */
  isLimited(ip) {
    // Check whitelist
    if (this.whitelist.has(ip)) {
      return { limited: false, reason: null };
    }

    // Check blacklist
    if (this.blacklist.has(ip)) {
      return { limited: true, reason: 'blacklisted' };
    }

    const now = Date.now();
    const windowMs = this.thresholds.window * 1000;

    let record = this.store.get(ip);

    if (!record) {
      record = {
        requests: [],
        firstRequest: now,
        suspicious: false,
      };
      this.store.set(ip, record);
    }

    // Remove old requests
    record.requests = record.requests.filter(t => t > now - windowMs);

    // Check if rate limited
    if (record.requests.length >= this.thresholds.requests) {
      record.suspicious = true;
      return {
        limited: true,
        reason: 'rate_limit_exceeded',
        requestCount: record.requests.length,
        window: this.thresholds.window,
      };
    }

    // Check for suspicious activity
    if (record.requests.length >= this.thresholds.suspiciousThreshold) {
      record.suspicious = true;
      this.suspiciousIPs.set(ip, {
        firstSuspicious: this.suspiciousIPs.get(ip)?.firstSuspicious || now,
        lastSuspicious: now,
        count: (this.suspiciousIPs.get(ip)?.count || 0) + 1,
      });
    }

    record.requests.push(now);

    return { limited: false, reason: null };
  }

  /**
   * Add IP to blacklist
   */
  blacklistIP(ip) {
    this.blacklist.add(ip);
  }

  /**
   * Remove IP from blacklist
   */
  unblacklistIP(ip) {
    this.blacklist.delete(ip);
  }

  /**
   * Add IP to whitelist
   */
  whitelistIP(ip) {
    this.whitelist.add(ip);
  }

  /**
   * Get suspicious IPs
   */
  getSuspiciousIPs() {
    return Array.from(this.suspiciousIPs.entries()).map(([ip, data]) => ({
      ip,
      ...data,
    }));
  }

  /**
   * Cleanup expired records
   */
  cleanupExpired() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [ip, record] of this.store.entries()) {
      if (now - record.firstRequest > maxAge) {
        this.store.delete(ip);
      }
    }

    // Clean up suspicious IPs older than 1 day
    for (const [ip, data] of this.suspiciousIPs.entries()) {
      if (now - data.lastSuspicious > maxAge) {
        this.suspiciousIPs.delete(ip);
      }
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      trackedIPs: this.store.size,
      blacklistedIPs: this.blacklist.size,
      whitelistedIPs: this.whitelist.size,
      suspiciousIPs: this.suspiciousIPs.size,
    };
  }
}

/**
 * Singleton instances
 */
let rateLimiter = null;
let ipRateLimiter = null;

function getRateLimiter(options) {
  if (!rateLimiter) {
    rateLimiter = new RateLimiter(options);
  }
  return rateLimiter;
}

function getIPRateLimiter(options) {
  if (!ipRateLimiter) {
    ipRateLimiter = new IPRateLimiter(options);
  }
  return ipRateLimiter;
}

module.exports = {
  RateLimiter,
  IPRateLimiter,
  getRateLimiter,
  getIPRateLimiter,
};
