const userSchema = require('../models/userSchema');
// const cloudinary = require('../Utils/cloudinary');
const sendMail = require('../Utils/mail');
const generateRandomString = require('../Utils/randomString');
const {
  mailTemplate,
  resetPassTemplate,
  otpTemplate,
} = require('../Utils/template');
const { isValidEmail, isPasswordValid } = require('../Utils/validators');
const jwt = require('jsonwebtoken');
// const fs = require('fs');
const orderSchema = require('../models/orderSchema');

// -------------------- REGISTER --------------------
const register = async (req, res) => {
  try {
    const { username, email, password, address, role, avatar } = req.body;

    // --- Input Validation ---
    if (!username?.trim()) {
      return res.status(400).json({ error: 'Username is required' });
    }
    if (username.length < 3 || username.length > 30) {
      return res
        .status(400)
        .json({ error: 'Username must be 3–30 characters long' });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        error: 'Username can only contain letters, numbers, and underscores',
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    if (!isPasswordValid(password)) {
      return res.status(400).json({
        error:
          'Password must be 8+ chars and include uppercase, lowercase, number, and special character',
      });
    }

    // --- Prevent Duplicate Accounts ---
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingUsername = await userSchema.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // --- Generate OTP (6 digits, expires in 10 minutes) ---
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // --- Create new User ---
    const user = new userSchema({
      username,
      email,
      password,
      address: address || '',
      role: role && ['user', 'admin'].includes(role) ? role : 'user',
      avatar: avatar || '',
      otp: randomOtp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await user.save();

    // --- Send OTP via Email (fire & forget) ---
    sendMail(email, 'Verify Your Email', mailTemplate, randomOtp).catch((err) =>
      console.error('OTP email failed:', err)
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Please verify your email.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// -------------------- VERIFY EMAIL --------------------
const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!otp) return res.status(400).json({ error: 'OTP is required' });
  if (!isValidEmail(email))
    return res.status(400).json({ error: 'Invalid email format' });

  try {
    const user = await userSchema.findOne({ email }).select('+otp +otpExpires');
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.isVerified)
      return res.status(400).json({ error: 'Email already verified' });

    // Validate OTP (Production: compare as strings and check expiration)
    if (String(user.otp) !== String(otp) || Date.now() > user.otpExpires) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// -------------------- RESEND OTP --------------------
const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!isValidEmail(email))
    return res.status(400).json({ error: 'Invalid email format' });

  try {
    const user = await userSchema.findOne({ email }).select('+otp +otpExpires');
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.isVerified)
      return res.status(400).json({ error: 'Email already verified' });

    // generate new OTP (numeric or alphanumeric)
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.otp = newOtp;
    user.otpExpires = otpExpires;
    await user.save();

    // send email
    await sendMail(
      user.email,
      'Resend OTP - Email Verification',
      otpTemplate(newOtp, user.username)
    );

    return res.status(200).json({
      message: 'OTP resent successfully. Please check your email.',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
// -------------------- LOGIN --------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!isValidEmail(email))
    return res.status(400).json({ error: 'Invalid email' });
  if (!password) return res.status(400).json({ error: 'Password is required' });

  try {
    const existingUser = await userSchema
      .findOne({ email })
      .select('+password');
    if (!existingUser) return res.status(404).json({ error: 'User not found' });

    const isMatch = await existingUser.isPassValid(password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

    if (!existingUser.isVerified)
      return res.status(400).json({ error: 'Email not verified' });

    // JWT Token
    const accessToken = jwt.sign(
      {
        id: existingUser._id,
        name : existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_TOKEN,
      { expiresIn: '1d' }
    );

    // ----------- Link orders to this user if not linked already -----------
    await orderSchema.updateMany(
      { userEmail: email, userId: { $exists: false } },
      { $set: { userId: existingUser._id } }
    );

    const {
      password: pwd,
      otp,
      otpExpires,
      resetPassId,
      resetPassExpires,
      ...userData
    } = existingUser.toObject();

    return res.status(200).json({
      success: 'Login successful',
      accessToken,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// -------------------- FORGOT PASSWORD --------------------
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await userSchema.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const resetToken = generateRandomString(35);
    user.resetPassId = resetToken;
    user.resetPassExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    sendMail(
      email,
      'Reset Password',
      resetPassTemplate(resetToken, email)
    ).catch((err) => console.error('Password reset email failed:', err));

    return res
      .status(200)
      .json({ message: 'Check your email for password reset instructions.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// -------------------- RESET PASSWORD --------------------
const resetPassword = async (req, res) => {
  try {
    const { newPass } = req.body;
    const { randomString } = req.params;
    const { email } = req.query;

    if (!newPass)
      return res.status(400).json({ error: 'Password is required' });
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!isPasswordValid(newPass))
      return res.status(400).json({
        error:
          'Password must include 8+ chars, uppercase, lowercase, number, and symbol',
      });

    const user = await userSchema.findOne({
      email,
      resetPassId: randomString,
      resetPassExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ error: 'Invalid or expired link' });

    user.password = newPass;
    user.resetPassId = null;
    user.resetPassExpires = null;
    await user.save();

    return res.status(200).json({ success: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// -------------------- UPDATE USER --------------------
// const updateUser = async (req, res) => {
//   const { fullname, password } = req.body;
//   try {
//     const user = await userSchema.findById(req.user.id).select('+password');

//     if (!user) return res.status(404).json({ error: 'User not found' });

//     if (fullname) user.username = fullname.trim().split(/\s+/).join(' ');
//     if (password) user.password = password;

//     if (req.file?.path) {
//       // Delete old avatar if exists
//       if (user.avatar) {
//         await cloudinary.uploader.destroy(
//           user.avatar.split('/').pop().split('.')[0]
//         );
//       }
//       const uploadResult = await cloudinary.uploader.upload(req.file.path);
//       user.avatar = uploadResult.url;
//       fs.unlinkSync(req.file.path);
//     }

//     await user.save();

//     const {
//       password: pwd,
//       otp,
//       otpExpires,
//       resetPassId,
//       resetPassExpires,
//       ...userData
//     } = user.toObject();

//     return res.status(200).json(userData);
//   } catch (error) {
//     console.error('Update user error:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

module.exports = {
  register,
  verifyEmail,
  resendOtp,
  login,
  forgetPassword,
  resetPassword,
};
