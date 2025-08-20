const express = require('express');
const {
  register,
  login,
  verifyEmail,
  forgetPassword,
  resetPassword,
  resendOtp,
} = require('../../Controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
router.post('/register', register);
router.post('/forgot-password', forgetPassword);
router.post('/reset-password/:randomString', resetPassword);

module.exports = router;
