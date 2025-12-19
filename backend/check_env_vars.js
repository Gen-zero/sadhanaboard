require('dotenv').config({ path: '.env.development' });

console.log('Checking environment variables...');
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL value:', process.env.DATABASE_URL);
console.log('SUPABASE_URL present:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_URL value:', process.env.SUPABASE_URL);

// Check if there's any other database-related environment variable
for (const key in process.env) {
  if (key.toUpperCase().includes('DATABASE') || key.toUpperCase().includes('SUPABASE')) {
    console.log(`${key}: ${process.env[key]}`);
  }
}