require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '***' : 'NOT SET');

// Test the connection string parsing
const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || 
  `${process.env.SUPABASE_URL}/postgres`.replace('https://', 'postgresql://postgres:');
  
console.log('Parsed connection string:', connectionString);