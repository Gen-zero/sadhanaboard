/**
 * JWT Validation Middleware
 * Validates JWT tokens in requests
 */

const { getTokenService } = require('../services/tokenService');

const tokenService = getTokenService();

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
function extractToken(authHeader) {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Middleware to validate JWT token
 * Requires token in Authorization header: "Bearer <token>"
 */
function validateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
        code: 'NO_TOKEN',
      });
    }

    // Verify token
    const decoded = tokenService.verifyAccessToken(token);

    // Attach to request
    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    let statusCode = 401;
    let message = 'Invalid token';
    let code = 'INVALID_TOKEN';

    if (error.message === 'Token expired') {
      statusCode = 401;
      message = 'Token expired';
      code = 'TOKEN_EXPIRED';
    } else if (error.message === 'Invalid token') {
      statusCode = 401;
      message = 'Invalid token';
      code = 'INVALID_TOKEN';
    }

    return res.status(statusCode).json({
      error: 'Unauthorized',
      message,
      code,
    });
  }
}

/**
 * Middleware to require specific role
 * @param {string|string[]} allowedRoles - Role or array of roles
 */
function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token validation required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
        requiredRole: roles,
        userRole: req.user.role,
      });
    }

    next();
  };
}

/**
 * Middleware to make token optional
 * Validates if provided, but doesn't require it
 */
function validateTokenOptional(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (token) {
      const decoded = tokenService.verifyAccessToken(token);
      req.user = decoded;
      req.token = token;
    }

    next();
  } catch (error) {
    // Token invalid but optional - just skip
    next();
  }
}

/**
 * Middleware to check token refresh requirement
 * Sends warning if token is expiring soon
 */
function checkTokenExpiry(req, res, next) {
  if (req.token) {
    const tokenInfo = tokenService.getTokenInfo(req.token);
    if (tokenInfo) {
      const warningThreshold = 5 * 60 * 1000; // 5 minutes
      if (tokenInfo.expiresIn < warningThreshold && tokenInfo.expiresIn > 0) {
        res.set('X-Token-Expiring-Soon', 'true');
        res.set('X-Token-Expires-In', tokenInfo.expiresIn.toString());
      }
    }
  }

  next();
}

/**
 * Middleware for routes that accept either token or API key
 */
function validateTokenOrApiKey(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const apiKey = req.headers['x-api-key'];

    if (!authHeader && !apiKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing authentication credentials',
      });
    }

    // Try token first
    if (authHeader) {
      const token = extractToken(authHeader);
      if (token) {
        try {
          const decoded = tokenService.verifyAccessToken(token);
          req.user = decoded;
          req.authMethod = 'token';
          return next();
        } catch {
          // Fall through to check API key
        }
      }
    }

    // Try API key (would be validated by separate service)
    if (apiKey) {
      // TODO: Implement API key validation
      req.apiKey = apiKey;
      req.authMethod = 'apiKey';
      return next();
    }

    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid credentials',
    });
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication failed',
    });
  }
}

/**
 * Middleware to attach token info to response
 */
function attachTokenInfo(req, res, next) {
  if (req.token) {
    const tokenInfo = tokenService.getTokenInfo(req.token);
    res.set('X-Token-Info', JSON.stringify({
      expiresAt: tokenInfo.expiresAt.toISOString(),
      expiresIn: tokenInfo.expiresIn,
    }));
  }

  next();
}

module.exports = {
  validateToken,
  requireRole,
  validateTokenOptional,
  checkTokenExpiry,
  validateTokenOrApiKey,
  attachTokenInfo,
  extractToken,
};
