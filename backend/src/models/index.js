import mongoose from 'mongoose';

// Company Model
const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  website: String,
  logo: String,
  coverImage: String,
  location: String,
  industry: String,
  size: { type: String, enum: ['1-50', '51-200', '201-500', '501-1000', '1000+'] },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isVerified: { type: Boolean, default: false },
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String
  },
}, { timestamps: true });

// Job Model
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], required: true },
  experience: { type: String, enum: ['Entry', 'Mid', 'Senior'], required: true },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  skills: [String],
  category: String,
  workMode: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], required: true },
  benefits: [String],
  requirements: [String],
  applicationDeadline: Date,
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
}, { timestamps: true });

// Application Model
const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: String,
  coverLetter: String,
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
    default: 'pending'
  },
  appliedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  rejectionReason: String,
  recruiterNotes: String,
}, { timestamps: true });

// Saved Job Model
const savedJobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  savedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Notification Model
const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['application', 'message', 'job', 'admin'], required: true },
  title: String,
  message: String,
  data: mongoose.Schema.Types.Mixed,
  isRead: { type: Boolean, default: false },
  readAt: Date,
}, { timestamps: true });

export const Company = mongoose.model('Company', companySchema);
export const Job = mongoose.model('Job', jobSchema);
export const Application = mongoose.model('Application', applicationSchema);
export const SavedJob = mongoose.model('SavedJob', savedJobSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
