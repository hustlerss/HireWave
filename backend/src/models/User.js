import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    phone: String,
    avatar: {
      type: String,
      default: null
    },
    resume: {
      type: String,
      default: null
    },
    bio: String,
    location: String,
    role: {
      type: String,
      enum: ['candidate', 'recruiter', 'admin'],
      default: 'candidate'
    },
    skills: [String],
    experience: Number,
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    savedJobs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    }],
    appliedJobs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    }],
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date,
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Check if account is locked
userSchema.methods.isAccountLocked = function() {
  return this.lockUntil && new Date() < this.lockUntil;
};

// Increment login attempts
userSchema.methods.incLoginAttempts = async function() {
  if (this.lockUntil && new Date() < this.lockUntil) {
    return;
  }
  
  const updates = { loginAttempts: this.loginAttempts + 1 };
  
  if (this.loginAttempts + 1 >= 5) {
    updates.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({ loginAttempts: 0, lockUntil: null });
};

// Remove sensitive fields
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpires;
  return obj;
};

export default mongoose.model('User', userSchema);
