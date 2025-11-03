const User = require('../models/users');
const { createTokenResponse } = require('../utils/jwt');

// REGISTER
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, dan password dibutuhkan'
      });
    }

    // cek kalo ada user yang sama
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Username';
      return res.status(409).json({
        success: false,
        message: `${field} sudah digunakan`
      });
    }

    // buat user baru
    const user = new User({
      username,
      email: email.toLowerCase(),
      password
    });

    await user.save();

    // buat token
    const tokenResponse = createTokenResponse(user);

    res.status(201).json({
      success: true,
      message: 'User berhasil didaftarkan',
      data: tokenResponse
    });

  } catch (error) {
    console.error('Pendaftaran error:', error);

    // error handle validasi
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    // handle jika key duplikat
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error saat regisster'
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password dibutuhkan'
      });
    }

    // cari user dan cek info login
    const user = await User.findByCredentials(username, password);

    // buat token
    const tokenResponse = createTokenResponse(user);

    res.json({
      success: true,
      message: 'Login berhasil',
      data: tokenResponse
    });

  } catch (error) {
    console.error('Login error:', error);

    if (error.message === 'Invalid credentials') {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error saat login'
    });
  }
};

// GET profil user
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat fetch profile'
    });
  }
};

// UPDATE profil
const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email.toLowerCase();

    // Check for existing username/email
    if (Object.keys(updateData).length > 0) {
      const existingUser = await User.findOne({
        _id: { $ne: userId },
        $or: [
          ...(updateData.email ? [{ email: updateData.email }] : []),
          ...(updateData.username ? [{ username: updateData.username }] : [])
        ]
      });

      if (existingUser) {
        const field = existingUser.email === updateData.email ? 'Email' : 'Username';
        return res.status(409).json({
          success: false,
          message: `${field} sudah digunakan`
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error saat mengubah profil'
    });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout berhasil, silakan hapus token di client'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat logout'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logout
};
