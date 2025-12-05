require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');

// Import middleware
const { errorHandler, catchAsync } = require('./middleware/errorHandler');
const { authenticate } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const sadhanaRoutes = require('./routes/sadhanas');
const groupRoutes = require('./routes/groups');
const profileRoutes = require('./routes/profile');
const bookReadingRoutes = require('./routes/bookReading');
const settingsRoutes = require('./routes/settings');
const cmsRoutes = require('./routes/cms');
const biReportsRoutes = require('./routes/biReports');
const csvExportRoutes = require('./routes/csvExport');
const googleSheetsRoutes = require('./routes/googleSheets');

// Import database
const { connectMongoDB } = require('./config/mongodb');

// Import logger
const logger = require('./utils/logger');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configuration
const PORT = process.env.PORT || 3004;
const NODE_ENV = process.env.NODE_ENV || 'development';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

// Determine CORS origins based on environment
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : ['http://localhost:5173', 'http://localhost:8080'];

// Socket.io configuration
const io = socketIo(server, {
  cors: {
    origin: corsOrigins,
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Initialize middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  connectSrc: ["'self'", ...corsOrigins, 'https://mongodb.net', 'wss://mongodb.net'],
      frameSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

app.use(compression());

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
    backendUrl: BACKEND_URL
  });
});

// Database health check endpoint
app.get('/api/health/db', catchAsync(async (req, res) => {
  try {
    const { getConnectionTestResult } = require('./config/mongodb');
    const connectionTest = await getConnectionTestResult();
    res.json({
      status: connectionTest.success ? 'connected' : 'disconnected',
      method: connectionTest.method,
      error: connectionTest.error || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/sadhanas', sadhanaRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/profile', authenticate, profileRoutes);
app.use('/api/book-reading', bookReadingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/bi-reports', biReportsRoutes);
app.use('/api/csv-export', csvExportRoutes);
app.use('/api/google-sheets', googleSheetsRoutes);

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'SaadhanaBoard API',
    version: '1.0.0',
    backendUrl: BACKEND_URL,
    endpoints: {
      health: '/health',
      db_health: '/api/health/db',
      auth: '/api/auth',
      books: '/api/books',
      sadhanas: '/api/sadhanas',
      groups: '/api/groups',
      profile: '/api/profile',
      'book-reading': '/api/book-reading',
      settings: '/api/settings',
      cms: '/api/cms',
      'bi-reports': '/api/bi-reports',
      'csv-export': '/api/csv-export',
      'google-sheets': '/api/google-sheets'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use(errorHandler);

// Socket.io event handling
io.on('connection', (socket) => {
  logger.info('New socket connection', { socketId: socket.id });

  socket.on('disconnect', () => {
    logger.info('Socket disconnected', { socketId: socket.id });
  });

  socket.on('error', (error) => {
    logger.error('Socket error', { socketId: socket.id, error: error.message });
  });
});

// Export io for use in controllers/services
app.locals.io = io;

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    logger.info('Connecting to MongoDB...');
    await connectMongoDB();
    logger.info('MongoDB connected successfully');

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`, { environment: NODE_ENV, backendUrl: BACKEND_URL });
      console.log(`
╔════════════════════════════════════════╗
║   SaadhanaBoard Backend Server         ║
╠════════════════════════════════════════╣
║ Port:        ${PORT.toString().padEnd(30)}║
║ Environment: ${NODE_ENV.padEnd(30)}║
║ Backend URL: ${BACKEND_URL.padEnd(30)}║
║ Database:    MongoDB Atlas             ║
║ Status:      Running                   ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason: String(reason), promise: String(promise) });
  console.error('Unhandled Rejection:', reason);
});

// Start the server
startServer();

module.exports = { app, server, io };