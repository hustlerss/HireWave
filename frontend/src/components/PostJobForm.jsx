import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X, Sparkles, Plus, Trash2 } from 'lucide-react';
import { buttonHover } from '../utils/animations';

export const PostJobForm = ({ setShowPostForm, onAddJob, editingJob, onUpdateJob }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    location: '',
    jobType: 'Full-time',
    workMode: 'Hybrid',
    experience: 'Mid',
    category: 'Engineering',
    skills: '',
    requirements: '',
    benefits: '',
    applicationDeadline: '',
  });

  useEffect(() => {
    if (editingJob) {
      let salaryStr = '';
      if (typeof editingJob.salary === 'string') {
        salaryStr = editingJob.salary;
      } else if (editingJob.salary && typeof editingJob.salary === 'object') {
        salaryStr = `$${(editingJob.salary.min / 1000)}k - $${(editingJob.salary.max / 1000)}k`;
      }

      setFormData({
        title: editingJob.title || '',
        description: editingJob.description || '',
        salary: salaryStr || '',
        location: editingJob.location || '',
        jobType: editingJob.type || editingJob.jobType || 'Full-time',
        workMode: editingJob.workMode || 'Hybrid',
        experience: editingJob.level === 'Mid-level' ? 'Mid' : (editingJob.experience || 'Mid'),
        category: editingJob.category || 'Engineering',
        skills: Array.isArray(editingJob.skills) ? editingJob.skills.join(', ') : '',
        requirements: Array.isArray(editingJob.requirements) ? editingJob.requirements.join(', ') : '',
        benefits: Array.isArray(editingJob.benefits) ? editingJob.benefits.join(', ') : '',
        applicationDeadline: editingJob.applicationDeadline ? new Date(editingJob.applicationDeadline).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        salary: '',
        location: '',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        experience: 'Mid',
        category: 'Engineering',
        skills: '',
        requirements: '',
        benefits: '',
        applicationDeadline: '',
      });
    }
  }, [editingJob]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

  const handlePublish = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingJob) {
        if (!onUpdateJob) return;
        await onUpdateJob(editingJob.id || editingJob._id, formData);
        window.alert('Requisition updated successfully!');
      } else {
        if (!onAddJob) return;
        await onAddJob(formData);
        window.alert('Requisition published successfully!');
      }
      setShowPostForm(false);
    } catch (err) {
      console.error('PostJobForm submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none rounded-xl text-sm transition-all duration-300 font-medium text-slate-800 placeholder-slate-400';
  const labelCls = 'block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 sm:p-8 rounded-3xl border relative overflow-hidden mb-6"
    >
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />

      <div className="flex justify-between items-center mb-6 pt-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-blue-500" />
            {editingJob ? 'Edit Job Requisition' : 'Create Job Requisition'}
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            {editingJob ? 'Modify vacancy details and propagate changes across the network' : 'Fill all fields to publish your vacancy in the HireWave network'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowPostForm(false)}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handlePublish} className="space-y-5">

        {/* Row 1: Title + Location */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Job Title *</label>
            <input
              required
              value={formData.title}
              onChange={set('title')}
              placeholder="e.g. Senior Staff Engineer"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Location *</label>
            <input
              required
              value={formData.location}
              onChange={set('location')}
              placeholder="e.g. San Francisco, CA"
              className={inputCls}
            />
          </div>
        </div>

        {/* Row 2: Salary + Category */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Salary Budget *</label>
            <input
              required
              value={formData.salary}
              onChange={set('salary')}
              placeholder="e.g. $140,000 - $180,000"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Category *</label>
            <select value={formData.category} onChange={set('category')} className={inputCls + ' cursor-pointer'}>
              {['Engineering', 'Design', 'Product', 'Marketing', 'Finance', 'Sales', 'Operations', 'Data Science', 'DevOps', 'Other'].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Job Type + Work Mode + Experience */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Job Type *</label>
            <select value={formData.jobType} onChange={set('jobType')} className={inputCls + ' cursor-pointer'}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Work Mode *</label>
            <select value={formData.workMode} onChange={set('workMode')} className={inputCls + ' cursor-pointer'}>
              <option>Hybrid</option>
              <option>Remote</option>
              <option>On-site</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Experience *</label>
            <select value={formData.experience} onChange={set('experience')} className={inputCls + ' cursor-pointer'}>
              <option>Entry</option>
              <option>Mid</option>
              <option>Senior</option>
            </select>
          </div>
        </div>

        {/* Row 4: Skills + Deadline */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Required Skills *</label>
            <input
              value={formData.skills}
              onChange={set('skills')}
              placeholder="e.g. React, Node.js, TypeScript"
              className={inputCls}
            />
            <p className="text-[10px] text-slate-400 mt-1 pl-1">Separate skills with commas</p>
          </div>
          <div>
            <label className={labelCls}>Application Deadline</label>
            <input
              type="date"
              value={formData.applicationDeadline}
              onChange={set('applicationDeadline')}
              min={new Date().toISOString().split('T')[0]}
              className={inputCls}
            />
          </div>
        </div>

        {/* Row 5: Qualifications + Benefits */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Ideal Qualifications</label>
            <input
              value={formData.requirements}
              onChange={set('requirements')}
              placeholder="e.g. 5+ Years React, High technical agency"
              className={inputCls}
            />
            <p className="text-[10px] text-slate-400 mt-1 pl-1">Separate qualifications with commas</p>
          </div>
          <div>
            <label className={labelCls}>Corporate Benefits</label>
            <input
              value={formData.benefits}
              onChange={set('benefits')}
              placeholder="e.g. Remote stipend, Health insurance, Unlimited PTO"
              className={inputCls}
            />
            <p className="text-[10px] text-slate-400 mt-1 pl-1">Separate benefits with commas</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelCls}>Job Description *</label>
          <textarea
            required
            value={formData.description}
            onChange={set('description')}
            placeholder="Describe key responsibilities, qualifications, team culture, and tech stack requirements..."
            rows="5"
            className={inputCls + ' resize-none rounded-2xl'}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-100/60 mt-2">
          <motion.button
            variants={buttonHover}
            whileHover={isSubmitting ? {} : 'whileHover'}
            whileTap={isSubmitting ? {} : 'whileTap'}
            type="submit"
            disabled={isSubmitting}
            className={`px-7 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition duration-300 flex items-center gap-2 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {editingJob ? 'Saving...' : 'Publishing...'}
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                {editingJob ? 'Save Changes' : 'Publish Requisition'}
              </>
            )}
          </motion.button>

          <button
            type="button"
            onClick={() => setShowPostForm(false)}
            className="px-6 py-3.5 border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-50/50 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};
