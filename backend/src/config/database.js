import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@coffee.com';
  const adminName = process.env.ADMIN_NAME || 'Admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const existingUser = await User.findOne({ email: adminEmail });
  if (!existingUser) {
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();
    console.log(`Admin account created: ${adminEmail}`);
  } else if (existingUser.role !== 'admin') {
    existingUser.role = 'admin';
    await existingUser.save();
    console.log(`Existing user ${adminEmail} upgraded to admin`);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    await seedAdminUser();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;