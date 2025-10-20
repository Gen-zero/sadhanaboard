require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const adminAssetsRoutes = require('./routes/adminAssets');
const adminThemesRoutes = require('./routes/adminThemes');
const adminTemplatesRoutes = require('./routes/adminTemplates');
const adminSettingsReportsRoutes = require('./routes/adminSettingsReports');
const profileRoutes = require('./routes/profile');
const settingsRoutes = require('./routes/settings');
const bookRoutes = require('./routes/books');
const sadhanaRoutes = require('./routes/sadhanas');
const adminCommunityRoutes = require('./routes/adminCommunity');
const biReportsRoutes = require('./routes/biReports');
const { adminAuthenticate } = require('./middleware/adminAuth');
const { setupAdminTables, setupAdminLogsAndSecurity } = require('./utils/adminSetup');
const metricsMiddleware = require('./middleware/metricsMiddleware');
const adminSystemRoutes = require('./routes/adminSystem');
const systemAlertService = require('./services/systemAlertService');

// Validate critical env vars early
if (!process.env.JWT_SECRET) {
  console.error('[FATAL] JWT_SECRET not set in backend/.env');
  throw new Error('Missing JWT_SECRET');
}

// Warn if admin credentials are left as defaults to catch misconfiguration early
const _adminUser = process.env.ADMIN_USERNAME || 'admin';
const _adminPass = process.env.ADMIN_PASSWORD || 'password';
if (_adminUser === 'admin' && _adminPass === 'password') {
  console.warn('[WARN] Using default ADMIN credentials. Set ADMIN_USERNAME and ADMIN_PASSWORD in backend/.env');
}

// Initialize admin panel and admin logs/security schema on startup
setupAdminTables().catch(console.error);
setupAdminLogsAndSecurity().catch(console.error);

// ensure server-side EventEmitter for SSE fallback
if (!global.logBus) {
  const { EventEmitter } = require('events');
  global.logBus = new EventEmitter();
}

const app = express();
const PORT = process.env.PORT || 3004; // Changed from 3002 to 3004

// Socket.IO integration
const { Server: IOServer } = require('socket.io');
const socketAuth = require('./middleware/socketAuth');
const dashboardStatsService = require('./services/dashboardStatsService');
const biReportService = require('./services/biReportService');
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: true, credentials: true },
  allowEIO3: true
});

// Set the io instance in systemAlertService
systemAlertService.setIoInstance(io);

// Use socket middleware for auth
io.use((socket, next) => socketAuth(socket, next));

// Shared updater for all admin sockets to reduce DB load
io.on('connection', async (socket) => {
  try {
    console.log(`Socket connected: admin=${socket.user && socket.user.username}`);
    // join admins room
    socket.join('admins');
    // Emit initial stats to this socket only
    const stats = await dashboardStatsService.getAllDashboardStats();
    socket.emit('dashboard:stats:init', stats);

    // community:subscribe handlers
    socket.on('community:subscribe', (params) => {
      socket.join('community:stream');
    });
    socket.on('community:unsubscribe', () => {
      socket.leave('community:stream');
    });

    // BI subscriptions
    socket.on('bi:subscribe', (params) => {
      if (params && params.rooms) {
        params.rooms.forEach(r => socket.join(r));
      } else {
        socket.join('bi-kpis');
      }
    });
    socket.on('bi:unsubscribe', () => { socket.leave('bi-kpis'); socket.leave('bi-executions'); socket.leave('bi-insights'); });

    // System monitoring subscriptions
    socket.on('system:subscribe', (params) => {
      if (params && params.rooms) {
        params.rooms.forEach(r => socket.join(r));
      } else {
        socket.join('system-metrics');
        socket.join('system-alerts');
      }
    });
    socket.on('system:unsubscribe', () => { 
      socket.leave('system-metrics'); 
      socket.leave('system-alerts'); 
    });

    // User management subscriptions
    socket.on('users:subscribe', () => {
      socket.join('users-stream');
    });
    
    // Library management subscriptions
    socket.on('library:subscribe', () => {
      socket.join('library-stream');
    });

    socket.on('disconnect', () => {
      socket.leave('admins');
      socket.leave('users-stream');
      socket.leave('library-stream');
      console.log('Socket disconnected');
    });
  } catch (e) {
    console.error('Socket connection error:', e);
  }
});

// Shared interval emits to 'admins' room. Controlled by DASHBOARD_POLL_MS env var to avoid per-socket timers.
const POLL_MS = Number(process.env.DASHBOARD_POLL_MS) || 15000;
if (POLL_MS > 0) {
  setInterval(async () => {
    try {
      const updated = await dashboardStatsService.getAllDashboardStats();
      io.to('admins').emit('dashboard:stats:update', updated);
    } catch (e) {
      console.error('Failed to emit dashboard update:', e);
    }
  }, POLL_MS);
}

// BI KPI emitter: configurable cadence via BI_POLL_MS (ms). Emits to 'bi-kpis' room.
const BI_POLL_MS = Number(process.env.BI_POLL_MS) || 20000;
let __bi_poll_interval = null;
if (BI_POLL_MS > 0) {
  __bi_poll_interval = setInterval(async () => {
    try {
      const snapshot = await biReportService.getKPISnapshot();
      if (snapshot && global && global.__ADMIN_IO__) {
        global.__ADMIN_IO__.to('bi-kpis').emit('bi:kpi-update', snapshot);
      } else {
        io.to('bi-kpis').emit('bi:kpi-update', snapshot);
      }
    } catch (e) {
      console.error('Failed to emit BI KPIs:', e);
    }
  }, BI_POLL_MS);
}

// System metrics emitter: emits to 'system-metrics' room every 5 seconds
const SYSTEM_METRICS_POLL_MS = Number(process.env.SYSTEM_METRICS_POLL_MS) || 5000;
let __system_metrics_interval = null;
if (SYSTEM_METRICS_POLL_MS > 0) {
  __system_metrics_interval = setInterval(async () => {
    try {
      const metricsService = require('./services/systemMetricsService');
      const metrics = await metricsService.collectSystemMetrics();
      io.to('system-metrics').emit('system:metrics', metrics);
    } catch (e) {
      console.error('Failed to emit system metrics:', e);
    }
  }, SYSTEM_METRICS_POLL_MS);
}

// cleanup on shutdown
process.on('SIGINT', () => {
  try { 
    if (__bi_poll_interval) clearInterval(__bi_poll_interval); 
    if (__system_metrics_interval) clearInterval(__system_metrics_interval);
  } catch (e) {}
  process.exit(0);
});

// Middleware
// Compression to reduce response sizes for large exports
try { app.use(require('compression')()); } catch (e) { /* best-effort if not installed */ }

// Security headers (helmet) and CORS configuration for frontend origin
  try {
    const helmet = require('helmet');
    // include 8081 as a fallback dev origin (vite may auto-select a different free port)
    const rawOrigin = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:8080,http://localhost:5173,http://localhost:8081';
    const allowedOrigins = String(rawOrigin).split(',').map(s => s.trim()).filter(Boolean);
    const connectSrc = ["'self'", ...allowedOrigins];
    
    // Enhanced CSP for production with fallback for development
    const isProduction = process.env.NODE_ENV === 'production';
    const cspDirectives = {
      defaultSrc: ["'self'"],
      connectSrc: connectSrc,
      // Allow loading images from any source for flexibility
      imgSrc: ["'self'", 'data:', 'https:'],
      // Allow styles from self and inline styles (needed for dynamic themes)
      styleSrc: ["'self'", "'unsafe-inline'"],
      // Allow scripts from self
      scriptSrc: ["'self'"],
      // Allow fonts from self and data URIs
      fontSrc: ["'self'", 'data:', 'https:'],
    };
    
    app.use(helmet({
      contentSecurityPolicy: {
        directives: cspDirectives
      }
    }));
  } catch (e) { /* best-effort */ }

// Build CORS origins list: support single origin or comma-separated list
const rawOrigin = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:8080,http://localhost:5173';
const allowedOrigins = Array.isArray(rawOrigin) ? rawOrigin : String(rawOrigin).split(',').map(s => s.trim()).filter(Boolean);
const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin like curl or server-to-server
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf('*') >= 0 || allowedOrigins.indexOf(origin) >= 0) return callback(null, true);
    const msg = `CORS policy: origin ${origin} not allowed`;
    console.warn(msg);
    return callback(new Error(msg), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie', 'X-Admin-Debug-Origin', 'X-Admin-Debug-CORS-Allow'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-Requested-By'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS']
};

app.use((req, res, next) => {
  // Simple debug logging for admin endpoints
  if (req.path && req.path.startsWith('/api/admin')) {
    const origin = req.headers.origin || null;
    console.log('[ADMIN_REQ]', req.method, req.path, 'from', origin || req.ip, 'headers=', JSON.stringify({ 'x-forwarded-for': req.headers['x-forwarded-for'] }));
    // add debug headers for troubleshooting in dev
    try {
      res.setHeader('X-Admin-Debug-Origin', origin || 'none');
      res.setHeader('X-Admin-Debug-CORS-Allow', allowedOrigins.join(','));
    } catch (e) { /* ignore header set errors */ }
  }
  // Do not short-circuit OPTIONS here: let the `cors` middleware add the proper headers.
  next();
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Add metrics middleware before other routes
app.use(metricsMiddleware());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads/tmp and uploads/cms directories exist before multer writes
try {
  fs.mkdirSync(path.join(__dirname, 'uploads', 'tmp'), { recursive: true });
  fs.mkdirSync(path.join(__dirname, 'uploads', 'cms'), { recursive: true });
} catch (e) {
  console.error('Failed to create uploads directories', e);
}

// Add this after the other requires at the top
const { swaggerUi, specs } = require('./swagger');
const adminBackupsRoutes = require('./routes/adminBackups');
const adminSystemMonitoringRoutes = require('./routes/adminSystemMonitoring');
const googleSheetsRoutes = require('./routes/googleSheets');
const csvExportRoutes = require('./routes/csvExport');

// Add this before the routes section
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Mount admin auth routes (login, register) - these should not require authentication
app.use('/api/admin', require('./routes/adminAuth'));

// Mount other admin routes that require authentication
app.use('/api/admin', adminAuthenticate, adminBackupsRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminAuthenticate, adminRoutes);
app.use('/api/admin/assets', adminAssetsRoutes);
app.use('/api/admin/themes', adminThemesRoutes);
app.use('/api/admin/templates', adminTemplatesRoutes);
const cmsRoutes = require('./routes/cms');
app.use('/api/admin/cms', cmsRoutes);
const adminSettingsRoutes = require('./routes/adminSettings');
app.use('/api/admin/settings', adminSettingsRoutes);
const adminLogsRoutes = require('./routes/adminLogs');
app.use('/api/admin/logs', adminLogsRoutes);
app.use('/api/admin/community', adminAuthenticate, adminCommunityRoutes);
// Mount BI routes under admin
app.use('/api/admin/bi-reports', adminAuthenticate, biReportsRoutes);
// Mount system monitoring routes
app.use('/api/admin/system', adminSystemRoutes);
app.use('/api/admin', adminSystemMonitoringRoutes);
app.use('/api/admin', adminSettingsReportsRoutes);
// Mount Google Sheets routes
app.use('/api/admin/google-sheets', googleSheetsRoutes);
// Mount CSV export routes
app.use('/api/admin/csv-export', csvExportRoutes);

// expose io globally for services to emit log/alert events (used by alertService)
global.__ADMIN_IO__ = io;

// Socket.IO: log streaming and security alert channels
io.on('connection', async (socket) => {
  try {
    // log subscription events handled by socketAuth middleware earlier
    socket.on('logs:subscribe', (filters) => {
      socket.join('logs-stream');
      // optionally apply filters per-socket stored in socket.data
      socket.data.logFilters = filters || {};
    });
    socket.on('logs:unsubscribe', () => {
      socket.leave('logs-stream');
    });
    socket.on('logs:filter', (filters) => { socket.data.logFilters = filters; });
    socket.on('disconnect', () => {});
  } catch (e) { console.error('socket logs handler error', e); }
});

app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/sadhanas', sadhanaRoutes);
const groupsRoutes = require('./routes/groups');
app.use('/api/groups', groupsRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const deploymentService = require('./services/deploymentService');
    const health = await deploymentService.getHealthCheckStatus();
    res.json(health);
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Health check failed',
      error: error.message 
    });
  }
});

// Error handling middleware
const { errorHandler } = require('./middleware/errorHandler');

// Use the error handling middleware (should be last middleware)
app.use(errorHandler);

// Start server with retry on EADDRINUSE to avoid hard crash when port is occupied
let currentPort = Number(PORT) || 3004;
let listenAttempts = 0;
const MAX_LISTEN_ATTEMPTS = 5;

function tryListen(port) {
  server.once('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && listenAttempts < MAX_LISTEN_ATTEMPTS) {
      console.warn(`Port ${port} in use, trying port ${port + 1}...`);
      listenAttempts += 1;
      currentPort = port + 1;
      // small delay before retry
      setTimeout(() => tryListen(currentPort), 300);
    } else {
      console.error('Server failed to start:', err);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // initialize scheduled reminder jobs after server is up
    try {
      const reminderService = require('./services/reminderService');
      if (reminderService && typeof reminderService.initializeScheduledJobs === 'function') {
        reminderService.initializeScheduledJobs().then((r) => {
          console.log('Reminder scheduler initialized:', r && r.scheduled);
        }).catch(() => {});
      }
    } catch (e) {
      // ignore if reminderService not available
    }
  });
}

tryListen(currentPort);