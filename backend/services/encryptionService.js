/**
 * Encryption Service
 * Handles field-level encryption/decryption for sensitive data
 */

const crypto = require('crypto');

class EncryptionService {
  constructor(options = {}) {
    // Master encryption key (should come from environment)
    this.masterKey = options.masterKey || process.env.ENCRYPTION_KEY;

    if (!this.masterKey) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }

    // Ensure key is correct length (32 bytes for AES-256)
    if (this.masterKey.length !== 64) {
      // If hex string, should be 64 chars (32 bytes)
      this.masterKey = this.deriveKey(this.masterKey);
    }

    this.algorithm = 'aes-256-gcm';
    this.keyRotationInterval = options.keyRotationInterval || 90 * 24 * 60 * 60 * 1000; // 90 days
    this.encryptedFields = options.encryptedFields || [];
  }

  /**
   * Derive encryption key from master key
   */
  deriveKey(masterKey) {
    return crypto
      .createHash('sha256')
      .update(masterKey)
      .digest()
      .toString('hex');
  }

  /**
   * Encrypt a value
   * Returns: encryptedData:iv:authTag format
   */
  encrypt(plaintext) {
    if (!plaintext) {
      return null;
    }

    try {
      // Generate random IV (Initialization Vector)
      const iv = crypto.randomBytes(16);

      // Create cipher
      const cipher = crypto.createCipheriv(
        this.algorithm,
        Buffer.from(this.masterKey, 'hex'),
        iv
      );

      // Encrypt data
      let encrypted = cipher.update(String(plaintext), 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Get authentication tag
      const authTag = cipher.getAuthTag();

      // Format: encryptedData:iv:authTag
      const combined = `${encrypted}:${iv.toString('hex')}:${authTag.toString('hex')}`;

      return combined;
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt a value
   * Input: encryptedData:iv:authTag format
   */
  decrypt(encryptedData) {
    if (!encryptedData) {
      return null;
    }

    try {
      // Parse encrypted data
      const parts = encryptedData.split(':');

      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const [encrypted, iv, authTag] = parts;

      // Create decipher
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.masterKey, 'hex'),
        Buffer.from(iv, 'hex')
      );

      // Set auth tag
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));

      // Decrypt data
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Encrypt object fields
   */
  encryptObject(obj, fieldsToEncrypt) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const encrypted = { ...obj };

    for (const field of fieldsToEncrypt) {
      if (field in encrypted && encrypted[field]) {
        encrypted[field] = this.encrypt(encrypted[field]);
        encrypted[`${field}_encrypted`] = true; // Mark as encrypted
      }
    }

    return encrypted;
  }

  /**
   * Decrypt object fields
   */
  decryptObject(obj, fieldsToDecrypt) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const decrypted = { ...obj };

    for (const field of fieldsToDecrypt) {
      if (field in decrypted && decrypted[field] && decrypted[`${field}_encrypted`]) {
        decrypted[field] = this.decrypt(decrypted[field]);
        delete decrypted[`${field}_encrypted`];
      }
    }

    return decrypted;
  }

  /**
   * Hash a value (one-way, for passwords)
   * Should use bcrypt, not this method
   */
  hash(value) {
    return crypto
      .createHash('sha256')
      .update(value)
      .digest('hex');
  }

  /**
   * Generate encryption key
   */
  static generateKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Get key metadata
   */
  getKeyMetadata() {
    return {
      algorithm: this.algorithm,
      keySize: 256, // bits
      rotationInterval: this.keyRotationInterval,
      lastRotated: new Date(),
    };
  }

  /**
   * Validate encryption key
   */
  static validateKey(key) {
    if (!key) return false;
    if (typeof key !== 'string') return false;
    if (key.length !== 64) return false; // 32 bytes in hex = 64 chars

    // Check if valid hex
    return /^[0-9a-f]{64}$/i.test(key);
  }
}

/**
 * Password Hashing Service
 */
class PasswordService {
  constructor(options = {}) {
    this.saltRounds = options.saltRounds || 12;
    this.bcrypt = require('bcrypt');
  }

  /**
   * Hash password
   */
  async hashPassword(password) {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    try {
      const salt = await this.bcrypt.genSalt(this.saltRounds);
      return await this.bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }

  /**
   * Verify password
   */
  async verifyPassword(password, hashedPassword) {
    try {
      return await this.bcrypt.compare(password, hashedPassword);
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password) {
    const issues = [];

    if (!password || password.length < 8) {
      issues.push('At least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      issues.push('At least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      issues.push('At least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      issues.push('At least one digit');
    }

    if (!/[!@#$%^&*]/.test(password)) {
      issues.push('At least one special character (!@#$%^&*)');
    }

    return {
      isStrong: issues.length === 0,
      issues,
      strength: Math.max(0, 100 - issues.length * 20),
    };
  }

  /**
   * Generate secure random password
   */
  generateSecurePassword(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
  }
}

/**
 * Data Masking Service
 */
class DataMaskingService {
  /**
   * Mask email (show first 3 chars and domain)
   */
  static maskEmail(email) {
    if (!email || !email.includes('@')) {
      return email;
    }

    const [local, domain] = email.split('@');

    if (local.length <= 3) {
      return `${local}@${domain}`;
    }

    return `${local.substring(0, 3)}***@${domain}`;
  }

  /**
   * Mask phone number (show last 4 digits)
   */
  static maskPhone(phone) {
    if (!phone || phone.length < 4) {
      return phone;
    }

    const last4 = phone.slice(-4);
    return `***-***-${last4}`;
  }

  /**
   * Mask name (show first and last initial)
   */
  static maskName(name) {
    if (!name) {
      return name;
    }

    const parts = name.split(' ');

    if (parts.length === 1) {
      return `${parts[0].charAt(0)}***`;
    }

    return `${parts[0].charAt(0)}*** ${parts[parts.length - 1].charAt(0)}***`;
  }

  /**
   * Mask credit card (show last 4 digits)
   */
  static maskCreditCard(card) {
    if (!card || card.length < 4) {
      return card;
    }

    return `****-****-****-${card.slice(-4)}`;
  }

  /**
   * Mask SSN (show last 4 digits)
   */
  static maskSSN(ssn) {
    if (!ssn || ssn.length < 4) {
      return ssn;
    }

    return `***-**-${ssn.slice(-4)}`;
  }

  /**
   * Redact sensitive fields from object
   */
  static redactSensitiveFields(obj, fieldsToRedact = []) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const redacted = { ...obj };

    for (const field of fieldsToRedact) {
      if (field in redacted) {
        redacted[field] = '[REDACTED]';
      }
    }

    return redacted;
  }

  /**
   * Get safe user data (with masking)
   */
  static getSafeUserData(user) {
    return {
      id: user.id,
      display_name: user.display_name,
      email: this.maskEmail(user.email),
      phone: user.phone ? this.maskPhone(user.phone) : null,
      avatar: user.avatar,
      role: user.role,
      created_at: user.created_at,
    };
  }
}

/**
 * Singleton instances
 */
let encryptionService = null;
let passwordService = null;
let dataMaskingService = null;

function getEncryptionService(options) {
  if (!encryptionService) {
    encryptionService = new EncryptionService(options);
  }
  return encryptionService;
}

function getPasswordService(options) {
  if (!passwordService) {
    passwordService = new PasswordService(options);
  }
  return passwordService;
}

function getDataMaskingService() {
  return DataMaskingService;
}

module.exports = {
  EncryptionService,
  PasswordService,
  DataMaskingService,
  getEncryptionService,
  getPasswordService,
  getDataMaskingService,
};
