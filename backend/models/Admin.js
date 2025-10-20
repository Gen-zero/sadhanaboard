const db = require('../config/db');

class Admin {
  constructor({ id, username, email, password_hash, role, active, last_login, login_attempts, locked_until, created_at, updated_at }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.role = role;
    this.active = active;
    this.last_login = last_login;
    this.login_attempts = login_attempts || 0;
    this.locked_until = locked_until || null;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async findById(id) {
    try {
      if (!id) return null;
      const res = await db.query('SELECT * FROM admin_details WHERE id = $1', [id]);
      if (!res || res.rows.length === 0) return null;
      return new Admin(res.rows[0]);
    } catch (err) {
      console.error('Admin.findById error', err && err.message ? err.message : err);
      return null;
    }
  }

  static async findByUsername(username) {
    try {
      if (!username) return null;
      const res = await db.query('SELECT * FROM admin_details WHERE username = $1', [username]);
      if (!res || res.rows.length === 0) return null;
      return new Admin(res.rows[0]);
    } catch (err) {
      console.error('Admin.findByUsername error', err && err.message ? err.message : err);
      return null;
    }
  }

  static async findByEmail(email) {
    try {
      if (!email) return null;
      const res = await db.query('SELECT * FROM admin_details WHERE email = $1', [email]);
      if (!res || res.rows.length === 0) return null;
      return new Admin(res.rows[0]);
    } catch (err) {
      console.error('Admin.findByEmail error', err && err.message ? err.message : err);
      return null;
    }
  }

  static async create({ username, email, password_hash, role = 'admin', active = true, created_by = null }) {
    try {
      if (!username || !password_hash) throw new Error('invalid_input');
      const res = await db.query(
        `INSERT INTO admin_details (username, email, password_hash, role, active, created_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [username, email, password_hash, role, active, created_by]
      );
      if (!res || !res.rows || res.rows.length === 0) return null;
      return new Admin(res.rows[0]);
    } catch (err) {
      console.error('Admin.create error', err && err.message ? err.message : err);
      throw err;
    }
  }

  static async updateLastLogin(id) {
    try {
      await db.query('UPDATE admin_details SET last_login = now(), login_attempts = 0 WHERE id = $1', [id]);
    } catch (err) {
      console.error('Admin.updateLastLogin error', err && err.message ? err.message : err);
    }
  }

  static async incrementLoginAttempts(id) {
    try {
      const maxAttempts = process.env.ADMIN_MAX_LOGIN_ATTEMPTS ? Number(process.env.ADMIN_MAX_LOGIN_ATTEMPTS) : 5;
      const res = await db.query('UPDATE admin_details SET login_attempts = login_attempts + 1 WHERE id = $1 RETURNING login_attempts', [id]);
      const attempts = res && res.rows && res.rows[0] ? Number(res.rows[0].login_attempts) : 0;
      if (attempts >= maxAttempts) {
        // lock for 30 minutes by default
        const lockMinutes = process.env.ADMIN_LOCK_MINUTES ? Number(process.env.ADMIN_LOCK_MINUTES) : 30;
        const until = new Date(Date.now() + lockMinutes * 60 * 1000);
        await db.query('UPDATE admin_details SET locked_until = $2 WHERE id = $1', [id, until]);
        console.info(`Admin ${id} locked until ${until.toISOString()} after ${attempts} failed attempts`);
      }
    } catch (err) {
      console.error('Admin.incrementLoginAttempts error', err && err.message ? err.message : err);
    }
  }

  static async lockUntil(id, until) {
    try {
      await db.query('UPDATE admin_details SET locked_until = $2 WHERE id = $1', [id, until]);
    } catch (err) {
      console.error('Admin.lockUntil error', err && err.message ? err.message : err);
    }
  }

  // Unlock an account by id
  static async unlockAccount(id) {
    try {
      const res = await db.query('UPDATE admin_details SET locked_until = NULL, login_attempts = 0, updated_at = now() WHERE id = $1 RETURNING *', [id]);
      return res && res.rows && res.rows[0] ? new Admin(res.rows[0]) : null;
    } catch (err) {
      console.error('Admin.unlockAccount error', err && err.message ? err.message : err);
      return null;
    }
  }

  // instance helper: isLocked
  isLocked() {
    try {
      if (!this.locked_until) return false;
      return new Date(this.locked_until) > new Date();
    } catch (e) {
      return false;
    }
  }

  // instance helper: remaining lock time in minutes (rounded up)
  getRemainingLockTime() {
    try {
      if (!this.locked_until) return 0;
      const remMs = new Date(this.locked_until) - new Date();
      if (remMs <= 0) return 0;
      return Math.ceil(remMs / 60000);
    } catch (e) {
      return 0;
    }
  }

  // administrative bulk unlock
  static async unlockAllAccounts() {
    try {
      const res = await db.query('UPDATE admin_details SET locked_until = NULL, login_attempts = 0, updated_at = now() WHERE locked_until IS NOT NULL RETURNING id');
      return res && res.rows ? res.rows.map(r => r.id) : [];
    } catch (err) {
      console.error('Admin.unlockAllAccounts error', err && err.message ? err.message : err);
      return [];
    }
  }

  static async getLockedAccounts() {
    try {
      const res = await db.query('SELECT * FROM admin_details WHERE locked_until IS NOT NULL AND locked_until > now()');
      return res && res.rows ? res.rows.map(r => new Admin(r)) : [];
    } catch (err) {
      console.error('Admin.getLockedAccounts error', err && err.message ? err.message : err);
      return [];
    }
  }
}

module.exports = Admin;
