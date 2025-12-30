const ServiceSeeker = require('../models/ServiceSeeker');
const User = require('../models/User');

// Get seeker profile
const getSeekerProfile = async (req, res) => {
  try {
    const seeker = await ServiceSeeker.findOne({ user: req.user.id });
    
    if (!seeker) {
      return res.status(404).json({
        success: false,
        message: 'Seeker profile not found'
      });
    }

    res.json({
      success: true,
      data: { seeker }
    });
  } catch (error) {
    console.error('Get seeker profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seeker profile'
    });
  }
};

// Create or update seeker profile
const updateSeekerProfile = async (req, res) => {
  try {
    const {
      name,
      gender,
      address,
      city,
      state,
      pinCode,
      profileImage,
      preferences
    } = req.body;

    // Check if seeker exists or create new one
    let seeker = await ServiceSeeker.findOne({ user: req.user.id });
    
    if (!seeker) {
      // Create new seeker profile WITHOUT coordinates
      seeker = new ServiceSeeker({
        user: req.user.id,
        name: name || req.user.name || 'User',
        gender: gender || 'other',
        address: {
          street: address || '',
          city: city || '',
          state: state || '',
          pinCode: pinCode || ''
          // No coordinates - will be added later via updateLocation
        },
        profileImage: profileImage || 'default-avatar.png',
        preferences: preferences || {
          notifications: true,
          emailUpdates: true
        }
      });
    } else {
      // Update existing seeker - don't touch coordinates
      if (name) seeker.name = name;
      if (gender) seeker.gender = gender;
      
      // Update address WITHOUT coordinates
      if (address || city || state || pinCode) {
        seeker.address.street = address || seeker.address.street;
        seeker.address.city = city || seeker.address.city;
        seeker.address.state = state || seeker.address.state;
        seeker.address.pinCode = pinCode || seeker.address.pinCode;
        // Keep existing coordinates if they exist
      }
      
      if (profileImage) seeker.profileImage = profileImage;
      if (preferences) seeker.preferences = { ...seeker.preferences, ...preferences };
    }

    await seeker.save();

    res.json({
      success: true,
      message: seeker.isNew ? 'Profile created successfully' : 'Profile updated successfully',
      data: { seeker }
    });

  } catch (error) {
    console.error('Update seeker profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update seeker profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update location coordinates - This is where we add coordinates when user allows location
const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const seeker = await ServiceSeeker.findOne({ user: req.user.id });
    
    if (!seeker) {
      return res.status(404).json({
        success: false,
        message: 'Seeker profile not found'
      });
    }

    // Add or update coordinates
    seeker.address.coordinates = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };

    await seeker.save();

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: {
        coordinates: seeker.address.coordinates
      }
    });

  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location'
    });
  }
};

// In seekerProfileController.js - add this function
const clearLocation = async (req, res) => {
  try {
    const seeker = await ServiceSeeker.findOne({ user: req.user.id });
    
    if (!seeker) {
      return res.status(404).json({
        success: false,
        message: 'Seeker profile not found'
      });
    }

    // Clear coordinates
    seeker.address.coordinates = null;
    
    await seeker.save();

    res.json({
      success: true,
      message: 'Location cleared successfully'
    });

  } catch (error) {
    console.error('Clear location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear location'
    });
  }
};

module.exports = {
  getSeekerProfile,
  updateSeekerProfile,
  updateLocation,
clearLocation
};