/**
 * Two-Factor Authentication Service
 * TOTP, recovery codes, and backup authentication methods
 */

const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

/**
 * 2FA Methods
 */
const TWO_FA_METHODS = {
  TOTP: 'totp', // Time-based one-time password
  SMS: 'sms', // SMS code
  EMAIL: 'email', // Email code
  BACKUP: 'backup', // Recovery codes
};

/**
 * Two-Factor Authentication Service
 */
class TwoFactorService {
  constructor(options = {}) {
    this.appName = options.appName || 'SadhanaBoard';
    this.window = options.window || 1; // Time window for TOTP verification (±1 step)
    this.codeLength = options.codeLength || 6;
    this.recoveryCodeCount = options.recoveryCodeCount || 10;
    this.recoveryCodeLength = options.recoveryCodeLength || 8;
    this.totpValidityWindow = options.totpValidityWindow || 30; // seconds
    this.codeExpiryTime = options.codeExpiryTime || 10 * 60 * 1000; // 10 minutes
  }

  /**
   * Generate TOTP secret
   */
  generateTotpSecret(userId, email) {
    const secret = speakeasy.generateSecret({
      name: `${this.appName} (${email})`,
      issuer: this.appName,
      length: 32,
    });

    return {
      secret: secret.base32,
      qrCode: secret.qr_code_url,
      manualEntryKey: secret.base32,
    };
  }

  /**
   * Generate QR code for TOTP
   */
  async generateQRCode(secret) {
    try {
      const qrCode = await QRCode.toDataURL(secret);
      return qrCode;
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }

  /**
   * Verify TOTP code
   */
  verifyTotpCode(secret, code) {
    try {
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: code,
        window: this.window,
      });

      return verified;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate recovery codes
   */
  generateRecoveryCodes(count = this.recoveryCodeCount) {
    const codes = [];

    for (let i = 0; i < count; i++) {
      const code = crypto
        .randomBytes(this.recoveryCodeLength / 2)
        .toString('hex')
        .toUpperCase();

      // Format as XXXX-XXXX
      const formatted = `${code.slice(0, 4)}-${code.slice(4)}`;
      codes.push(formatted);
    }

    return codes;
  }

  /**
   * Hash recovery code for storage
   */
  hashRecoveryCode(code) {
    return crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');
  }

  /**
   * Verify recovery code
   */
  verifyRecoveryCode(providedCode, hashedCode) {
    const hashedProvided = this.hashRecoveryCode(providedCode);
    return crypto.timingSafeEqual(
      Buffer.from(hashedProvided),
      Buffer.from(hashedCode)
    );
  }

  /**
   * Generate SMS/Email code
   */
  generateBackupCode() {
    return crypto
      .randomInt(100000, 999999)
      .toString()
      .padStart(6, '0');
  }

  /**
   * Create backup code with expiry
   */
  createBackupCodeWithExpiry(expiryMs = this.codeExpiryTime) {
    return {
      code: this.generateBackupCode(),
      expiresAt: new Date(Date.now() + expiryMs).toISOString(),
      used: false,
    };
  }

  /**
   * Enable 2FA for user
   */
  async enable2FA(userId, email, primaryMethod = TWO_FA_METHODS.TOTP) {
    const totpSecret = this.generateTotpSecret(userId, email);
    const recoveryCodes = this.generateRecoveryCodes();

    // Hash recovery codes for storage
    const hashedRecoveryCodes = recoveryCodes.map(code => ({
      code: this.hashRecoveryCode(code),
      used: false,
      usedAt: null,
    }));

    const qrCode = await this.generateQRCode(totpSecret.qrCode);

    return {
      secret: totpSecret.secret,
      qrCode,
      manualEntryKey: totpSecret.manualEntryKey,
      recoveryCodes,
      hashedRecoveryCodes,
      primaryMethod,
      backupMethods: [TWO_FA_METHODS.SMS, TWO_FA_METHODS.EMAIL],
      enabledAt: new Date().toISOString(),
    };
  }

  /**
   * Disable 2FA for user
   */
  async disable2FA(userId) {
    return {
      userId,
      disabledAt: new Date().toISOString(),
    };
  }

  /**
   * Verify 2FA code (any method)
   */
  async verify2FA(code, userSecret, method = TWO_FA_METHODS.TOTP) {
    if (method === TWO_FA_METHODS.TOTP) {
      return this.verifyTotpCode(userSecret, code);
    } else if (method === TWO_FA_METHODS.SMS || method === TWO_FA_METHODS.EMAIL) {
      // For SMS/Email, verify against stored code
      // This would compare with code sent to user
      return true; // Placeholder
    }

    return false;
  }

  /**
   * Use recovery code
   */
  useRecoveryCode(providedCode, storedCodes) {
    for (let i = 0; i < storedCodes.length; i++) {
      const stored = storedCodes[i];

      if (!stored.used) {
        try {
          if (this.verifyRecoveryCode(providedCode, stored.code)) {
            stored.used = true;
            stored.usedAt = new Date().toISOString();
            return { success: true, codesRemaining: storedCodes.filter(c => !c.used).length };
          }
        } catch (error) {
          // Continue to next code
        }
      }
    }

    return { success: false, codesRemaining: storedCodes.filter(c => !c.used).length };
  }

  /**
   * Get backup codes remaining
   */
  getBackupCodesRemaining(storedCodes) {
    return storedCodes.filter(c => !c.used).length;
  }

  /**
   * Generate device fingerprint
   */
  generateDeviceFingerprint(userAgent, ipAddress, acceptLanguage) {
    return crypto
      .createHash('sha256')
      .update(`${userAgent}:${ipAddress}:${acceptLanguage}`)
      .digest('hex');
  }

  /**
   * Validate code format
   */
  validateCodeFormat(code, method = TWO_FA_METHODS.TOTP) {
    if (method === TWO_FA_METHODS.TOTP) {
      // 6-digit code
      return /^\d{6}$/.test(code);
    } else if (method === TWO_FA_METHODS.BACKUP) {
      // XXXX-XXXX format
      return /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code);
    } else if (method === TWO_FA_METHODS.SMS || method === TWO_FA_METHODS.EMAIL) {
      // 6-digit code
      return /^\d{6}$/.test(code);
    }

    return false;
  }

  /**
   * Get 2FA status for user
   */
  async get2FAStatus(user2FAConfig) {
    if (!user2FAConfig) {
      return {
        enabled: false,
        method: null,
        backupCodes: 0,
      };
    }

    return {
      enabled: true,
      method: user2FAConfig.primaryMethod,
      backupCodeCount: user2FAConfig.recoveryCodes?.filter(c => !c.used).length || 0,
      enabledAt: user2FAConfig.enabledAt,
      backupMethods: user2FAConfig.backupMethods,
    };
  }

  /**
   * Regenerate recovery codes
   */
  regenerateRecoveryCodes(count = this.recoveryCodeCount) {
    const codes = this.generateRecoveryCodes(count);
    const hashedCodes = codes.map(code => ({
      code: this.hashRecoveryCode(code),
      used: false,
      usedAt: null,
    }));

    return {
      codes,
      hashedCodes,
      regeneratedAt: new Date().toISOString(),
    };
  }

  /**
   * Verify 2FA challenge
   */
  async verify2FAChallenge(code, user, challengeToken) {
    // Verify challenge token is valid
    if (!challengeToken) {
      return { success: false, error: 'No active 2FA challenge' };
    }

    // Verify code format
    if (!this.validateCodeFormat(code, user.twoFA.primaryMethod)) {
      return { success: false, error: 'Invalid code format' };
    }

    // Try TOTP first
    if (user.twoFA.primaryMethod === TWO_FA_METHODS.TOTP) {
      if (this.verifyTotpCode(user.twoFA.secret, code)) {
        return { success: true };
      }
    }

    // Try recovery code
    if (code.includes('-')) {
      const result = this.useRecoveryCode(code, user.twoFA.recoveryCodes);
      if (result.success) {
        return {
          success: true,
          usedRecoveryCode: true,
          codesRemaining: result.codesRemaining,
        };
      }
    }

    return { success: false, error: 'Invalid code' };
  }

  /**
   * Create 2FA setup session
   */
  async create2FASetupSession(userId) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const totpConfig = this.generateTotpSecret(userId, `user-${userId}`);

    return {
      sessionToken,
      secret: totpConfig.secret,
      manualEntryKey: totpConfig.manualEntryKey,
      qrCode: totpConfig.qrCode,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min expiry
    };
  }

  /**
   * Verify 2FA setup
   */
  async verify2FASetup(sessionToken, secret, code) {
    if (!this.validateCodeFormat(code, TWO_FA_METHODS.TOTP)) {
      return { success: false, error: 'Invalid code format' };
    }

    if (!this.verifyTotpCode(secret, code)) {
      return { success: false, error: 'Invalid code' };
    }

    // Generate recovery codes
    const recoveryCodes = this.generateRecoveryCodes();
    const hashedRecoveryCodes = recoveryCodes.map(code => ({
      code: this.hashRecoveryCode(code),
      used: false,
      usedAt: null,
    }));

    return {
      success: true,
      secret,
      recoveryCodes,
      hashedRecoveryCodes,
    };
  }
}

/**
 * Singleton instance
 */
let twoFactorService = null;

function getTwoFactorService(options) {
  if (!twoFactorService) {
    twoFactorService = new TwoFactorService(options);
  }
  return twoFactorService;
}

module.exports = {
  TwoFactorService,
  getTwoFactorService,
  TWO_FA_METHODS,
};
