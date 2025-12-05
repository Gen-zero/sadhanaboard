/**
 * Token Service
 * Handles JWT token generation, validation, and refresh
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class TokenService {
  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || 'dev-secret-key';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
    this.accessTokenExpiry = process.env.JWT_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
    this.refreshTokenStore = new Map(); // In production: use Redis/DB
  }

  /**
   * Generate access token
   * @param {Object} payload - Token payload
   * @returns {string} JWT access token
   */
  generateAccessToken(payload) {
    try {
      const token = jwt.sign(
        {
          ...payload,
          type: 'access',
          iat: Math.floor(Date.now() / 1000),
        },
        this.accessTokenSecret,
        {
          expiresIn: this.accessTokenExpiry,
          algorithm: 'HS256',
        }
      );

      return token;
    } catch (error) {
      throw new Error(`Failed to generate access token: ${error.message}`);
    }
  }

  /**
   * Generate refresh token
   * @param {Object} payload - Token payload
   * @returns {string} JWT refresh token
   */
  generateRefreshToken(payload) {
    try {
      const tokenId = crypto.randomBytes(16).toString('hex');
      const token = jwt.sign(
        {
          ...payload,
          type: 'refresh',
          tokenId,
          iat: Math.floor(Date.now() / 1000),
        },
        this.refreshTokenSecret,
        {
          expiresIn: this.refreshTokenExpiry,
          algorithm: 'HS256',
        }
      );

      // Store refresh token in memory store (production: use Redis)
      this.refreshTokenStore.set(tokenId, {
        userId: payload.id,
        createdAt: Date.now(),
        expiresAt: Date.now() + this.parseExpiry(this.refreshTokenExpiry),
      });

      return token;
    } catch (error) {
      throw new Error(`Failed to generate refresh token: ${error.message}`);
    }
  }

  /**
   * Generate both access and refresh tokens
   * @param {Object} payload - User data payload
   * @returns {Object} Object with accessToken and refreshToken
   */
  generateTokenPair(payload) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.parseExpiry(this.accessTokenExpiry) / 1000, // seconds
    };
  }

  /**
   * Verify access token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   * @throws {Error} If token is invalid
   */
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        algorithms: ['HS256'],
      });

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  /**
   * Verify refresh token
   * @param {string} token - JWT refresh token
   * @returns {Object} Decoded token payload
   * @throws {Error} If token is invalid or revoked
   */
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        algorithms: ['HS256'],
      });

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Check if refresh token is revoked (not in store)
      if (!this.refreshTokenStore.has(decoded.tokenId)) {
        throw new Error('Refresh token revoked');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Object} New token pair
   */
  refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);

      // Generate new token pair
      const newTokens = this.generateTokenPair({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      });

      // Rotate refresh token (revoke old one)
      this.refreshTokenStore.delete(decoded.tokenId);

      return newTokens;
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  }

  /**
   * Decode token without verification (for debugging)
   * @param {string} token - JWT token
   * @returns {Object} Decoded payload
   */
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      throw new Error('Failed to decode token');
    }
  }

  /**
   * Revoke refresh token
   * @param {string} token - Refresh token to revoke
   */
  revokeRefreshToken(token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.tokenId) {
        this.refreshTokenStore.delete(decoded.tokenId);
      }
    } catch (error) {
      // Ignore decode errors during revocation
    }
  }

  /**
   * Revoke all tokens for a user (logout from all devices)
   * @param {string} userId - User ID
   */
  revokeUserTokens(userId) {
    // Delete all refresh tokens for this user
    for (const [tokenId, tokenData] of this.refreshTokenStore.entries()) {
      if (tokenData.userId === userId) {
        this.refreshTokenStore.delete(tokenId);
      }
    }
  }

  /**
   * Parse expiry time string to milliseconds
   * @param {string} expiry - Expiry string (e.g., '15m', '7d', '1h')
   * @returns {number} Milliseconds
   */
  parseExpiry(expiry) {
    const units = {
      ms: 1,
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    const match = expiry.match(/^(\d+)([a-z]+)$/);
    if (!match) {
      throw new Error('Invalid expiry format');
    }

    const [, amount, unit] = match;
    return parseInt(amount) * (units[unit] || 1000);
  }

  /**
   * Get token information
   * @param {string} token - JWT token
   * @returns {Object} Token metadata
   */
  getTokenInfo(token) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded) {
        return null;
      }

      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - now;
      const isExpired = expiresIn < 0;

      return {
        payload: decoded,
        expiresAt: new Date(decoded.exp * 1000),
        expiresIn: Math.max(0, expiresIn),
        isExpired,
        issuedAt: new Date(decoded.iat * 1000),
        age: now - decoded.iat,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Clean up expired tokens from store
   */
  cleanupExpiredTokens() {
    const now = Date.now();
    let cleaned = 0;

    for (const [tokenId, tokenData] of this.refreshTokenStore.entries()) {
      if (tokenData.expiresAt < now) {
        this.refreshTokenStore.delete(tokenId);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Get token store statistics (for monitoring)
   * @returns {Object} Store statistics
   */
  getStoreStats() {
    return {
      totalTokens: this.refreshTokenStore.size,
      tokens: Array.from(this.refreshTokenStore.entries()).map(([id, data]) => ({
        id: id.substring(0, 8) + '...', // Masked
        userId: data.userId,
        createdAt: new Date(data.createdAt),
        expiresAt: new Date(data.expiresAt),
        isExpired: data.expiresAt < Date.now(),
      })),
    };
  }
}

/**
 * Create singleton instance
 */
let instance = null;

function getTokenService() {
  if (!instance) {
    instance = new TokenService();
  }
  return instance;
}

module.exports = {
  TokenService,
  getTokenService,
};
