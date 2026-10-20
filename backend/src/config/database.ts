import mongoose from 'mongoose';
import logger from '@/utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartstudy';

    // Use memory server for development
    if (process.env.NODE_ENV === 'development') {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        logger.info('Using MongoDB Memory Server');
      } catch (e) {
        logger.warn('Memory server failed, using env URI');
      }
    }

    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    // Don't crash in development
    if (process.env.NODE_ENV !== 'development') {
      process.exit(1);
    }
  }
};

