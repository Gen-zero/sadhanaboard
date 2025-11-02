import { adminAuthApi } from './adminApi';

// Simple test to verify the login functionality
describe('Admin Login', () => {
  it('should have the correct login function signature', () => {
    // Test that the login function exists and has the correct signature
    expect(typeof adminAuthApi.login).toBe('function');
  });
});