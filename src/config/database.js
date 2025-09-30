const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Pastikan env sudah ada
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    // Connect ke MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Event listener kalau koneksi putus
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Event listener kalau ada error
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
