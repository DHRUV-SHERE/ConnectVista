/**
 * Migration Script: Fix Provider Coordinates
 * 
 * This script fixes existing provider records that have incorrect coordinates
 * (e.g., default India center coordinates or swapped lat/lng).
 * 
 * Run with: node src/scripts/migrateProviderCoordinates.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const geocodingService = require('../services/geocodingService');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/connectvista';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected for migration');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// ServiceProvider schema (inline to avoid importing models)
const serviceProviderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  businessName: String,
  businessAddress: {
    street: String,
    city: String,
    state: String,
    pinCode: String,
    coordinates: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] } // [longitude, latitude]
    }
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isVerified: { type: Boolean, default: false }
});

// India center coordinates (to detect default values)
const INDIA_CENTER_LNG = 78.9629;
const INDIA_CENTER_LAT = 20.5937;
const TOLERANCE = 0.5;

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

/**
 * Check if coordinates are default India center coordinates
 */
const isDefaultIndiaCoordinates = (coords) => {
  if (!coords || !Array.isArray(coords) || coords.length !== 2) return true;
  
  const [lng, lat] = coords;
  return Math.abs(lng - INDIA_CENTER_LNG) < TOLERANCE && 
         Math.abs(lat - INDIA_CENTER_LAT) < TOLERANCE;
};

/**
 * Check if coordinates are swapped (lat, lng instead of lng, lat)
 */
const areCoordinatesSwapped = (coords) => {
  if (!coords || !Array.isArray(coords) || coords.length !== 2) return false;
  
  const [first, second] = coords;
  // If first value > 90, it's likely longitude (swapped)
  // Valid latitude must be between -90 and 90
  return first > 90 || first < -90;
};

/**
 * Fix a single provider's coordinates
 */
const fixProviderCoordinates = async (provider) => {
  const { street, city, state, pinCode } = provider.businessAddress || {};
  
  // Check if we have enough address info
  if (!city || !state || !pinCode) {
    console.log(`  ⚠️  Skipping ${provider.businessName}: incomplete address`);
    return { success: false, reason: 'incomplete_address' };
  }
  
  try {
    // Build full address string
    const addressParts = {
      street: street || '',
      city,
      state,
      pinCode
    };
    
    const newCoords = await geocodingService.getCoordinatesFromAddress(addressParts);
    
    console.log(`  ✅ Old: [${provider.businessAddress.coordinates.join(', ')}] -> New: [${newCoords.coordinates.join(', ')}]`);
    
    // Update the provider
    provider.businessAddress.coordinates = newCoords.coordinates;
    await provider.save();
    
    return { success: true };
  } catch (error) {
    console.log(`  ❌ Failed: ${error.message}`);
    return { success: false, reason: error.message };
  }
};

/**
 * Main migration function
 */
const migrate = async () => {
  try {
    await connectDB();
    
    console.log('\n========================================');
    console.log('Provider Coordinates Migration');
    console.log('========================================\n');
    
    // Find all providers with coordinates
    const providers = await ServiceProvider.find({
      'businessAddress.coordinates': { $exists: true }
    });
    
    console.log(`Found ${providers.length} providers with coordinates\n`);
    
    let fixed = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const provider of providers) {
      const coords = provider.businessAddress.coordinates;
      
      console.log(`Processing: ${provider.businessName}`);
      console.log(`  Location: ${provider.businessAddress.city}, ${provider.businessAddress.state}`);
      console.log(`  Current coords: [${coords.join(', ')}]`);
      
      // Check if coordinates need fixing
      const isDefault = isDefaultIndiaCoordinates(coords);
      const isSwapped = areCoordinatesSwapped(coords);
      
      if (isDefault) {
        console.log('  📍 Detected default India center coordinates');
        const result = await fixProviderCoordinates(provider);
        if (result.success) fixed++;
        else errors++;
      } else if (isSwapped) {
        console.log('  🔄 Detected swapped lat/lng coordinates');
        const result = await fixProviderCoordinates(provider);
        if (result.success) fixed++;
        else errors++;
      } else {
        console.log('  ✅ Coordinates appear valid');
        skipped++;
      }
      console.log('');
    }
    
    console.log('========================================');
    console.log('Migration Summary:');
    console.log(`  ✅ Fixed: ${fixed}`);
    console.log(`  ⏭️  Skipped (valid): ${skipped}`);
    console.log(`  ❌ Errors: ${errors}`);
    console.log('========================================\n');
    
    // Rebuild 2dsphere index
    console.log('Rebuilding 2dsphere index...');
    await ServiceProvider.collection.dropIndex('businessAddress.coordinates_2dsphere').catch(() => {});
    await ServiceProvider.collection.createIndex({ 'businessAddress.coordinates': '2dsphere' });
    console.log('✅ Index rebuilt successfully\n');
    
    console.log('Migration completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrate();

