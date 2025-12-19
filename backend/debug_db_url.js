require('dotenv').config({ path: '.env.development' });
console.log('DATABASE_URL from env:', process.env.DATABASE_URL);