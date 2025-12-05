const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../schemas/User');
const Profile = require('../schemas/Profile');
const Waitlist = require('../schemas/Waitlist');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'saadhanaboard_secret_key';
const N8N_WEBHOOK_URL = 'https://sadhanaboard.app.n8n.cloud/webhook/waitlist';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

class AuthService {
  // Register a new user
  static async register(email, password, displayName) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email }).select('_id').lean();

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        displayName
      });
      await user.save();

      // Create profile
      const profile = new Profile({
        userId: user._id,
        displayName
      });
      await profile.save();

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      return { user: userResponse, token };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Login user
  static async login(email, password) {
    try {
      // Find user (need password field for verification)
      const user = await User.findOne({ email }).select('email password displayName _id');

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      // Return user without password
      return { 
        user: { 
          _id: user._id, 
          email: user.email, 
          displayName: user.displayName 
        }, 
        token 
      };
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
      const user = await User.findById(userId).select('email displayName createdAt').lean();

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Join waiting list - Modified to send data to n8n webhook
  static async joinWaitlist(name, email, reason) {
    try {
      // Try to check if email already exists in waitlist (if database is available)
      try {
        const existingEntry = await Waitlist.findOne({ email });

        if (existingEntry) {
          throw new Error('This email is already on the waiting list');
        }
      } catch (dbError) {
        // If database check fails, log the error but continue
        console.warn('Database check for existing waitlist entry failed:', dbError.message);
        // Don't throw error here, continue with the process
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
        
        // Return a success response even if database storage fails
        return {
          id: Date.now(), // Generate a temporary ID
          name: name,
          email: email,
          reason: reason || null,
          created_at: new Date().toISOString()
        };
      } catch (webhookError) {
        const errorMessage = webhookError.response ? 
          `Webhook error ${webhookError.response.status}: ${webhookError.response.data}` : 
          webhookError.message;
          
        console.error('Failed to send waitlist data to n8n webhook:', errorMessage);
        
        // If webhook fails, we still want to try database storage
        // Continue with database storage as fallback
      }

      // Try to store in database as backup/fallback
      try {
        const waitlistEntry = new Waitlist({
          name,
          email,
          reason: reason || null
        });
        const result = await waitlistEntry.save();

        return result.toJSON();
      } catch (dbError) {
        // If database storage also fails, log the error but don't fail the request
        console.warn('Database storage for waitlist entry failed:', dbError.message);
        // Return a basic success response
        return {
          id: Date.now(), // Generate a temporary ID
          name: name,
          email: email,
          reason: reason || null,
          created_at: new Date().toISOString()
        };
      }
    } catch (error) {
      // Only throw error for validation issues or other critical errors
      if (error.message.includes('already on the waiting list')) {
        throw error;
      }
      // For other errors, log and return a basic success response
      console.error('Unexpected error in joinWaitlist:', error.message);
      return {
        id: Date.now(), // Generate a temporary ID
        name: name,
        email: email,
        reason: reason || null,
        created_at: new Date().toISOString()
      };
    }
  }
}

module.exports = AuthService;