import mongoose from 'mongoose';
import User from '../models/User.js';
import { Company, Job, Application, Notification } from '../models/index.js';

const seedDatabase = async () => {
  try {
    // 1. Create a default recruiter user (always guaranteed to exist)
    let recruiter = await User.findOne({ email: 'recruiter@stripe.com' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'Aditya Sen',
        email: 'recruiter@stripe.com',
        password: 'stripepass',
        role: 'recruiter',
        isEmailVerified: true
      });
      console.log('🌱 Default recruiter account (recruiter@stripe.com / stripepass) seeded successfully.');
    }

    // 1a. Create a second recruiter user for Linear
    let recruiter2 = await User.findOne({ email: 'recruiter2@linear.app' });
    if (!recruiter2) {
      recruiter2 = await User.create({
        name: 'Vikram Seth',
        email: 'recruiter2@linear.app',
        password: 'linearpass',
        role: 'recruiter',
        isEmailVerified: true
      });
      console.log('🌱 Second recruiter account (recruiter2@linear.app / linearpass) seeded successfully.');
    }

    // 1b. Create candidate demo account 1 (seeker@hirewave.io / seekerpass)
    let candidate1 = await User.findOne({ email: 'seeker@hirewave.io' });
    if (!candidate1) {
      candidate1 = await User.create({
        name: 'Rohan Sharma',
        email: 'seeker@hirewave.io',
        password: 'seekerpass',
        role: 'candidate',
        skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'TailwindCSS'],
        experience: 3,
        bio: 'Highly energetic frontend systems designer specialized in React hooks, Framer Motion, and CSS v4 grid layouts.',
        location: 'Mumbai, MH, India',
        phone: '+91 99999 88888',
        resume: 'https://drive.google.com/file/d/demo-seeker-resume/view',
        isEmailVerified: true
      });
      console.log('🌱 Default candidate account 1 (seeker@hirewave.io / seekerpass) seeded successfully.');
    }

    // 1c. Create candidate demo account 2 (ajay@gmail.com / ajaypass)
    let candidate2 = await User.findOne({ email: 'ajay@gmail.com' });
    if (!candidate2) {
      candidate2 = await User.create({
        name: 'Ajay Devgan',
        email: 'ajay@gmail.com',
        password: 'ajaypass',
        role: 'candidate',
        skills: ['Node.js', 'Express', 'MongoDB', 'Docker', 'AWS'],
        experience: 5,
        bio: 'Backend wizard passionate about Express routing, Mongoose indexing, and CI/CD pipelines.',
        location: 'Pune, MH, India',
        phone: '+91 98888 77777',
        resume: 'https://drive.google.com/file/d/demo-wizard-resume/view',
        isEmailVerified: true
      });
      console.log('🌱 Default candidate account 2 (ajay@gmail.com / ajaypass) seeded successfully.');
    } else {
      // Update existing candidate2 if empty
      if (!candidate2.skills || candidate2.skills.length === 0) {
        candidate2.skills = ['Node.js', 'Express', 'MongoDB', 'Docker', 'AWS'];
        candidate2.experience = 5;
        candidate2.bio = 'Backend wizard passionate about Express routing, Mongoose indexing, and CI/CD pipelines.';
        candidate2.location = 'Pune, MH, India';
        candidate2.phone = '+91 98888 77777';
        candidate2.resume = 'https://drive.google.com/file/d/demo-wizard-resume/view';
        await candidate2.save();
      }
    }

    const companyCount = await Company.countDocuments();
    let seededCompanies = [];
    if (companyCount === 0) {
      console.log('🌱 Seeding verified corporate hiring partners and default listings...');

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

      recruiter2.company = seededCompanies[1]._id; // Linear
      await recruiter2.save();
    } else {
      seededCompanies = await Company.find({}).sort({ createdAt: 1 });
    }

    // Proactively make sure recruiters have companies linked
    if (seededCompanies.length > 1) {
      if (!recruiter.company) {
        recruiter.company = seededCompanies[0]._id;
        await recruiter.save();
      }
      if (!recruiter2.company) {
        recruiter2.company = seededCompanies[1]._id;
        await recruiter2.save();
      }
    }

    // 3. Create default jobs
    const jobsCount = await Job.countDocuments();
    if (jobsCount === 0 && seededCompanies.length > 0) {
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
          recruiter: recruiter2._id,
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

    // Make sure Linear job is assigned to Vikram Seth (recruiter2) for dynamic multi-tenant demo clarity
    if (seededCompanies.length > 1 && recruiter2) {
      const linearJob = await Job.findOne({ title: 'Full Stack Engineer', company: seededCompanies[1]._id });
      if (linearJob && linearJob.recruiter.toString() !== recruiter2._id.toString()) {
        linearJob.recruiter = recruiter2._id;
        await linearJob.save();
        console.log('🌱 Proactively updated Linear job ownership to Vikram Seth (recruiter2).');
      }
    }

    // 4. Seed real E2E applications & notifications
    const applicationCount = await Application.countDocuments();
    if (applicationCount === 0) {
      const stripeJob = await Job.findOne({ recruiter: recruiter._id });
      const linearJob = await Job.findOne({ title: 'Full Stack Engineer' });

      if (stripeJob && candidate1) {
        const app1 = await Application.create({
          job: stripeJob._id,
          candidate: candidate1._id,
          status: 'shortlisted',
          recruiterNotes: 'We were highly impressed by your portfolio!',
          appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        });
        await Job.findByIdAndUpdate(stripeJob._id, { $addToSet: { applicants: app1._id } });
        await User.findByIdAndUpdate(candidate1._id, { $addToSet: { appliedJobs: stripeJob._id } });

        // Add a notification for candidate1 (Rohan)
        await Notification.create({
          recipient: candidate1._id,
          type: 'application',
          title: 'Application Shortlisted 🎉',
          message: `Your application for Senior React Developer at Stripe has been shortlisted!`,
          data: { applicationId: app1._id }
        });
      }

      if (linearJob && candidate2) {
        const app2 = await Application.create({
          job: linearJob._id,
          candidate: candidate2._id,
          status: 'reviewed',
          recruiterNotes: 'Undergoing technical screening review.',
          appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        });
        await Job.findByIdAndUpdate(linearJob._id, { $addToSet: { applicants: app2._id } });
        await User.findByIdAndUpdate(candidate2._id, { $addToSet: { appliedJobs: linearJob._id } });

        // Add a notification for candidate2 (Ajay)
        await Notification.create({
          recipient: candidate2._id,
          type: 'application',
          title: 'Application Under Review',
          message: `Your application for Full Stack Engineer at Linear is currently under review.`,
          data: { applicationId: app2._id }
        });
      }
      console.log('✅ Default candidate applications & notifications seeded successfully.');
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
