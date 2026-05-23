export const dummyJobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'Tech Innovations Inc',
    logo: '🚀',
    location: 'San Francisco, CA',
    salary: '$150k - $200k',
    type: 'Full-time',
    level: 'Senior',
    description: 'We are looking for an experienced React developer to lead our frontend team...',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    applicants: 124,
    posted: '2 days ago',
    featured: true,
    category: 'Frontend'
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'StartUp Hub',
    logo: '⭐',
    location: 'New York, NY',
    salary: '$120k - $160k',
    type: 'Full-time',
    level: 'Mid-level',
    description: 'Join our growing startup and help us build the future...',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    applicants: 89,
    posted: '1 day ago',
    featured: true,
    category: 'Full Stack'
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Design Studio Co',
    logo: '🎨',
    location: 'Los Angeles, CA',
    salary: '$100k - $140k',
    type: 'Full-time',
    level: 'Mid-level',
    description: 'Create beautiful and functional user experiences...',
    skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
    applicants: 156,
    posted: '3 days ago',
    featured: true,
    category: 'Design'
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'Cloud Systems Ltd',
    logo: '☁️',
    location: 'Remote',
    salary: '$130k - $170k',
    type: 'Full-time',
    level: 'Senior',
    description: 'Manage and optimize cloud infrastructure...',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    applicants: 67,
    posted: '5 days ago',
    featured: false,
    category: 'Backend'
  },
  {
    id: 5,
    title: 'Backend Developer',
    company: 'Enterprise Solutions',
    logo: '💼',
    location: 'Boston, MA',
    salary: '$110k - $150k',
    type: 'Full-time',
    level: 'Mid-level',
    description: 'Build scalable backend systems...',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
    applicants: 98,
    posted: '1 week ago',
    featured: false,
    category: 'Backend'
  },
  {
    id: 6,
    title: 'Product Manager',
    company: 'Growth Tech',
    logo: '📊',
    location: 'Seattle, WA',
    salary: '$140k - $180k',
    type: 'Full-time',
    level: 'Senior',
    description: 'Lead product strategy and development...',
    skills: ['Product Strategy', 'Analytics', 'User Research', 'Leadership'],
    applicants: 112,
    posted: '4 days ago',
    featured: false,
    category: 'Product'
  },
];

export const testimonials = [
  { name: 'Sarah Chen', role: 'Senior Developer at Google', text: 'Found my dream job in just 2 weeks!' },
  { name: 'Michael Torres', role: 'Startup Founder', text: 'Best platform for hiring talented engineers' },
  { name: 'Emma Wilson', role: 'UX Designer', text: 'Great community and amazing opportunities' },
];

export const faqs = [
  { q: 'How do I apply for jobs?', a: 'Simply browse jobs, click Apply, and submit your resume. Our AI will match you with relevant positions.' },
  { q: 'Is there a cost for job seekers?', a: 'No! Job seeking is completely free. We only charge companies for posting jobs.' },
  { q: 'How long does the application process take?', a: 'Most companies respond within 3-5 business days. You can track your applications in your dashboard.' },
  { q: 'Can I save jobs for later?', a: 'Yes! Click the heart icon to bookmark jobs and view them anytime from your saved section.' },
  { q: 'How do I post a job as a company?', a: 'Sign up as a company, complete your profile, and use our intuitive job posting form.' },
];

export const companies = ['Google', 'Meta', 'Apple', 'Microsoft', 'Amazon'];

export const dummyCompanies = [
  {
    id: 'stripe',
    name: 'Stripe',
    logo: '💳',
    industry: 'FinTech / SaaS',
    stage: 'Series I',
    size: '5,000+ Employees',
    raised: '$2.2B Raised',
    description: 'Financial infrastructure for the internet. Stripe provides API solutions that empower millions of online startups and enterprises to accept payments.',
    jobsCount: 3,
    techStack: ['Ruby', 'React', 'Node.js', 'PostgreSQL'],
    location: 'San Francisco, CA (Hybrid)',
    rating: 4.8
  },
  {
    id: 'linear',
    name: 'Linear',
    logo: '📐',
    industry: 'Productivity / DevTools',
    stage: 'Series B',
    size: '50-100 Employees',
    raised: '$52M Raised',
    description: 'The issue tracker you’ve been waiting for. Linear helps high-performance engineering teams streamline software development pipelines.',
    jobsCount: 2,
    techStack: ['TypeScript', 'React', 'GraphQL', 'Node.js'],
    location: 'Remote First',
    rating: 4.9
  },
  {
    id: 'vercel',
    name: 'Vercel',
    logo: '▲',
    industry: 'Cloud Infrastructure',
    stage: 'Series D',
    size: '300-500 Employees',
    raised: '$313M Raised',
    description: 'The frontend cloud for modern builders. Vercel enables developers to host websites that load instantly and scale automatically.',
    jobsCount: 4,
    techStack: ['Next.js', 'React', 'Node.js', 'AWS'],
    location: 'Remote First',
    rating: 4.8
  },
  {
    id: 'framer',
    name: 'Framer',
    logo: '🎨',
    industry: 'Design Tech / SaaS',
    stage: 'Series B',
    size: '100-200 Employees',
    raised: '$48M Raised',
    description: 'Design and publish premium responsive websites in record time. Framer bridges the gap between digital designers and React developers.',
    jobsCount: 2,
    techStack: ['React', 'WebGL', 'TypeScript', 'Tailwind'],
    location: 'Amsterdam, NL (Hybrid)',
    rating: 4.7
  },
  {
    id: 'google',
    name: 'Google',
    logo: '🚀',
    industry: 'Search / AI / Big Tech',
    stage: 'Public',
    size: '150,000+ Employees',
    raised: 'IPO Completed',
    description: 'Organizing the world’s information and making it universally accessible. Leading global breakthroughs in AI search and consumer applications.',
    jobsCount: 5,
    techStack: ['Go', 'Python', 'React', 'C++', 'TensorFlow'],
    location: 'Mountain View, CA',
    rating: 4.6
  }
];

