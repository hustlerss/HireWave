import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new AppError('Please provide all required fields', 400);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User already exists', 400);
  }

  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await User.create({
    name,
    email,
    password,
    role,
    emailVerificationToken: crypto.createHash('sha256').update(emailVerificationToken).digest('hex'),
    emailVerificationExpires
  });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message: `Please verify your email by clicking: ${verifyUrl}`
    });
  } catch (emailError) {
    console.error(`⚠️ Failed to send verification email: ${emailError.message}`);
    if (process.env.NODE_ENV !== 'development') {
      throw emailError;
    }
  }

  const token = generateToken(user._id);
  
  res.status(201).json({
    success: true,
    token,
    user: user.toJSON()
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  const user = await User.findOne({ email }).select('+password').populate('company');
  
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.isAccountLocked()) {
    throw new AppError('Account is locked. Try again later.', 403);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  
  if (!isPasswordCorrect) {
    await user.incLoginAttempts();
    throw new AppError('Invalid email or password', 401);
  }

  await user.resetLoginAttempts();
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);
  
  res.status(200).json({
    success: true,
    token,
    user: user.toJSON()
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message: `Reset your password: ${resetUrl}`
    });
  } catch (emailError) {
    console.error(`⚠️ Failed to send password reset email: ${emailError.message}`);
    if (process.env.NODE_ENV !== 'development') {
      throw emailError;
    }
  }

  res.status(200).json({
    success: true,
    message: 'Password reset link sent to email'
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: resetTokenHash,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const newToken = generateToken(user._id);
  
  res.status(200).json({
    success: true,
    token: newToken,
    message: 'Password updated successfully'
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});
