/**
 * Jest Test Setup for Backend
 * Handles MongoDB connection and environment setup
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';
process.env.PORT = process.env.PORT || 3004;

// Suppress console logs in tests
const originalLog = console.log;
const originalError = console.error;

beforeAll(async () => {
  // Keep error logs visible during tests
  console.log = jest.fn(originalLog);
  
  // Load all models by requiring the index file
  // Models will be registered with Mongoose but won't connect to DB in tests
  require('../models');
  
  // Mock MongoDB connection for tests that don't require actual database operations
  jest.mock('../config/mongodb', () => ({
    connectMongoDB: jest.fn().mockResolvedValue({}),
    disconnectMongoDB: jest.fn().mockResolvedValue(),
    getConnectionTestResult: jest.fn().mockResolvedValue({ success: true, method: 'mock' }),
    mongoose: require('mongoose')
  }));
});

afterAll(() => {
  console.log = originalLog;
  console.error = originalError;
});

// Global test timeout
jest.setTimeout(30000);
