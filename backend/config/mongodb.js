const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://subham4343_db_user:RsD0qysfLKGeX3GL@cluster1.mn2ty8w.mongodb.net/?appName=Cluster1';

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in environment variables');
  process.exit(1);
}

let cachedConnection = null;
const MAX_CONNECTION_RETRIES = 5;
const RETRY_DELAY_MS = 2000; // Start with 2 seconds

async function connectMongoDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  let lastError;
  for (let attempt = 1; attempt <= MAX_CONNECTION_RETRIES; attempt++) {
    try {
      console.log(`Attempting MongoDB connection (${attempt}/${MAX_CONNECTION_RETRIES})...`);
      const connection = await mongoose.connect(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        retryWrites: true,
        w: 'majority',
        appName: 'SaadhanaBoard',
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });

      cachedConnection = connection;
      console.log('✓ MongoDB connected successfully on attempt', attempt);
      return connection;
    } catch (error) {
      lastError = error;
      console.error(`✗ MongoDB connection attempt ${attempt} failed:`, error.message);
      
      // Don't retry on last attempt
      if (attempt < MAX_CONNECTION_RETRIES) {
        const waitTime = RETRY_DELAY_MS * attempt; // Exponential backoff
        console.log(`Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  console.error('✗ Failed to connect to MongoDB after', MAX_CONNECTION_RETRIES, 'attempts');
  throw lastError;
}

async function disconnectMongoDB() {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
    console.log('MongoDB disconnected');
  }
}

// Health check function
async function getConnectionTestResult() {
  try {
    const connection = await connectMongoDB();
    await mongoose.connection.db.admin().ping();
    return { success: true, method: 'mongodb-native' };
  } catch (error) {
    console.error('MongoDB health check failed:', error.message);
    return { success: false, error: error.message, method: 'mongodb-native' };
  }
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
  getConnectionTestResult,
  mongoose
};
