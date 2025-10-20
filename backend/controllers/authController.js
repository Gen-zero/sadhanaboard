const AuthService = require('../services/authService');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and registration
 */

class AuthController {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - displayName
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's email address
   *               password:
   *                 type: string
   *                 format: password
   *                 description: User's password
   *               displayName:
   *                 type: string
   *                 description: User's display name
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: Bad request
   *       500:
   *         description: Server error
   */
  // User registration
  static async register(req, res) {
    try {
      const { email, password, displayName } = req.body;

      if (!email || !password || !displayName) {
        return res.status(400).json({ error: 'Email, password, and display name are required' });
      }

      const { user, token } = await AuthService.register(email, password, displayName);

      res.status(201).json({
        message: 'User registered successfully',
        user,
        token
      });
    } catch (error) {
      console.error('AuthController.register error:', error);
      res.status(400).json({ error: error.message || 'Registration failed', details: error.stack || null });
    }
  }

  /**
   * @swagger
   * /auth/waitlist:
   *   post:
   *     summary: Join the waitlist
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *             properties:
   *               name:
   *                 type: string
   *                 description: User's name
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's email address
   *               reason:
   *                 type: string
   *                 description: Reason for joining
   *     responses:
   *       201:
   *         description: Successfully joined the waiting list
   *       400:
   *         description: Bad request
   *       500:
   *         description: Server error
   */
  // Join waiting list
  static async joinWaitlist(req, res) {
    try {
      const { name, email, reason } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const waitlistEntry = await AuthService.joinWaitlist(name, email, reason);

      res.status(201).json({
        message: 'Successfully joined the waiting list! We will contact you soon.',
        waitlistEntry
      });
    } catch (error) {
      console.error('AuthController.joinWaitlist error:', error);
      res.status(400).json({ error: error.message || 'Failed to join waitlist', details: error.stack || null });
    }
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: User login
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's email address
   *               password:
   *                 type: string
   *                 format: password
   *                 description: User's password
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: Bad request
   *       401:
   *         description: Authentication failed
   *       500:
   *         description: Server error
   */
  // User login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const { user, token } = await AuthService.login(email, password);

      res.json({
        message: 'Login successful',
        user,
        token
      });
    } catch (error) {
      console.error('AuthController.login error:', error);
      res.status(401).json({ error: error.message || 'Authentication failed', details: error.stack || null });
    }
  }

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     summary: Get current user
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  // Get current user
  static async getCurrentUser(req, res) {
    try {
      res.json({
        user: req.user
      });
    } catch (error) {
      console.error('AuthController.getCurrentUser error:', error);
      res.status(500).json({ error: error.message || 'Failed to get current user', details: error.stack || null });
    }
  }
}

module.exports = AuthController;