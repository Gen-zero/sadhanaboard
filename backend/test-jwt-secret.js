/**
 * Test JWT Secret Configuration
 * Verifies that the JWT_SECRET is consistent between generation and verification
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'saadhanaboard_secret_key';

console.log('=== JWT Secret Configuration Test ===\n');
console.log(`JWT_SECRET from .env: "${JWT_SECRET}"`);
console.log(`JWT_SECRET length: ${JWT_SECRET.length} characters`);
console.log(`JWT_SECRET type: ${typeof JWT_SECRET}`);

// Create a test token
const payload = {
  userId: '507f1f77bcf86cd799439011',
  test: 'This is a test token'
};

console.log('\n--- Creating Test Token ---');
const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: '7d',
});

console.log(`Token created: ${token.substring(0, 100)}...`);

// Decode to see structure
const parts = token.split('.');
console.log(`\nToken Structure:`);
console.log(`  Header (${parts[0].length} chars): ${parts[0]}`);
console.log(`  Payload (${parts[1].length} chars): ${parts[1]}`);
console.log(`  Signature (${parts[2].length} chars): ${parts[2]}`);

// Try to verify the token
console.log('\n--- Verifying Test Token ---');
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log(`✓ Token verified successfully!`);
  console.log(`  Decoded payload:`, decoded);
} catch (error) {
  console.error(`✗ Token verification failed!`);
  console.error(`  Error name: ${error.name}`);
  console.error(`  Error message: ${error.message}`);
  console.error(`  Full error:`, error);
}

// Test with wrong secret
console.log('\n--- Testing with Wrong Secret ---');
const wrongSecret = 'wrong_secret_key';
try {
  const decoded = jwt.verify(token, wrongSecret);
  console.log(`Token verified (unexpected!)`);
} catch (error) {
  console.log(`✓ Correctly rejected with wrong secret`);
  console.log(`  Error: ${error.message}`);
}

// Test token expiration
console.log('\n--- Testing Token Expiration ---');
const expiredToken = jwt.sign(payload, JWT_SECRET, {
  expiresIn: '0s', // Expire immediately
});

setTimeout(() => {
  try {
    jwt.verify(expiredToken, JWT_SECRET);
  } catch (error) {
    console.log(`✓ Correctly detected expired token`);
    console.log(`  Error: ${error.message}`);
  }
}, 100);

console.log('\n=== Test Complete ===');
