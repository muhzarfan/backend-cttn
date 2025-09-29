const { verifyToken } = require('../utils/jwt');
const User = require('../models/users');

// Middleware to authenticate user
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user not found'
      });
    }

    // Attach user to request
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    // Handle specific JWT errors
    let message = 'Invalid token';
    if (error.message.includes('expired')) {
      message = 'Token has expired';
    } else if (error.message.includes('malformed')) {
      message = 'Malformed token';
    }

    return res.status(401).json({
      success: false,
      message
    });
  }
};

// Optional authentication - for routes that can work with or without auth
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};