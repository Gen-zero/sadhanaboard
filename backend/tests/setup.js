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

beforeAll(() => {
  // Keep error logs visible during tests
  console.log = jest.fn(originalLog);
});

afterAll(() => {
  console.log = originalLog;
  console.error = originalError;
});

// Global test timeout
jest.setTimeout(30000);
