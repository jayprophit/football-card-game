const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise} Connection promise
 */
const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/footballchess';
    
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Get the current database connection
 * @returns {Object} Mongoose connection object
 */
const getConnection = () => {
  return mongoose.connection;
};

/**
 * Close the database connection
 * @returns {Promise} Promise that resolves when connection is closed
 */
const closeConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error(`Error closing MongoDB connection: ${error.message}`);
    throw error;
  }
};

module.exports = {
  connectDB,
  getConnection,
  closeConnection
};
