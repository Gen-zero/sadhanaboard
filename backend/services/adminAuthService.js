const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Missing required environment variable JWT_SECRET for adminAuthService');
}
const TOKEN_EXPIRES_IN = process.env.ADMIN_TOKEN_EXPIRES_IN || '7d';

const adminAuthService = {
  async register({ username, email, password, role, created_by = null }) {
    const existing = await Admin.findByUsername(username);
    if (existing) throw new Error('username_taken');
    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, email, password_hash: hash, role, created_by });
    return admin;
  },

  async login({ usernameOrEmail, password }) {
    if (!usernameOrEmail || typeof usernameOrEmail !== 'string' || !password || typeof password !== 'string') {
      throw new Error('invalid_credentials');
    }
    const identifier = usernameOrEmail.trim();
    try {
      let admin = null;
      if (identifier.includes('@')) {
        admin = await Admin.findByEmail(identifier.toLowerCase());
      } else {
        admin = await Admin.findByUsername(identifier);
      }
      if (!admin) throw new Error('invalid_credentials');
      if (!admin.active) throw new Error('account_inactive');
      // check locked_until
      if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
        const remainingMinutes = Math.ceil((new Date(admin.locked_until) - new Date()) / 60000);
        const err = new Error('account_locked');
        err.details = { locked_until: admin.locked_until, remaining_minutes: remainingMinutes };
        throw err;
      }
      let ok = false;
      try {
        ok = await bcrypt.compare(password, admin.password_hash);
      } catch (e) {
        console.error('bcrypt.compare failed', e && e.message ? e.message : e);
        // treat as invalid credentials but do not leak details
        await Admin.incrementLoginAttempts(admin.id).catch(() => {});
        throw new Error('invalid_credentials');
      }
      if (!ok) {
        await Admin.incrementLoginAttempts(admin.id).catch(() => {});
        throw new Error('invalid_credentials');
      }
      await Admin.updateLastLogin(admin.id).catch(() => {});
      // standardized token payload
      const payload = { userId: admin.id, username: admin.username, role: admin.role, admin: true };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
      return { token, admin };
    } catch (err) {
      // rethrow known errors, otherwise wrap
      if (['invalid_credentials', 'account_inactive', 'account_locked'].includes(err.message)) throw err;
      console.error('adminAuthService.login error', err && err.message ? err.message : err);
      throw new Error('server_error');
    }
  },

  verifyToken(token) {
    try {
      if (!token || typeof token !== 'string') throw new Error('invalid_token');
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded || !decoded.admin || !decoded.userId) throw new Error('invalid_token');
      return decoded;
    } catch (err) {
      // pass through known JWT errors as a consistent message
      throw new Error('invalid_token');
    }
  },

  async getAdminById(id) {
    return Admin.findById(id);
  },
  async getAdminByUsername(username) {
    try {
      return await Admin.findByUsername(username);
    } catch (err) {
      console.error('getAdminByUsername error', err);
      return null;
    }
  }
  ,

  // return account status without attempting authentication
  async getAccountStatus(identifier) {
    try {
      let admin = null;
      if (!identifier) return null;
      if (identifier.includes('@')) admin = await Admin.findByEmail(identifier.toLowerCase());
      else admin = await Admin.findByUsername(identifier);
      if (!admin) return null;
      return {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        active: admin.active,
        login_attempts: admin.login_attempts,
        locked_until: admin.locked_until,
        is_locked: admin.isLocked ? admin.isLocked() : (admin.locked_until && new Date(admin.locked_until) > new Date()),
        remaining_minutes: admin.getRemainingLockTime ? admin.getRemainingLockTime() : 0,
        last_login: admin.last_login,
      };
    } catch (err) {
      console.error('getAccountStatus error', err && err.message ? err.message : err);
      return null;
    }
  },

  // unlock an account (admin tool)
  async unlockAccount(identifier) {
    try {
      let admin = null;
      if (!identifier) throw new Error('invalid_identifier');
      if (identifier.includes('@')) admin = await Admin.findByEmail(identifier.toLowerCase());
      else admin = await Admin.findByUsername(identifier);
      if (!admin) throw new Error('not_found');
      const updated = await Admin.unlockAccount(admin.id);
      return updated;
    } catch (err) {
      console.error('unlockAccount error', err && err.message ? err.message : err);
      throw err;
    }
  },
};

module.exports = adminAuthService;
