const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider'); // Add this import

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      console.log('🔐 Auth middleware started');
      console.log('Headers:', req.headers);
      
      // 1. Get token
      const authHeader = req.header('Authorization');
      console.log('Authorization header:', authHeader);
      
      let token;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      } else {
        // Also check cookies
        token = req.cookies?.accessToken || req.cookies?.token;
      }
      
      console.log('Extracted token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        console.log('❌ No token found');
        return res.status(401).json({
          success: false,
          message: 'No token, authorization denied'
        });
      }

      // 2. Verify token
      console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'Present' : 'Missing');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      req.user = decoded;

      // 3. Check if user exists and get latest data
      const user = await User.findById(decoded.id).select('-password');
      console.log('Found user in DB:', user ? `Yes (${user.email})` : 'No');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // 4. IMPORTANT: Get provider profile if user is provider
      if (user.role === 'provider') {
        console.log('User is provider, fetching provider profile...');
        const provider = await ServiceProvider.findOne({ userId: user._id });
        console.log('Found provider profile:', provider ? 'Yes' : 'No');
        
        if (provider) {
          // Attach provider verification status to user object
          req.user.providerProfile = {
            isVerified: provider.isVerified,
            verificationStatus: provider.verificationStatus,
            providerId: provider._id
          };
          console.log('Provider profile attached:', req.user.providerProfile);
        }
      }

      // 5. Role check
      if (roles.length > 0 && !roles.includes(user.role)) {
        console.log(`❌ Role mismatch. Required: ${roles}, User role: ${user.role}`);
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.'
        });
      }

      console.log('✅ Auth successful');
      next();
    } catch (error) {
      console.error('🔥 Auth middleware error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }
      
      // Check if it's a JWT secret issue
      if (error.message.includes('secret')) {
        console.error('⚠️ JWT_SECRET might be missing or incorrect in .env file');
      }
      
      return res.status(500).json({
        success: false,
        message: 'Server error in authentication',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};

module.exports = auth;