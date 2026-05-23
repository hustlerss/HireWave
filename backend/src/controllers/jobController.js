import { Job, Application, Company } from '../models/index.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

export const createJob = asyncHandler(async (req, res) => {
  const { title, description, location, jobType, experience, salary, skills, category, workMode, benefits, requirements, applicationDeadline } = req.body;

  let companyId = req.user.company;
  if (!companyId) {
    const companyName = `${req.user.name}'s Enterprise`;
    let company = await Company.findOne({ name: companyName });
    if (!company) {
      company = await Company.create({
        name: companyName,
        description: 'Venture backed scaling tech organization.',
        location: location || 'Remote First',
        industry: 'Software / SaaS',
        size: '51-200',
        recruiter: req.user._id,
        isVerified: true
      });
    }
    companyId = company._id;
    req.user.company = companyId;
    await req.user.save();
  }

  const job = await Job.create({
    title,
    description,
    location,
    jobType,
    experience,
    salary,
    skills,
    category,
    workMode,
    benefits,
    requirements,
    applicationDeadline,
    recruiter: req.user._id,
    company: companyId
  });

  res.status(201).json({ success: true, data: job });
});

export const getJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, location, category, jobType, experience, workMode, isFeatured } = req.query;

  const filter = { isActive: true };
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (category) filter.category = category;
  if (jobType) filter.jobType = jobType;
  if (experience) filter.experience = experience;
  if (workMode) filter.workMode = workMode;
  if (isFeatured === 'true') filter.isFeatured = true;

  const skip = (page - 1) * limit;

  const jobs = await Job.find(filter)
    .populate('company', 'name logo')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Job.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: jobs,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    }
  });
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('company').populate('applicants');

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  res.status(200).json({ success: true, data: job });
});

export const updateJob = asyncHandler(async (req, res) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this job', 403);
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this job', 403);
  }

  await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: 'Job deleted successfully' });
});

export const getFeaturedJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ isFeatured: true, isActive: true })
    .populate('company', 'name logo')
    .limit(10)
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: jobs });
});

export const getRecruiterJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id })
    .populate('company')
    .populate('applicants');

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.isActive).length,
    totalApplicants: jobs.reduce((acc, job) => acc + job.applicants.length, 0)
  };

  res.status(200).json({ success: true, data: jobs, stats });
});
