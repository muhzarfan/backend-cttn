const { verifyToken } = require('../utils/jwt');
const User = require('../models/users');

// middleware untuk autentikasi user
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7);
    
    // verifikasi token
    const decoded = verifyToken(token);
    
    // cari user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user not found'
      });
    }

    // kirim request user
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    // handle error di JWT
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

// autentikasi untuk routes yang ada
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
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};
