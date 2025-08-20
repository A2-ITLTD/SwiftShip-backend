const mongoose = require('mongoose');
const logger = require('./logger');

const dbConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('✅ Database connected');
  } catch (err) {
    logger.error(`❌ Database connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = dbConfig;
