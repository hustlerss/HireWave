import mongoose from 'mongoose';
import User from '../models/User.js';
import { Company, Job } from '../models/index.js';

const seedDatabase = async () => {
  try {
    const companyCount = await Company.countDocuments();
    if (companyCount > 0) {
      console.log('ℹ️ Database already has companies. Skipping seeding.');
      return;
    }

    console.log('🌱 Seeding verified corporate hiring partners and default listings...');

    // 1. Create a default recruiter user
    let recruiter = await User.findOne({ email: 'recruiter@stripe.com' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'Aditya Sen',
        email: 'recruiter@stripe.com',
        password: 'stripepass',
        role: 'recruiter',
        isEmailVerified: true
      });
    }

    // 2. Create standard verified companies
    const companiesToSeed = [
      {
        name: 'Stripe',
        logo: '💳',
        industry: 'FinTech / SaaS',
        size: '1000+',
        raised: '$2.2B Raised',
        description: 'Financial infrastructure for the internet. Stripe provides API solutions that empower millions of online startups and enterprises to accept payments.',
        location: 'San Francisco, CA (Hybrid)',
        website: 'https://stripe.com',
        recruiter: recruiter._id,
        isVerified: true
      },
      {
        name: 'Linear',
        logo: '📐',
        industry: 'Productivity / DevTools',
        size: '51-200',
        raised: '$52M Raised',
        description: 'The issue tracker you’ve been waiting for. Linear helps high-performance engineering teams streamline software development pipelines.',
        location: 'Remote First',
        website: 'https://linear.app',
        recruiter: recruiter._id,
        isVerified: true
      },
      {
        name: 'Vercel',
        logo: '▲',
        industry: 'Cloud Infrastructure',
        size: '201-500',
        raised: '$313M Raised',
        description: 'The frontend cloud for modern builders. Vercel enables developers to host websites that load instantly and scale automatically.',
        location: 'Remote First',
        website: 'https://vercel.com',
        recruiter: recruiter._id,
        isVerified: true
      },
      {
        name: 'Framer',
        logo: '🎨',
        industry: 'Design Tech / SaaS',
        size: '51-200',
        raised: '$48M Raised',
        description: 'Design and publish premium responsive websites in record time. Framer bridges the gap between digital designers and React developers.',
        location: 'Amsterdam, NL (Hybrid)',
        website: 'https://framer.com',
        recruiter: recruiter._id,
        isVerified: true
      },
      {
        name: 'Google',
        logo: '🚀',
        industry: 'Search / AI / Big Tech',
        size: '1000+',
        raised: 'Public',
        description: 'Organizing the world’s information and making it universally accessible. Leading global breakthroughs in AI search and consumer applications.',
        location: 'Mountain View, CA',
        website: 'https://google.com',
        recruiter: recruiter._id,
        isVerified: true
      }
    ];

    const seededCompanies = [];
    for (const c of companiesToSeed) {
      let comp = await Company.findOne({ name: c.name });
      if (!comp) {
        comp = await Company.create(c);
      }
      seededCompanies.push(comp);
    }

    // Connect default recruiter company
    recruiter.company = seededCompanies[0]._id; // Stripe
    await recruiter.save();

    // 3. Create default jobs
    const jobsCount = await Job.countDocuments();
    if (jobsCount === 0) {
      const defaultJobs = [
        {
          title: 'Senior React Developer',
          description: 'We are looking for an experienced React developer to lead our frontend team. You will build user-facing systems that load instantly, handle payment telemetry, and manage premium layout designs using React and TypeScript.',
          company: seededCompanies[0]._id, // Stripe
          recruiter: recruiter._id,
          location: 'San Francisco, CA',
          jobType: 'Full-time',
          experience: 'Senior',
          salary: { min: 140000, max: 180000 },
          skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
          category: 'Engineering',
          workMode: 'Hybrid',
          isFeatured: true
        },
        {
          title: 'Full Stack Engineer',
          description: 'Join our high-performance team to build productivity tooling for world-class development groups. You will work across Node.js backend systems and a highly polished React UI to design scalable, real-time sync databases.',
          company: seededCompanies[1]._id, // Linear
          recruiter: recruiter._id,
          location: 'Remote First',
          jobType: 'Full-time',
          experience: 'Mid',
          salary: { min: 120000, max: 160000 },
          skills: ['TypeScript', 'React', 'GraphQL', 'Node.js', 'PostgreSQL'],
          category: 'Engineering',
          workMode: 'Remote',
          isFeatured: true
        },
        {
          title: 'UI/UX Frontend Engineer',
          description: 'Design and deploy cutting-edge response clouds and website design systems. You will collaborate on advanced web tools to close the gap between premium design architectures and React web rendering.',
          company: seededCompanies[2]._id, // Vercel
          recruiter: recruiter._id,
          location: 'Remote First',
          jobType: 'Full-time',
          experience: 'Mid',
          salary: { min: 130000, max: 170000 },
          skills: ['Next.js', 'React', 'Node.js', 'Tailwind', 'Figma'],
          category: 'Engineering',
          workMode: 'Remote',
          isFeatured: true
        }
      ];

      await Job.create(defaultJobs);
      console.log('✅ Default corporate listings seeded successfully.');
    }
  } catch (err) {
    console.error(`❌ Seeding failed: ${err.message}`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hirewave', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Trigger seed
    await seedDatabase();
    
    return conn;
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
