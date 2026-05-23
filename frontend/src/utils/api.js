const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for mapping roles between Frontend UI and Backend Database models
// UI Roles: 'job-seeker', 'company'
// DB Roles: 'candidate', 'recruiter'
const roleMap = {
  toBackend: {
    'job-seeker': 'candidate',
    'company': 'recruiter',
  },
  toFrontend: {
    'candidate': 'job-seeker',
    'recruiter': 'company',
  }
};

export const mapRoleToBackend = (role) => roleMap.toBackend[role] || 'candidate';
export const mapRoleToFrontend = (role) => roleMap.toFrontend[role] || 'job-seeker';

// Safe localStorage helper to prevent crashes in sandboxed iframe environments
const safeStorage = {
  getItem: (key) => {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
  setItem: (key, value) => {
    try { localStorage.setItem(key, value); } catch (e) {}
  },
  removeItem: (key) => {
    try { localStorage.removeItem(key); } catch (e) {}
  }
};

// Generic API call wrapper
async function request(endpoint, options = {}) {
  const token = safeStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export const api = {
  auth: {
    login: async (email, password) => {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.token) safeStorage.setItem('token', data.token);
      if (data.user) {
        data.user.role = mapRoleToFrontend(data.user.role);
        data.user.appliedJobs = data.user.appliedJobs || [];
      }
      return data;
    },

    register: async (name, email, password, role) => {
      const mappedRole = mapRoleToBackend(role);
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role: mappedRole }),
      });
      if (data.token) safeStorage.setItem('token', data.token);
      if (data.user) data.user.role = mapRoleToFrontend(data.user.role);
      return data;
    },

    getProfile: async () => {
      const data = await request('/users/profile');
      if (data.data) {
        data.data.role = mapRoleToFrontend(data.data.role);
        data.data.appliedJobs = data.data.appliedJobs || [];
      }
      return data;
    },

    logout: () => { safeStorage.removeItem('token'); }
  },

  users: {
    updateProfile: async (profileData) => {
      const data = await request('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(profileData),
      });
      if (data.data) {
        data.data.role = mapRoleToFrontend(data.data.role);
      }
      return data;
    }
  },

  jobs: {
    getAll: async () => {
      const data = await request('/jobs?limit=100');
      return (data.data || []).map(job => ({
        id: job._id,
        title: job.title,
        company: job.company?.name || 'HireWave Partner',
        logo: job.company?.logo || '💼',
        location: job.location,
        salary: job.salary ? `$${(job.salary.min / 1000)}k - $${(job.salary.max / 1000)}k` : '$100k - $150k',
        type: job.jobType,
        level: job.experience === 'Mid' ? 'Mid-level' : job.experience,
        description: job.description,
        skills: job.skills || [],
        benefits: job.benefits || [],
        requirements: job.requirements || [],
        companyObj: job.company || {},
        applicants: job.applicants?.length || 0,
        posted: 'Recently',
        featured: job.isFeatured || false,
        category: job.category || 'Engineering',
        workMode: job.workMode,
        applicationDeadline: job.applicationDeadline,
      }));
    },

    getRecruiterJobs: async () => {
      const data = await request('/jobs/recruiter/jobs');
      return (data.data || []).map(job => ({
        id: job._id,
        title: job.title,
        company: job.company?.name || 'HireWave Partner',
        logo: job.company?.logo || '💼',
        location: job.location,
        salary: job.salary ? `$${(job.salary.min / 1000)}k - $${(job.salary.max / 1000)}k` : '$100k - $150k',
        type: job.jobType,
        level: job.experience === 'Mid' ? 'Mid-level' : job.experience,
        description: job.description,
        skills: job.skills || [],
        benefits: job.benefits || [],
        requirements: job.requirements || [],
        companyObj: job.company || {},
        applicants: job.applicants?.length || 0,
        posted: new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        featured: job.isFeatured || false,
        category: job.category || 'Engineering',
        workMode: job.workMode,
        isActive: job.isActive,
        applicationDeadline: job.applicationDeadline,
        _rawId: job._id,
      }));
    },

    create: async (jobData) => {
      // Parse salary budget string (e.g. "$140,000 - $180,000" or "$140k - $180k")
      let minSalary = 100000;
      let maxSalary = 150000;
      try {
        const matches = jobData.salary.match(/\d+[\d,k]*/g);
        if (matches && matches.length >= 2) {
          const parseSalary = (str) => {
            let clean = str.replace(/,/g, '').toLowerCase();
            if (clean.endsWith('k')) return parseInt(clean) * 1000;
            return parseInt(clean);
          };
          minSalary = parseSalary(matches[0]);
          maxSalary = parseSalary(matches[1]);
        }
      } catch (e) {
        console.error('Salary parsing error:', e);
      }

      const skillsArray = jobData.skills
        ? jobData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : ['React', 'TypeScript', 'Node.js'];

      const benefitsArray = jobData.benefits
        ? jobData.benefits.split(',').map(b => b.trim()).filter(Boolean)
        : [];

      const requirementsArray = jobData.requirements
        ? jobData.requirements.split(',').map(r => r.trim()).filter(Boolean)
        : [];

      const body = {
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        jobType: jobData.jobType || 'Full-time',
        experience: jobData.experience || 'Mid',
        salary: { min: minSalary, max: maxSalary },
        skills: skillsArray,
        benefits: benefitsArray,
        requirements: requirementsArray,
        category: jobData.category || 'Engineering',
        workMode: jobData.workMode || 'Hybrid',
        applicationDeadline: jobData.applicationDeadline || undefined,
      };

      const data = await request('/jobs', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return data.data;
    }
  },

  applications: {
    apply: async (jobId) => {
      return await request(`/applications/${jobId}/apply`, { method: 'POST' });
    },

    getUserApplications: async () => {
      return await request('/applications/user/applications');
    },

    getRecruiterApplicants: async () => {
      return await request('/applications/recruiter/applicants');
    },

    updateStatus: async (applicationId, status) => {
      return await request(`/applications/${applicationId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    }
  },

  companies: {
    getAll: async () => {
      return await request('/companies');
    },
    getMine: async () => {
      return await request('/companies/mine');
    },
    updateMine: async (companyData) => {
      return await request('/companies/mine', {
        method: 'PATCH',
        body: JSON.stringify(companyData),
      });
    }
  }
};
