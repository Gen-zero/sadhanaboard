const AuthService = require('../services/authService');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[AUTH] Missing or invalid Authorization header');
      console.warn('[AUTH] Headers received:', Object.keys(req.headers));
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log(`[AUTH] Token received: ${token.substring(0, 50)}...`);

    // Verify token
    const decoded = AuthService.verifyToken(token);
    console.log(`[AUTH] Token decoded successfully, userId: ${decoded.userId}`);
    
    // Get user
    const user = await AuthService.getUserById(decoded.userId);
    console.log(`[AUTH] User found: ${user.email}`);
    
    // Attach user to request with id field for consistency
    req.user = {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      ...user
    };
    
    next();
  } catch (error) {
    const message = error.message || 'Invalid or expired token';
    console.error('[AUTH] Authentication failed:', message);
    console.error('[AUTH] Error name:', error.name);
    console.error('[AUTH] Full error:', error);
    res.status(401).json({ error: message });
  }
};

module.exports = { authenticate };