const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection URI
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/connectvista';
    
    console.log(`🔗 Attempting to connect to MongoDB: ${mongoURI.replace(/:([^:]+)@/, ':****@')}`);
    
    // For Mongoose 7+, these options are no longer needed
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Event listeners for connection
    mongoose.connection.on('connected', () => {
      console.log('📊 Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from DB');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('👋 Mongoose connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // More helpful error messages
    if (error.name === 'MongoParseError') {
      console.error('💡 Tip: Check your MongoDB connection string format');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('💡 Tip: Make sure MongoDB is running on your system');
      console.error('   Run: mongod (in a separate terminal)');
    } else if (error.name === 'MongoNetworkError') {
      console.error('💡 Tip: Check if MongoDB server is accessible');
      console.error('   Try: mongodb://127.0.0.1:27017 instead of localhost');
    }
    
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

module.exports = connectDB;