// Comprehensive test to identify where the database URL is coming from
console.log('=== Environment Variables ===');
for (const key in process.env) {
  if (key.includes('DATABASE') || key.includes('DB')) {
    console.log(`${key}: ${process.env[key]}`);
  }
}

console.log('\n=== Process Environment ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PWD:', process.env.PWD);
console.log('__dirname:', __dirname);

// Load dotenv and check
console.log('\n=== Dotenv Loading ===');
const dotenv = require('dotenv');
const result = dotenv.config({ path: '.env.development' });
if (result.error) {
  console.log('Dotenv error:', result.error);
} else {
  console.log('Dotenv loaded successfully');
  console.log('DATABASE_URL from dotenv:', process.env.DATABASE_URL);
}

// Check if there's a .env file in the parent directory
console.log('\n=== Checking Parent Directory .env ===');
try {
  const parentResult = dotenv.config({ path: '../.env' });
  if (!parentResult.error) {
    console.log('Parent .env DATABASE_URL:', process.env.DATABASE_URL);
  }
} catch (e) {
  console.log('No parent .env file or error loading it');
}

// Try to load the db module and see what URL it's using
console.log('\n=== Database Module Test ===');
try {
  const db = require('./config/db');
  console.log('Database module loaded successfully');
} catch (e) {
  console.log('Error loading database module:', e.message);
}