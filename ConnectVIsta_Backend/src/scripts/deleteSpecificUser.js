const mongoose = require('mongoose');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const ServiceSeeker = require('../models/ServiceSeeker');
const Token = require('../models/Token');
require('dotenv').config();

/**
 * Delete a specific user by email or phone
 * 
 * Usage: 
 * node src/scripts/deleteSpecificUser.js email workwithdhruv05@gmail.com
 * node src/scripts/deleteSpecificUser.js phone 8511646911
 */

const deleteSpecificUser = async () => {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    const searchType = args[0]; // 'email' or 'phone'
    const searchValue = args[1];

    if (!searchType || !searchValue) {
      console.log('❌ Usage: node deleteSpecificUser.js <email|phone> <value>');
      console.log('Example: node deleteSpecificUser.js email workwithdhruv05@gmail.com');
      console.log('Example: node deleteSpecificUser.js phone 8511646911');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Build search query
    const query = searchType === 'email' 
      ? { email: searchValue.toLowerCase() }
      : { phone: searchValue };

    // Find the user
    const user = await User.findOne(query);

    if (!user) {
      console.log(`❌ No user found with ${searchType}: ${searchValue}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log('👤 Found User:');
    console.log(`   ID: ${user._id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Phone: ${user.phone}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Created: ${user.createdAt}\n`);

    // Find associated profile
    let profile = null;
    if (user.role === 'provider') {
      profile = await ServiceProvider.findOne({ userId: user._id });
      if (profile) {
        console.log('🏢 Associated Provider Profile:');
        console.log(`   Business Name: ${profile.businessName}`);
        console.log(`   Name: ${profile.name}\n`);
      }
    } else if (user.role === 'seeker') {
      profile = await ServiceSeeker.findOne({ userId: user._id });
      if (profile) {
        console.log('👥 Associated Seeker Profile:');
        console.log(`   Name: ${profile.name}\n`);
      }
    }

    // Ask for confirmation
    console.log('⚠️  Are you sure you want to delete this user?');
    console.log('   This will also delete their profile and tokens.');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to proceed...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Delete user and associated data
    console.log('🗑️  Deleting user...');
    
    await User.deleteOne({ _id: user._id });
    console.log('✅ Deleted user');

    if (user.role === 'provider') {
      await ServiceProvider.deleteMany({ userId: user._id });
      console.log('✅ Deleted provider profile');
    } else if (user.role === 'seeker') {
      await ServiceSeeker.deleteMany({ userId: user._id });
      console.log('✅ Deleted seeker profile');
    }

    await Token.deleteMany({ userId: user._id });
    console.log('✅ Deleted tokens');

    console.log('\n✨ User deleted successfully!');
    console.log('You can now signup with this email or phone number.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
deleteSpecificUser();
