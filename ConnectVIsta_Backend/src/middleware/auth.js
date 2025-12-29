const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      console.log('=== AUTH MIDDLEWARE ===');
      console.log('Authorization header:', req.headers.authorization);
      
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No token provided');
        return res.status(401).json({ 
          success: false, 
          message: 'Access denied. No token provided.' 
        });
      }

      const token = authHeader.split(' ')[1];
      console.log('Token received');
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      // Find user
      const user = await User.findById(decoded.id);
      console.log('User found:', user?._id);
      
      if (!user || !user.isActive) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found or inactive' 
        });
      }

      // Check role authorization
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: 'Insufficient permissions' 
        });
      }

      // Attach user to request
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role
      };
      
      console.log('User attached to req.user:', req.user);
      next();
      
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      
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
      
      res.status(500).json({ 
        success: false, 
        message: 'Server error during authentication' 
      });
    }
  };
};

module.exports = auth;