import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Error classes
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error handler wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    err.message = `${field} already exists`;
    err.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    err.message = 'Invalid token';
    err.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    err.message = 'Token expired';
    err.statusCode = 401;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Authentication middleware
export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError('Please login first', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  const user = await User.findById(decoded.id).populate('company');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isAccountLocked()) {
    throw new AppError('Account is temporarily locked. Please try again later.', 403);
  }

  req.user = user;
  next();
});

// Authorization middleware - specific roles
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new AppError(`Only ${roles.join(', ')} can access this resource`, 403);
  }
  next();
};

// Check if recruiter
export const isRecruiter = authorize('recruiter', 'admin');

// Check if candidate
export const isCandidate = authorize('candidate');

// Check if admin
export const isAdmin = authorize('admin');
