const mongoose = require('mongoose');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const ServiceSeeker = require('../models/ServiceSeeker');
const Token = require('../models/Token');
require('dotenv').config();

/**
 * Database Cleanup Script
 * Use this to clear all user data and fix duplicate key issues
 * 
 * Usage: node src/scripts/cleanupDatabase.js
 */

const cleanupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Display current counts
    const userCount = await User.countDocuments();
    const providerCount = await ServiceProvider.countDocuments();
    const seekerCount = await ServiceSeeker.countDocuments();
    const tokenCount = await Token.countDocuments();

    console.log('\n📊 Current Database State:');
    console.log(`Users: ${userCount}`);
    console.log(`Service Providers: ${providerCount}`);
    console.log(`Service Seekers: ${seekerCount}`);
    console.log(`Tokens: ${tokenCount}`);

    // Check for duplicate emails
    const duplicates = await User.aggregate([
      {
        $group: {
          _id: '$email',
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]);

    if (duplicates.length > 0) {
      console.log('\n⚠️  Found duplicate emails:', duplicates);
    } else {
      console.log('\n✅ No duplicate emails found');
    }

    // Ask for confirmation before deletion
    console.log('\n⚠️  WARNING: This will delete ALL user data!');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to proceed...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Delete all data
    console.log('\n🗑️  Deleting all data...');
    
    await User.deleteMany({});
    console.log('✅ Deleted all users');
    
    await ServiceProvider.deleteMany({});
    console.log('✅ Deleted all service providers');
    
    await ServiceSeeker.deleteMany({});
    console.log('✅ Deleted all service seekers');
    
    await Token.deleteMany({});
    console.log('✅ Deleted all tokens');

    // Rebuild indexes
    console.log('\n🔧 Rebuilding indexes...');
    
    await User.collection.dropIndexes();
    await User.createIndexes();
    console.log('✅ User indexes rebuilt');

    await ServiceProvider.collection.dropIndexes();
    await ServiceProvider.createIndexes();
    console.log('✅ ServiceProvider indexes rebuilt');

    console.log('\n✨ Database cleanup completed successfully!');
    console.log('You can now try signing up again.');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the cleanup
cleanupDatabase();
