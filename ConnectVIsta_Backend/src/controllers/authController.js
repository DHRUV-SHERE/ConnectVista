const User = require('../models/User');
const ServiceSeeker = require('../models/ServiceSeeker');
const ServiceProvider = require('../models/ServiceProvider');
const Service = require('../models/Service');
const Token = require('../models/Token');
const { generateTokens, verifyRefreshToken } = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const geocodingService = require('../services/geocodingService');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email address'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Token expires in 1 hour
    const resetPasswordExpires = Date.now() + 3600000;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // Get user name for email
    let userName = 'User';
    if (user.role === 'provider') {
      const provider = await ServiceProvider.findOne({ userId: user._id });
      if (provider) userName = provider.name;
    } else if (user.role === 'seeker') {
      const seeker = await ServiceSeeker.findOne({ userId: user._id });
      if (seeker) userName = seeker.name;
    }

    // Return the raw token and user info to frontend so it can send the email via EmailJS
    // In a production app with a dedicated mail server, the backend would send the email.
    // Since we're using EmailJS (client-side library), we'll let the frontend handle it
    // BUT we'll provide the necessary data securely.
    res.json({
      success: true,
      message: 'Reset token generated',
      data: {
        userName,
        resetToken, // THIS IS THE UNHASHED TOKEN to be sent in the link
        email: user.email
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing forgot password'
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Hash the token from the URL to compare with the one in DB
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password'
    });
  }
};

const signup = async (req, res) => {
  try {
    const { email, phone, password, role, ...profileData } = req.body;

    console.log('Signup attempt:', { email, phone, role, hasPassword: !!password });

    // Validate required fields
    if (!email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, phone, password, and role are required'
      });
    }

    // Check if user exists (case-insensitive email check)
    const existingUser = await User.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${email}$`, 'i') } },
        { phone: phone }
      ]
    });

    if (existingUser) {
      console.log('Existing user found:', { 
        email: existingUser.email, 
        phone: existingUser.phone,
        id: existingUser._id 
      });
      
      // Determine which field conflicts
      const emailConflict = existingUser.email?.toLowerCase() === email?.toLowerCase();
      const phoneConflict = existingUser.phone === phone;
      
      let conflictMessage = 'User with this ';
      if (emailConflict && phoneConflict) {
        conflictMessage += 'email and phone already exists';
      } else if (emailConflict) {
        conflictMessage += 'email already exists';
      } else {
        conflictMessage += 'phone number already exists';
      }
      
      return res.status(400).json({
        success: false,
        message: conflictMessage,
        conflicts: {
          email: emailConflict,
          phone: phoneConflict
        }
      });
    }

    // Hash password manually (NOT using middleware)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with already hashed password
    const user = await User.create({
      email: email.toLowerCase().trim(), // Normalize email
      phone: phone.trim(),
      password: hashedPassword, // Already hashed
      role
    });

    console.log('User created:', user._id);

    let profile;

    // In authController.js, update the seeker creation part:
if (role === 'seeker') {
  profile = await ServiceSeeker.create({
    userId: user._id,
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
      // Geocode the address during initial registration
      let coordinates = { type: 'Point', coordinates: [0, 0] };
      
      if (profileData.street && profileData.city && profileData.state && profileData.pinCode) {
        try {
          const addressParts = {
            street: profileData.street,
            city: profileData.city,
            state: profileData.state,
            pinCode: profileData.pinCode
          };
          coordinates = await geocodingService.getCoordinatesFromAddress(addressParts);
          console.log('Geocoded coordinates during signup:', coordinates);
        } catch (geocodeError) {
          console.warn('Geocoding failed during signup, using default coordinates:', geocodeError.message);
          // Continue with default coordinates - don't fail signup
        }
      } else {
        console.warn('Incomplete address for geocoding during signup');
      }

      // Build provider data object
      const providerData = {
        userId: user._id,
        name: profileData.name,
        businessName: profileData.businessName,
        description: profileData.description,
        experienceYears: profileData.experienceYears || 0,
        businessAddress: {
          street: profileData.street,
          city: profileData.city,
          state: profileData.state,
          pinCode: profileData.pinCode,
          coordinates: coordinates
        },
        languages: profileData.languages || [],
        startingPrice: profileData.startingPrice,
        emergencyCharge: profileData.emergencyCharge || 0,
        extraChargeNote: profileData.extraChargeNote
      };

      // Handle service selection
      if (profileData.service) {
        providerData.service = {
          name: profileData.service.name || '',
          category: profileData.service.category || '',
          serviceId: profileData.service.serviceId || null
        };
      }

      // Handle subServices
      if (profileData.subServices && Array.isArray(profileData.subServices)) {
        providerData.subServices = profileData.subServices.map(sub => ({
          name: sub.name || sub,
          serviceId: sub.serviceId || null
        }));
      }

      // Handle custom service (when service not available in list)
      if (profileData.customService && profileData.customService.isCustom) {
        providerData.customService = {
          isCustom: true,
          customCategory: profileData.customService.customCategory || '',
          customSubServices: profileData.customService.customSubServices || []
        };

        // Create the custom service in the Service collection
        if (profileData.customService.customCategory) {
          try {
            // Check if service already exists
            let customServiceDoc = await Service.findOne({
              name: profileData.customService.customCategory,
              category: 'other'
            });

            if (!customServiceDoc) {
              customServiceDoc = await Service.create({
                name: profileData.customService.customCategory,
                category: 'other',
                description: `Custom service category: ${profileData.customService.customCategory}`,
                subServices: profileData.customService.customSubServices || []
              });
            }

            // Update provider's service reference
            providerData.service = {
              name: profileData.customService.customCategory,
              category: 'other',
              serviceId: customServiceDoc._id
            };

            console.log('Custom service created:', customServiceDoc._id);
          } catch (customServiceError) {
            console.error('Error creating custom service:', customServiceError);
            // Continue without creating custom service - don't fail signup
          }
        }
      } else {
        providerData.customService = {
          isCustom: false,
          customCategory: '',
          customSubServices: []
        };
      }

      profile = await ServiceProvider.create(providerData);
      console.log('Provider profile created with service:', profile.service);
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
    const { email, password, role } = req.body;

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

    // If role is specified in request, verify user has that role
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Invalid role.'
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

    // Get profile based on role (skip for admin)
    let profile = null;
    if (user.role === 'seeker') {
      profile = await ServiceSeeker.findOne({ userId: user._id });
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
          name: user.name || 'Provider',
          businessName: user.name || 'My Business',
          businessAddress: {
            street: 'Not provided',
            city: 'Not provided', 
            state: 'Not provided',
            pinCode: '000000',
            coordinates: {
              type: 'Point',
              coordinates: [0, 0]
            }
          },
          startingPrice: 100,
          verificationStatus: 'pending',
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
          name: user.name || 'User',
          gender: 'other',
          address: {
            street: 'Not provided',
            city: 'Not provided',
            state: 'Not provided',
            pinCode: '000000'
          }
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
        { userId: user._id },
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
  changePassword,
  forgotPassword,
  resetPassword
};