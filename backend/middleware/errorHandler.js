const logger = require('../utils/logger');

/**
 * Error handling middleware
 * Provides consistent error responses and logging
 */

// Error classes for specific error types
class AppError extends Error {
  constructor(message, statusCode, errorCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database error occurred') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error with context
  logger.error('Unhandled error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user ? req.user.id : null
  });

  // Default error response
  let response = {
    success: false,
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  };

  // Add error code if available
  if (err.errorCode) {
    response.errorCode = err.errorCode;
  }

  // Add details if available
  if (err.details) {
    response.details = err.details;
  }

  // Set status code
  let statusCode = 500;

  // Handle specific error types
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    response.message = err.message;
    
    // Add error code if not already set
    if (!response.errorCode && err.errorCode) {
      response.errorCode = err.errorCode;
    }
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    response.message = 'Validation failed';
    response.errorCode = 'VALIDATION_ERROR';
    if (err.errors) {
      response.details = Object.keys(err.errors).map(key => ({
        field: key,
        message: err.errors[key].message
      }));
    }
  } else if (err.name === 'CastError') {
    statusCode = 400;
    response.message = 'Invalid data format';
    response.errorCode = 'INVALID_FORMAT';
  } else if (err.code === 11000) {
    statusCode = 409;
    response.message = 'Duplicate entry';
    response.errorCode = 'DUPLICATE_ENTRY';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    response.message = 'Invalid token';
    response.errorCode = 'INVALID_TOKEN';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    response.message = 'Token expired';
    response.errorCode = 'TOKEN_EXPIRED';
  }

  // Set the status code
  res.status(statusCode);

  // In development, include stack trace
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Send the response
  res.json(response);
};

// Async error wrapper for route handlers
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  errorHandler,
  catchAsync,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseError
};