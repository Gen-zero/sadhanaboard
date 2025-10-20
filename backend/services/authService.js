const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const axios = require('axios');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'saadhanaboard_secret_key';
const N8N_WEBHOOK_URL = 'https://sadhanaboard.app.n8n.cloud/webhook/waitlist';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

class AuthService {
  // Register a new user
  static async register(email, password, displayName) {
    try {
      // Check if user already exists
      const existingUser = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const result = await db.query(
        'INSERT INTO users (email, password, display_name) VALUES ($1, $2, $3) RETURNING id, email, display_name',
        [email, hashedPassword, displayName]
      );

      const user = result.rows[0];

      // Create profile
      await db.query(
        'INSERT INTO profiles (id, display_name) VALUES ($1, $2)',
        [user.id, displayName]
      );

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      return { user, token };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Login user
  static async login(email, password) {
    try {
      // Find user
      const result = await db.query(
        'SELECT id, email, display_name, password FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = result.rows[0];

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      // Remove password from response
      delete user.password;

      return { user, token };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Get user by ID
  static async getUserById(userId) {
    try {
      const result = await db.query(
        'SELECT id, email, display_name FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Join waiting list - Modified to send data to n8n webhook
  static async joinWaitlist(name, email, reason) {
    try {
      // Check if email already exists in waitlist
      const existingEntry = await db.query(
        'SELECT id FROM waitlist WHERE email = $1',
        [email]
      );

      if (existingEntry.rows.length > 0) {
        throw new Error('This email is already on the waiting list');
      }

      // Send data to n8n webhook
      try {
        const webhookData = {
          name: name,
          email: email,
          reason: reason || '',
          created_at: new Date().toISOString(),
          source: IS_PRODUCTION ? 'production' : 'development'
        };
        
        await axios.post(N8N_WEBHOOK_URL, webhookData, {
          timeout: 10000 // 10 second timeout
        });
        
        if (IS_PRODUCTION) {
          console.log(`Successfully sent waitlist data to n8n webhook for ${email}`);
        }
      } catch (webhookError) {
        const errorMessage = webhookError.response ? 
          `Webhook error ${webhookError.response.status}: ${webhookError.response.data}` : 
          webhookError.message;
          
        console.error('Failed to send waitlist data to n8n webhook:', errorMessage);
        
        // In production, we might want to queue this for retry or alert admins
        if (IS_PRODUCTION) {
          // Log the error but don't fail the request
          console.warn(`Webhook failed for ${email}, storing in database as fallback`);
        }
        // Continue with database storage as fallback
      }

      // Always store in database as backup/fallback
      const result = await db.query(
        'INSERT INTO waitlist (name, email, reason, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, name, email, reason, created_at',
        [name, email, reason || null]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to join waiting list: ${error.message}`);
    }
  }
}

module.exports = AuthService;