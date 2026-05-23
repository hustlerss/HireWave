import express from 'express';
import { 
  createJob, 
  getJobs, 
  getJobById, 
  updateJob, 
  deleteJob,
  getFeaturedJobs,
  getRecruiterJobs 
} from '../controllers/jobController.js';
import { authenticate, isRecruiter, asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/featured', getFeaturedJobs);
router.get('/', getJobs);
router.get('/recruiter/jobs', authenticate, isRecruiter, getRecruiterJobs);
router.get('/:id', getJobById);

router.post('/', authenticate, isRecruiter, createJob);
router.patch('/:id', authenticate, isRecruiter, updateJob);
router.delete('/:id', authenticate, isRecruiter, deleteJob);

export default router;
