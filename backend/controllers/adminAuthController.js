const adminAuthService = require('../services/adminAuthService');
const { setAdminCookie } = require('../middleware/adminAuth');
const ValidationMiddleware = require('../middleware/validationMiddleware');
const os = require('os');

const register = async (req, res) => {
  try {
    // Validate inputs
    const { username, email, password } = req.body;
    
    // Check if required fields are present
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'missing_required_fields' });
    }
    
    // Sanitize inputs
    const sanitizedUsername = String(username).trim();
    const sanitizedEmail = String(email).trim().toLowerCase();
    const sanitizedPassword = String(password).trim();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({ error: 'invalid_email_format' });
    }
    
    // Validate password length
    if (sanitizedPassword.length < 6) {
      return res.status(400).json({ error: 'password_too_short' });
    }
    
    const admin = await adminAuthService.register({ 
      username: sanitizedUsername, 
      email: sanitizedEmail, 
      password: sanitizedPassword, 
      created_by: req.user ? req.user.id : null 
    });
    res.status(201).json({ admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role } });
  } catch (err) {
    if (err.message === 'username_taken') return res.status(409).json({ error: 'username_taken' });
    console.error('Admin registration error:', err);
    res.status(500).json({ error: 'server_error', details: err.message });
  }
};

const login = async (req, res) => {
  try {
    // Validate inputs
    const { usernameOrEmail, password } = req.body;
    
    // Check if required fields are present
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'missing_required_fields' });
    }
    
    // Sanitize inputs
    const sanitizedUsernameOrEmail = String(usernameOrEmail).trim();
    const sanitizedPassword = String(password).trim();
    
    // Validate input length
    if (sanitizedUsernameOrEmail.length < 1 || sanitizedUsernameOrEmail.length > 100) {
      return res.status(400).json({ error: 'invalid_username_or_email_length' });
    }
    
    if (sanitizedPassword.length < 1 || sanitizedPassword.length > 100) {
      return res.status(400).json({ error: 'invalid_password_length' });
    }
    
    const debug = { 
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection && req.connection.remoteAddress, 
      ua: req.headers['user-agent'] || null, 
      ts: new Date().toISOString() 
    };
    console.log('[ADMIN LOGIN] attempt:', { usernameOrEmail: sanitizedUsernameOrEmail, ...debug });
    const { token, admin } = await adminAuthService.login({ usernameOrEmail: sanitizedUsernameOrEmail, password: sanitizedPassword });
    // set cookie for legacy admin cookie-based auth
    try { setAdminCookie(res, token); } catch (e) { /* best-effort */ }
    // respond with token and admin info
    console.log('[ADMIN LOGIN] success:', { id: admin.id, username: admin.username });
    return res.json({ 
      message: 'Login successful', 
      token, 
      admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role } 
    });
  } catch (err) {
    console.warn('[ADMIN LOGIN] failure:', err && err.message ? err.message : err);
    if (['invalid_credentials', 'account_inactive', 'account_locked'].includes(err.message)) {
      // if account_locked include details about remaining time if available
      if (err.message === 'account_locked' && err.details) {
        return res.status(401).json({ error: err.message, details: err.details });
      }
      return res.status(401).json({ error: err.message });
    }
    // Don't expose internal errors to the client
    res.status(500).json({ error: 'server_error' });
  }
};

// authenticated route to check account status for a username/email
const accountStatus = async (req, res) => {
  try {
    // Validate and sanitize input
    let identifier = req.query.username || req.query.email || (req.body && req.body.username) || null;
    
    if (!identifier) {
      return res.status(400).json({ error: 'missing_identifier' });
    }
    
    // Sanitize identifier
    identifier = String(identifier).trim();
    
    // Validate identifier length
    if (identifier.length < 1 || identifier.length > 100) {
      return res.status(400).json({ error: 'invalid_identifier_length' });
    }
    
    const info = await adminAuthService.getAccountStatus(identifier);
    if (!info) return res.status(404).json({ error: 'not_found' });
    return res.json({ account: info });
  } catch (e) {
    console.error('accountStatus error:', e);
    // Don't expose internal errors to the client
    return res.status(500).json({ error: 'server_error' });
  }
};

module.exports = {
  register,
  login,
  accountStatus,
};