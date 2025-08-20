require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userSchema');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({
      email: 'admin@transport.commercialtirerepairllc.com',
    });
    if (existingAdmin) {
      console.log('Admin already exists');
      await mongoose.disconnect();
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 12);

    const admin = new User({
      username: 'Admin',
      email: 'admin@transport.commercialtirerepairllc.com',
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    console.log('Admin created successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
