const jwt = require('jsonwebtoken');

// generate token jwt
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'notesapp-api',
    audience: 'notesapp-client'
  });
};

// verifikasi token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'notesapp-api',
      audience: 'notesapp-client'
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// buat token random
const createTokenResponse = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email
  };

  const token = generateToken(payload);

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    },
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  };
};

module.exports = {
  generateToken,
  verifyToken,
  createTokenResponse
};
