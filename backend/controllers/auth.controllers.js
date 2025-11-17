// controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import genToken from '../utils/token.js'; // keep your existing token util
import { sendOtpMail } from '../utils/mail.js';

// Cookie options used for signing in / signing up
const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true on HTTPS / production
  sameSite: 'none', // required for cross-site cookies
  path: '/',        // accessible on all routes
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = await genToken(user._id);

    // Set cookie (httpOnly) — browser will store it if CORS + withCredentials are correct
    res.cookie('token', token, cookieOpts);

    // Return minimal user info (do NOT return token)
    return res.status(201).json({ userId: user._id, name: user.name, email: user.email });
  } catch (error) {
    console.error('sign up error', error);
    return res.status(500).json({ message: 'Sign up error', error: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email/password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = await genToken(user._id);

    res.cookie('token', token, cookieOpts);

    return res.status(200).json({ userId: user._id, name: user.name, email: user.email });
  } catch (error) {
    console.error('sign in error', error);
    return res.status(500).json({ message: 'Sign in error', error: error.message });
  }
};

export const signOut = async (req, res) => {
  try {
    // Use same path when clearing
    res.clearCookie('token', { path: '/' });
    return res.status(200).json({ message: 'Signout successful' });
  } catch (error) {
    console.error('sign out error', error);
    return res.status(500).json({ message: 'Sign out error', error: error.message });
  }
};

// OTP & reset functions (unchanged but keep error handling)
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    try {
      await sendOtpMail(email, otp);

      user.resetOtp = otp;
      user.otpExpires = Date.now() + 5 * 60 * 1000;
      user.isOtpVerified = false;
      await user.save();

      return res.status(200).json({ message: 'OTP sent to your email' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        message: 'Failed to send OTP email',
        error: emailError.message
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('verify otp error', error);
    return res.status(500).json({ message: 'verify otp error', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: 'OTP not verified' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('reset password error', error);
    return res.status(500).json({ message: 'reset password error', error: error.message });
  }
};
