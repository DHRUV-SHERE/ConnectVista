const User = require('../models/User');
const ServiceSeeker = require('../models/ServiceSeeker');
const ServiceProvider = require('../models/ServiceProvider');
const Token = require('../models/Token');
const { generateTokens, verifyRefreshToken } = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
  try {
    const { email, phone, password, role, ...profileData } = req.body;

    console.log('Signup attempt:', { email, phone, role, hasPassword: !!password });

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists'
      });
    }

    // Hash password manually (NOT using middleware)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with already hashed password
    const user = await User.create({
      email,
      phone,
      password: hashedPassword, // Already hashed
      role
    });

    console.log('User created:', user._id);

    let profile;

    // In authController.js, update the seeker creation part:
if (role === 'seeker') {
  profile = await ServiceSeeker.create({
    user: user._id,
    name: profileData.name,
    gender: profileData.gender,
    address: {
      street: profileData.address || '', // This should be street address
      city: profileData.city || '',
      state: profileData.state || '',
      pinCode: profileData.pinCode || '',
    },
    profileImage: profileData.profileImage || 'default-avatar.png'
  });
} else if (role === 'provider') {
      profile = await ServiceProvider.create({
        userId: user._id,
        name: profileData.name,
        businessName: profileData.businessName,
        description: profileData.description,
        experienceYears: profileData.experienceYears || 0,
        businessAddress: {
          street: profileData.street,
          city: profileData.city,
          state: profileData.state,
          pinCode: profileData.pinCode
        },
        languages: profileData.languages || [],
        startingPrice: profileData.startingPrice,
        emergencyCharge: profileData.emergencyCharge || 0,
        extraChargeNote: profileData.extraChargeNote
      });
    }

    console.log('Profile created:', profile ? profile._id : 'none');

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token
    await Token.create({
      userId: user._id,
      refreshToken,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Convert user to JSON (password already excluded by toJSON transform)
    const userResponse = user.toObject();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        profile,
        accessToken,
        role: user.role
      }
    });

  } catch (error) {
    console.error('SIGNUP ERROR DETAILS:', {
      name: error.name,
      message: error.message,
      code: error.code,
      errors: error.errors
    });

    // Handle specific MongoDB errors
    let errorMessage = 'Server error during registration';
    let statusCode = 500;

    if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
      statusCode = 400;
    } else if (error.code === 11000) {
      // MongoDB duplicate key error
      if (error.message.includes('email')) {
        errorMessage = 'Email already exists';
      } else if (error.message.includes('phone')) {
        errorMessage = 'Phone number already exists';
      } else {
        errorMessage = 'Duplicate key error';
      }
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare password using our method
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token
    await Token.create({
      userId: user._id,
      refreshToken,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Get profile based on role
    let profile;
    if (user.role === 'seeker') {
      profile = await ServiceSeeker.findOne({ user: user._id });
    } else if (user.role === 'provider') {
      profile = await ServiceProvider.findOne({ userId: user._id });
    }

    // Convert user to JSON (password excluded)
    const userResponse = user.toObject();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        profile,
        accessToken,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if token exists in database
    const tokenDoc = await Token.findOne({
      userId: decoded.id,
      refreshToken
    });

    if (!tokenDoc) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found'
      });
    }

    // Get user
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Update refresh token in database
    tokenDoc.refreshToken = newRefreshToken;
    tokenDoc.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await tokenDoc.save();

    // Set new refresh token in cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error refreshing token'
    });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Remove refresh token from database
      await Token.deleteOne({ refreshToken });
    }

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// authController.js - Add this function if not exists
const getProfile = async (req, res) => {
  try {
    console.log('=== GET PROFILE ===');
    console.log('User from token:', req.user);

    // Get user with fresh data
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let profile = null;

    // If user is provider, get provider profile
    if (user.role === 'provider') {
      profile = await ServiceProvider.findOne({ userId: user._id });

      if (!profile) {
        // Create a basic provider profile if it doesn't exist
        profile = await ServiceProvider.create({
          userId: user._id,
          businessName: user.name || 'My Business',
          verificationStatus: 'not-submitted',
          isVerified: false
        });
      }
    }

    // If user is seeker, get seeker profile
    if (user.role === 'seeker') {
      profile = await ServiceSeeker.findOne({ userId: user._id });

      if (!profile) {
        profile = await ServiceSeeker.create({
          userId: user._id,
          fullName: user.name || 'User'
        });
      }
    }

    console.log('Profile response:', {
      user: user.email,
      role: user.role,
      profileExists: !!profile
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt
        },
        profile: profile || {}
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const updateData = req.body;

    if (user.role === 'seeker') {
      await ServiceSeeker.findOneAndUpdate(
        { user: user._id },
        updateData,
        { new: true, runValidators: true }
      );
    } else if (user.role === 'provider') {
      await ServiceProvider.findOneAndUpdate(
        { userId: user._id },
        updateData,
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Revoke all refresh tokens for this user (security measure)
    await Token.deleteMany({ userId: user._id });

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword
};