const fs = require('fs');
const path = require('path');

/**
 * Simple logger utility for the application
 */

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Get current log level from environment or default to INFO
const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL] || LOG_LEVELS.INFO;

class Logger {
  constructor() {
    this.logFile = path.join(logsDir, 'app.log');
  }

  _writeLog(level, message, meta = null) {
    // Check if we should log this level
    if (LOG_LEVELS[level] > currentLogLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message
    };

    // Add metadata if provided
    if (meta) {
      logEntry.meta = meta;
    }

    // Format the log entry
    const logString = JSON.stringify(logEntry);

    // Write to console
    console.log(logString);

    // Write to file (async to avoid blocking)
    fs.appendFile(this.logFile, logString + '\n', (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });
  }

  error(message, meta = null) {
    this._writeLog('ERROR', message, meta);
  }

  warn(message, meta = null) {
    this._writeLog('WARN', message, meta);
  }

  info(message, meta = null) {
    this._writeLog('INFO', message, meta);
  }

  debug(message, meta = null) {
    this._writeLog('DEBUG', message, meta);
  }
}

module.exports = new Logger();