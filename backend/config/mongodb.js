const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://subham4343_db_user:RsD0qysfLKGeX3GL@cluster1.mn2ty8w.mongodb.net/?appName=Cluster1';

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in environment variables');
  process.exit(1);
}

let cachedConnection = null;

async function connectMongoDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority',
      appName: 'SaadhanaBoard'
    });

    cachedConnection = connection;
    console.log('✓ MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    throw error;
  }
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
