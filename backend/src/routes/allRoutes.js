import express from 'express';
import mongoose from 'mongoose';
import { authenticate, asyncHandler, AppError } from '../middleware/errorHandler.js';
import { Job, Application, Company, Notification } from '../models/index.js';
import User from '../models/User.js';

// ─── User Routes ────────────────────────────────────────────────────────────
const userRouter = express.Router();

userRouter.get('/profile', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user.toJSON() });
}));

userRouter.patch('/profile', authenticate, asyncHandler(async (req, res) => {
  const allowed = ['name', 'bio', 'phone', 'location', 'skills', 'experience', 'resume', 'avatar'];
  const user = req.user;
  allowed.forEach(key => {
    if (req.body[key] !== undefined) user[key] = req.body[key];
  });
  await user.save();
  res.json({ success: true, data: user.toJSON() });
}));

// ─── Application Routes ──────────────────────────────────────────────────────
const applicationRouter = express.Router();

// GET /api/applications/recruiter/applicants — all applicants for the recruiter's jobs
applicationRouter.get('/recruiter/applicants', authenticate, asyncHandler(async (req, res) => {
  if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
    throw new AppError('Only recruiters can access applicant data', 403);
  }

  const recruiterJobs = await Job.find({ recruiter: req.user._id }).select('_id title');
  const jobIds = recruiterJobs.map(j => j._id);

  const applications = await Application.find({ job: { $in: jobIds } })
    .populate({ path: 'candidate', select: 'name email avatar resume bio skills location phone experience' })
    .populate({ path: 'job', select: 'title location jobType' })
    .sort({ appliedAt: -1 });

  res.json({ success: true, data: applications });
}));

// GET /api/applications/user/applications — candidate's own applications
applicationRouter.get('/user/applications', authenticate, asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate({
      path: 'job',
      select: 'title location jobType salary company',
      populate: { path: 'company', select: 'name logo' }
    })
    .sort({ appliedAt: -1 });

  res.json({ success: true, data: applications });
}));

// PATCH /api/applications/:applicationId/status — recruiter updates status
applicationRouter.patch('/:applicationId/status', authenticate, asyncHandler(async (req, res) => {
  if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
    throw new AppError('Only recruiters can update application status', 403);
  }

  const { status, recruiterNotes, rejectionReason } = req.body;
  const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
  if (!validStatuses.includes(status)) {
    throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
  }

  const application = await Application.findById(req.params.applicationId).populate('job', 'recruiter title');
  if (!application) throw new AppError('Application not found', 404);

  if (application.job.recruiter.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to update this application', 403);
  }

  application.status = status;
  if (recruiterNotes !== undefined) application.recruiterNotes = recruiterNotes;
  if (rejectionReason !== undefined) application.rejectionReason = rejectionReason;
  application.reviewedAt = new Date();
  await application.save();

  // Trigger candidate notification
  try {
    let customMsg = `Your application for ${application.job.title || 'the job'} has been marked as ${status}.`;
    if (status === 'rejected' && rejectionReason) {
      customMsg += ` Reason: ${rejectionReason}`;
    } else if (recruiterNotes) {
      customMsg += ` Note: "${recruiterNotes}"`;
    }
    await Notification.create({
      recipient: application.candidate,
      type: 'application',
      title: status === 'shortlisted' ? 'Application Shortlisted 🎉' : status === 'accepted' ? 'Offer Received! 🎊' : 'Application Update',
      message: customMsg,
      data: { applicationId: application._id }
    });
  } catch (err) {
    console.error('Failed to create candidate notification:', err.message);
  }

  res.json({ success: true, data: application, message: `Application marked as ${status}` });
}));

// POST /api/applications/:jobId/apply — candidate applies
applicationRouter.post('/:jobId/apply', authenticate, asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const candidateId = req.user._id;

  if (req.user.role === 'recruiter') {
    throw new AppError('Recruiters cannot apply to job postings', 403);
  }

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new AppError('Invalid job ID', 400);
  }

  const job = await Job.findById(jobId);
  if (!job) throw new AppError('Job not found', 404);

  if (job.recruiter.toString() === candidateId.toString()) {
    throw new AppError('You cannot apply to your own job posting', 403);
  }

  const alreadyApplied = await Application.findOne({ job: jobId, candidate: candidateId });
  if (alreadyApplied) {
    return res.status(200).json({ success: true, message: 'Already applied to this job', data: alreadyApplied });
  }

  const application = await Application.create({ job: jobId, candidate: candidateId, status: 'pending' });
  await Job.findByIdAndUpdate(jobId, { $addToSet: { applicants: application._id } });
  await User.findByIdAndUpdate(candidateId, { $addToSet: { appliedJobs: jobId } });

  // Trigger recruiter notification
  try {
    await Notification.create({
      recipient: job.recruiter,
      type: 'application',
      title: 'New Application',
      message: `${req.user.name} applied for your job listing: ${job.title}`,
      data: { jobId, applicationId: application._id }
    });
  } catch (err) {
    console.error('Failed to create recruiter notification:', err.message);
  }

  res.status(201).json({ success: true, message: 'Application submitted successfully!', data: application });
}));

// ─── Company Routes ──────────────────────────────────────────────────────────
const companyRouter = express.Router();

// GET /api/companies — list all companies
companyRouter.get('/', asyncHandler(async (req, res) => {
  const companies = await Company.find({});
  const enriched = await Promise.all(companies.map(async (c) => {
    const jobsCount = await Job.countDocuments({ company: c._id, isActive: true });
    return {
      id: c._id,
      _id: c._id,
      name: c.name,
      description: c.description || 'Venture backed scaling tech organization.',
      website: c.website || '',
      logo: c.logo || '💼',
      coverImage: c.coverImage || '',
      location: c.location || 'Remote First',
      industry: c.industry || 'Software / SaaS',
      size: c.size || '51-200',
      socialLinks: c.socialLinks || {},
      isVerified: c.isVerified || false,
      jobsCount: jobsCount
    };
  }));
  res.json({ success: true, data: enriched });
}));

// GET /api/companies/mine — get recruiter's own company
companyRouter.get('/mine', authenticate, asyncHandler(async (req, res) => {
  if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
    throw new AppError('Only recruiters have a company profile', 403);
  }
  const company = await Company.findOne({ recruiter: req.user._id });
  res.json({ success: true, data: company || null });
}));

// PATCH /api/companies/mine — update recruiter's own company
companyRouter.patch('/mine', authenticate, asyncHandler(async (req, res) => {
  if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
    throw new AppError('Only recruiters can update company profile', 403);
  }

  const allowed = ['name', 'description', 'website', 'logo', 'coverImage', 'location', 'industry', 'size', 'socialLinks'];
  const updates = {};
  allowed.forEach(key => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

  const company = await Company.findOneAndUpdate(
    { recruiter: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!company) {
    throw new AppError('Company not found. Post a job first to auto-create your company profile.', 404);
  }

  res.json({ success: true, data: company });
}));

// GET /api/companies/:id — public company profile
companyRouter.get('/:id', asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError('Invalid company ID', 400);
  }
  const company = await Company.findById(req.params.id);
  if (!company) throw new AppError('Company not found', 404);
  res.json({ success: true, data: company });
}));

// ─── Admin Routes ────────────────────────────────────────────────────────────
const adminRouter = express.Router();
adminRouter.get('/users', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, data: [] });
}));
adminRouter.get('/analytics', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, data: {} });
}));

// ─── Notification Routes ──────────────────────────────────────────────────────
const notificationRouter = express.Router();

// GET /api/notifications — get all notifications
notificationRouter.get('/', authenticate, asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ success: true, data: notifications });
}));

// PATCH /api/notifications/:id/read — mark as read
notificationRouter.patch('/:id/read', authenticate, asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  if (!notification) throw new AppError('Notification not found', 404);
  res.json({ success: true, data: notification });
}));

// PATCH /api/notifications/read-all — mark all as read
notificationRouter.patch('/read-all', authenticate, asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  res.json({ success: true, message: 'All notifications marked as read' });
}));

export { 
  userRouter as userRoutes, 
  applicationRouter as applicationRoutes, 
  companyRouter as companyRoutes, 
  adminRouter as adminRoutes,
  notificationRouter as notificationRoutes 
};
