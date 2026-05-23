import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { Company, Job } from '../models/index.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hirewave';
    console.log(`🔌 Connecting to MongoDB for seeding: ${mongoUri}`);
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🧹 Clearing existing database collections...');
    await Job.deleteMany({});
    await Company.deleteMany({});
    await User.deleteMany({});

    console.log('👤 Creating default recruiter user...');
    const recruiterUser = await User.create({
      name: 'Aditya Ranade',
      email: 'recruiter@hirewave.io',
      password: 'password123', // Will be hashed automatically by userSchema pre-save hook
      role: 'recruiter',
      isEmailVerified: true
    });
    console.log(`✅ Default recruiter created: ${recruiterUser.email}`);

    console.log('🏢 Creating companies...');
    const companyData = [
      {
        name: 'Stripe',
        logo: '💳',
        industry: 'FinTech / SaaS',
        size: '1000+',
        location: 'San Francisco, CA',
        description: 'Financial infrastructure for the internet. Stripe provides API solutions that empower millions of online startups and enterprises to accept payments.',
        recruiter: recruiterUser._id
      },
      {
        name: 'Linear',
        logo: '📐',
        industry: 'Productivity / DevTools',
        size: '51-200',
        location: 'Remote First',
        description: 'The issue tracker you’ve been waiting for. Linear helps high-performance engineering teams streamline software development pipelines.',
        recruiter: recruiterUser._id
      },
      {
        name: 'Vercel',
        logo: '▲',
        industry: 'Cloud Infrastructure',
        size: '201-500',
        location: 'Remote First',
        description: 'The frontend cloud for modern builders. Vercel enables developers to host websites that load instantly and scale automatically.',
        recruiter: recruiterUser._id
      },
      {
        name: 'Framer',
        logo: '🎨',
        industry: 'Design Tech / SaaS',
        size: '51-200',
        location: 'Amsterdam, NL',
        description: 'Design and publish premium responsive websites in record time. Framer bridges the gap between digital designers and React developers.',
        recruiter: recruiterUser._id
      },
      {
        name: 'Google',
        logo: '🚀',
        industry: 'Search / AI / Big Tech',
        size: '1000+',
        location: 'Mountain View, CA',
        description: 'Organizing the world’s information and making it universally accessible. Leading global breakthroughs in AI search and consumer applications.',
        recruiter: recruiterUser._id
      },
      {
        name: 'Tech Innovations Inc',
        logo: '🚀',
        industry: 'Software Engineering',
        size: '201-500',
        location: 'San Francisco, CA',
        description: 'Creating premium next-generation SaaS tools and developer workflows.',
        recruiter: recruiterUser._id
      },
      {
        name: 'StartUp Hub',
        logo: '⭐',
        industry: 'Venture Incubation',
        size: '1-50',
        location: 'New York, NY',
        description: 'Bridging the gap between early-stage talent and unicorn scaling directories.',
        recruiter: recruiterUser._id
      },
      {
        name: 'Design Studio Co',
        logo: '🎨',
        industry: 'Creative Agency',
        size: '51-200',
        location: 'Los Angeles, CA',
        description: 'World-class digital experiences and micro-interaction product consultancies.',
        recruiter: recruiterUser._id
      },
      {
        name: 'Cloud Systems Ltd',
        logo: '☁️',
        industry: 'Infrastructure Services',
        size: '201-500',
        location: 'Seattle, WA',
        description: 'Managing secure hybrid architectures for enterprise scaling agencies.',
        recruiter: recruiterUser._id
      },
      {
        name: 'Enterprise Solutions',
        logo: '💼',
        industry: 'IT Services',
        size: '1000+',
        location: 'Boston, MA',
        description: 'Connecting multinational databases with scalable pipeline management.',
        recruiter: recruiterUser._id
      },
      {
        name: 'Growth Tech',
        logo: '📊',
        industry: 'Business Analytics',
        size: '51-200',
        location: 'Seattle, WA',
        description: 'Harnessing machine learning and customer retention engines.',
        recruiter: recruiterUser._id
      }
    ];

    const companies = {};
    for (const data of companyData) {
      const company = await Company.create(data);
      companies[company.name] = company;
    }
    console.log(`✅ Created ${Object.keys(companies).length} companies.`);

    // Set the first company as recruiter's company for dashboard profile compatibility
    recruiterUser.company = companies['Stripe']._id;
    await recruiterUser.save();

    console.log('💼 Seeding jobs...');
    const jobsData = [
      {
        title: 'Senior React Developer',
        companyName: 'Tech Innovations Inc',
        location: 'San Francisco, CA',
        salary: { min: 150000, max: 200000 },
        jobType: 'Full-time',
        experience: 'Senior',
        description: 'We are looking for an experienced React developer to lead our frontend team. You will drive architecture decisions, guide junior devs, and craft highly responsive, premium micro-animations.',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        category: 'Frontend',
        workMode: 'Hybrid',
        isFeatured: true
      },
      {
        title: 'Full Stack Engineer',
        companyName: 'StartUp Hub',
        location: 'New York, NY',
        salary: { min: 120000, max: 160000 },
        jobType: 'Full-time',
        experience: 'Mid',
        description: 'Join our growing startup and help us build the future of collaborative workspace hubs. You should have broad knowledge across frontend state machines and scalable databases.',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        category: 'Full Stack',
        workMode: 'On-site',
        isFeatured: true
      },
      {
        title: 'UI/UX Designer',
        companyName: 'Design Studio Co',
        location: 'Los Angeles, CA',
        salary: { min: 100000, max: 140000 },
        jobType: 'Full-time',
        experience: 'Mid',
        description: 'Create beautiful, sleek, and highly tactile user experiences. You will design prototypes, build premium design systems, and collaborate with frontend developers to bring designs to life.',
        skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
        category: 'Design',
        workMode: 'Hybrid',
        isFeatured: true
      },
      {
        title: 'DevOps Engineer',
        companyName: 'Cloud Systems Ltd',
        location: 'Remote First',
        salary: { min: 130000, max: 170000 },
        jobType: 'Full-time',
        experience: 'Senior',
        description: 'Manage and optimize cloud deployment pipelines. We scale architectures using Kubernetes and AWS, and we love modular infrastructure-as-code.',
        skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
        category: 'Backend',
        workMode: 'Remote',
        isFeatured: false
      },
      {
        title: 'Backend Developer',
        companyName: 'Enterprise Solutions',
        location: 'Boston, MA',
        salary: { min: 110000, max: 150000 },
        jobType: 'Full-time',
        experience: 'Mid',
        description: 'Build robust, highly scalable, and modular backend endpoints. You will work on schema modeling, performance tuning, and Redis caching configurations.',
        skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
        category: 'Backend',
        workMode: 'On-site',
        isFeatured: false
      },
      {
        title: 'Product Manager',
        companyName: 'Growth Tech',
        location: 'Seattle, WA',
        salary: { min: 140000, max: 180000 },
        jobType: 'Full-time',
        experience: 'Senior',
        description: 'Own product strategy, map roadmaps, and analyze customer behavior analytics. You will interface directly with engineering, design, and growth marketing teams.',
        skills: ['Product Strategy', 'Analytics', 'User Research', 'Leadership'],
        category: 'Product',
        workMode: 'Hybrid',
        isFeatured: false
      }
    ];

    for (const j of jobsData) {
      const company = companies[j.companyName];
      await Job.create({
        title: j.title,
        description: j.description,
        location: j.location,
        jobType: j.jobType,
        experience: j.experience,
        salary: j.salary,
        skills: j.skills,
        category: j.category,
        workMode: j.workMode,
        isFeatured: j.isFeatured,
        company: company._id,
        recruiter: recruiterUser._id
      });
    }

    console.log('🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
