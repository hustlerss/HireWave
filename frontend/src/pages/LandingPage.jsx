import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, DollarSign, Star, Heart, TrendingUp, Users, CheckCircle, 
  ArrowRight, Shield, Zap, Award, Sparkles, Clock, ChevronLeft, ChevronRight, Play,
  Briefcase
} from 'lucide-react';
import { testimonials, faqs, companies } from '../data/dummyData';
import { fadeInUp, staggerContainer, glowHover, scaleUp, buttonHover } from '../utils/animations';
import { FAQItem } from '../components/FAQItem';
import { Footer } from '../components/Footer';

export const LandingPage = ({ setCurrentPage, setUser, jobs, user }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeCategoryTab, setActiveCategoryTab] = useState('All');

  // Auto testimonial slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const categoriesList = [
    { name: 'All', count: jobs.length, icon: Sparkles },
    { name: 'Frontend', count: jobs.filter(j => j.category === 'Frontend').length, icon: Star },
    { name: 'Backend', count: jobs.filter(j => j.category === 'Backend').length, icon: Zap },
    { name: 'Full Stack', count: jobs.filter(j => j.category === 'Full Stack').length, icon: TrendingUp },
    { name: 'Design', count: jobs.filter(j => j.category === 'Design').length, icon: Award },
    { name: 'Product', count: jobs.filter(j => j.category === 'Product').length, icon: Shield }
  ];

  return (
    <div className="relative bg-slate-50 min-h-screen overflow-hidden">
      
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-tr from-blue-400/10 via-indigo-400/10 to-purple-400/10 rounded-full filter blur-[100px] -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/3 -left-20 w-[450px] h-[450px] bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-cyan-400/10 rounded-full filter blur-[100px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/10 via-blue-400/10 to-purple-400/10 rounded-full filter blur-[100px] -z-10 animate-pulse-slow"></div>

      {/* ========== HERO SECTION (SPLIT LAYOUT) ========== */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center w-full">
          
          {/* Left Side: Premium Copy & CTAs */}
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="lg:col-span-6 space-y-8 text-left"
          >
            {/* Tag / Trust Badge */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-200/50 bg-purple-50/50 backdrop-blur text-xs font-semibold text-purple-700 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" /> <span>Next Generation Job Engine</span>
            </motion.div>

            {/* Giant Title */}
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05]"
            >
              Find Your <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Dream Tech Job
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-slate-600 leading-relaxed max-w-xl font-normal"
            >
              The visual SaaS board for engineers, designers, and scaling tech teams. Connect with verified startups instantly and track applications on a visual dashboard.
            </motion.p>

            {/* Premium CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex gap-4 flex-wrap"
            >
              <motion.button 
                variants={buttonHover}
                whileHover="whileHover"
                whileTap="whileTap"
                onClick={() => setCurrentPage('jobs')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/35 transition flex items-center gap-2"
              >
                <span>Explore Jobs</span> <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <motion.button 
                variants={buttonHover}
                whileHover="whileHover"
                whileTap="whileTap"
                onClick={() => {
                  if (user?.role === 'company') {
                    setCurrentPage('dashboard');
                  } else {
                    setCurrentPage('register');
                  }
                }}
                className="px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-2xl shadow-sm transition flex items-center gap-2"
              >
                <span>Post a Job</span>
              </motion.button>
            </motion.div>

            {/* Small Trust Badge Avatars */}
            <motion.div 
              variants={fadeInUp}
              className="pt-4 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
                ].map((src, i) => (
                  <img 
                    key={i} 
                    src={src} 
                    alt="avatar" 
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm font-bold text-slate-800 ml-1">4.9/5</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Trusted by 12,000+ engineers globally</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Interactive SaaS Dashboard Canvas */}
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex items-center justify-center h-[550px]"
          >
            {/* Tech Floating Icons Backdrop */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <span className="absolute top-12 left-10 text-4xl animate-float-slow">🎨</span>
              <span className="absolute top-20 right-8 text-4xl animate-float-medium">🚀</span>
              <span className="absolute bottom-16 left-1/4 text-4xl animate-float-fast">⭐</span>
              <span className="absolute bottom-28 right-12 text-4xl animate-float-slow">💻</span>
            </div>

            {/* Grid Mesh lines behind cards */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-70"></div>

            {/* Dashboard Container */}
            <div className="w-full max-w-md relative z-10 space-y-6">
              
              {/* CARD 1: Job Analytics Card */}
              <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="glass-card rounded-3xl p-6 border border-white/40 shadow-xl animate-float-slow"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Talent Analytics</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Realtime Hires</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100/50">+24%</span>
                </div>
                
                {/* Visual Chart Placeholder */}
                <div className="h-28 flex items-end gap-3.5 pt-4 px-2">
                  {[35, 60, 45, 80, 50, 95, 75].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${val}%` }}
                        transition={{ delay: idx * 0.1 + 0.3, duration: 0.6 }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          idx === 5 
                            ? 'bg-gradient-to-t from-blue-600 to-purple-500 shadow-lg shadow-purple-500/20' 
                            : 'bg-slate-200 group-hover:bg-blue-300'
                        }`}
                      />
                      <span className="text-[9px] font-bold text-slate-400">M{idx+1}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CARD 2: Active Hires bubble / bubble pop card */}
              <div className="grid grid-cols-2 gap-4">
                {/* Job Category bubble */}
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass-card rounded-2xl p-5 border border-white/40 shadow-lg animate-float-medium flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">💼</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full">Remote</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs line-clamp-1">Staff React Dev</h5>
                    <p className="text-[10px] text-slate-500">Stripe • New York</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">$180k - $210k</span>
                  </div>
                </motion.div>

                {/* Salary distribution index */}
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass-card rounded-2xl p-5 border border-white/40 shadow-lg animate-float-fast flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">Salary Index</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                      <span>Frontend</span>
                      <span className="text-slate-800">$165k</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full w-[85%]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                      <span>Design</span>
                      <span className="text-slate-800">$140k</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-full rounded-full w-[70%]"></div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* CARD 3: Active Hires live feed */}
              <motion.div 
                whileHover={{ y: -3 }}
                className="glass-card rounded-2xl p-4 border border-white/40 shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      JD
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">Congratulations!</h5>
                    <p className="text-[10px] text-slate-500 font-medium">John Doe accepted Senior Developer offer</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* ========== TRUSTED COMPANIES SECTION (SCROLLING MARQUEE) ========== */}
      <section className="py-16 bg-white border-y border-slate-200/50 overflow-hidden relative">
        <div className="absolute top-0 bottom-0 left-0 w-44 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
        <div className="absolute top-0 bottom-0 right-0 w-44 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>

        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Leading companies hiring through HireWave</p>
        </div>

        {/* Continuous Scrolling Marquee */}
        <div className="flex gap-12 w-[200%] animate-marquee whitespace-nowrap">
          {[...companies, ...companies, ...companies, ...companies].map((company, idx) => (
            <div 
              key={idx} 
              className="inline-flex items-center gap-2.5 text-2xl font-extrabold text-slate-400/70 hover:text-slate-800 transition-colors duration-300 cursor-pointer select-none"
            >
              <span className="text-3xl">🏢</span>
              <span>{company}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========== WHY CHOOSE US (SaaS FEATURES GRID) ========== */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-sm font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Core Pillars</span>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Built for modern tech builders</h2>
          <p className="text-slate-500 text-lg">We bypassed traditional, dry job boards to make job seeking tactile, responsive, and incredibly fast.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: 'AI-Powered Matching', desc: 'Our smart filters align your tech stack directly with hiring parameters in real-time.', color: 'blue' },
            { icon: Shield, title: 'Salary Transparency', desc: 'Every listing features guaranteed average salary ranges to preserve absolute wage clarity.', color: 'purple' },
            { icon: Award, title: 'Visual Progress Tracking', desc: 'Track every single application status in a high-fidelity dashboard layout.', color: 'cyan' }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={scaleUp}
              whileHover={{ y: -8 }}
              className="glass-card rounded-3xl p-8 border border-white/40 shadow-md text-left transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
              <div className={`p-4 rounded-2xl bg-${feature.color}-50 inline-flex text-${feature.color}-600 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== DYNAMIC STATS SECTION ========== */}
      <section className="py-20 relative bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white overflow-hidden rounded-t-[50px]">
        {/* Glow lights behind */}
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full filter blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid md:grid-cols-4 gap-10 text-center relative z-10">
          {[
            { label: 'Active Opportunities', value: '4,200+' },
            { label: 'Verified Startups', value: '350+' },
            { label: 'Average Hires Weekly', value: '180+' },
            { label: 'Total Capital Raised', value: '$850M+' }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2"
            >
              <h3 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">{stat.value}</h3>
              <p className="text-slate-400 text-sm font-semibold tracking-wide uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== FEATURED JOBS SECTION ========== */}
      <section className="py-28 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-3">
            <span className="text-sm font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Hot Roles</span>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Featured Opportunities</h2>
            <p className="text-slate-500">Discover elite vacancies handpicked by our recruitment specialists.</p>
          </div>
          
          {/* View all filter triggers */}
          <motion.button 
            whileHover={{ x: 3 }}
            onClick={() => setCurrentPage('jobs')} 
            className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition"
          >
            <span>Explore all {jobs.length} listings</span> <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Jobs Grid */}
        <motion.div 
          variants={staggerContainer} 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true }} 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {jobs.slice(0, 3).map(job => (
            <motion.div
              key={job.id}
              onClick={() => setCurrentPage(`job-${job.id}`)}
              className="relative overflow-hidden p-6 rounded-3xl border border-white/30 bg-white/70 backdrop-blur-xl transition-all duration-500 cursor-pointer shadow-md hover:-translate-y-2 hover:shadow-xl hover:border-purple-300/40 group"
            >
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
              
              <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="flex gap-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-3xl shadow-sm">
                    {job.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      {job.featured && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 border border-purple-200/50 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-purple-600 text-purple-600" /> Featured
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm font-medium">{job.company}</p>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 text-sm mb-5 leading-relaxed line-clamp-2">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 mb-5 pb-5 border-b border-slate-100">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/60 rounded-lg"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {job.location}</span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/60 rounded-lg"><DollarSign className="w-3.5 h-3.5 text-green-500" /> {job.salary}</span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/60 rounded-lg"><Briefcase className="w-3.5 h-3.5 text-purple-500" /> {job.type}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-1.5 flex-wrap">
                  {job.skills.slice(0, 2).map((skill, idx) => (
                    <span key={idx} className="text-[10px] uppercase tracking-wider bg-purple-50 text-purple-600 font-bold px-2 py-1 rounded-md border border-purple-100/40">{skill}</span>
                  ))}
                  {job.skills.length > 2 && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-semibold">+{job.skills.length - 2}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Apply Now</span> <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ========== INTERACTIVE CATEGORY SECTION ========== */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl mx-auto mb-16 text-center space-y-4">
            <span className="text-sm font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Pills Catalog</span>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Explore by engineering category</h2>
            <p className="text-slate-500">Pick a segment to see active job listings and average hiring figures.</p>
          </div>

          {/* Interactive Pills */}
          <div className="flex gap-3 overflow-x-auto pb-4 justify-center mb-12">
            {categoriesList.map(cat => (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategoryTab(cat.name);
                }}
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap border ${
                  activeCategoryTab === cat.name
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg shadow-blue-500/15'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                <span>{cat.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategoryTab === cat.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Filtered jobs container */}
          <div className="grid md:grid-cols-2 gap-6">
            {jobs
              .filter(j => activeCategoryTab === 'All' || j.category === activeCategoryTab)
              .slice(0, 4)
              .map(job => (
                <motion.div 
                  key={job.id} 
                  layout
                  onClick={() => setCurrentPage(`job-${job.id}`)}
                  className="glass-card p-6 rounded-2xl border border-white/40 shadow-sm hover:border-purple-300 flex items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm border border-slate-100">{job.logo}</div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">{job.title}</h4>
                      <p className="text-slate-500 text-xs">{job.company} • {job.location}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-800">{job.salary}</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{job.type}</span>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS CAROUSEL ========== */}
      <section className="py-24 max-w-5xl mx-auto px-6 sm:px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-blue-500/5 rounded-full filter blur-[80px] -translate-x-1/2 -translate-y-1/2 -z-10"></div>
        
        <div className="max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-sm font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">Success Stories</span>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight font-display">What builders say about us</h2>
        </div>

        {/* Carousel slide window */}
        <div className="relative min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl p-10 border border-white/40 shadow-xl max-w-2xl relative"
            >
              <span className="text-6xl text-purple-300 font-serif absolute top-4 left-6 pointer-events-none select-none opacity-40">“</span>
              <p className="text-slate-600 text-lg md:text-xl italic leading-relaxed mb-8 relative z-10 px-4">
                {testimonials[activeTestimonial].text}
              </p>
              <div>
                <h4 className="font-extrabold text-slate-800 text-base">{testimonials[activeTestimonial].name}</h4>
                <p className="text-slate-500 text-xs font-semibold">{testimonials[activeTestimonial].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Manual Indicator Controls */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTestimonial(idx)}
              aria-label={`Show slide ${idx+1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeTestimonial === idx ? 'w-8 bg-blue-600' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className="py-24 max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">FAQ Desk</span>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Got questions? We have answers</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>

      {/* ========== NEWSLETTER & CTA BANNER REDESIGN ========== */}
      <section className="py-20 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 mb-28">
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-tr from-blue-900 via-indigo-950 to-slate-950 p-12 md:p-16 text-white text-center shadow-2xl">
          
          {/* Glowing backdrop spheres */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-[80px]"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-900/40 border border-cyan-800 px-3 py-1 rounded-full">Weekly Digest</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">Stay ahead of the curve</h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Get personalized tech roles, instant interview invites, and localized salary index estimates delivered to your inbox weekly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your work email" 
                className="flex-1 px-5 py-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm backdrop-blur-md"
              />
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition text-sm flex items-center justify-center gap-1.5 shadow-lg"
              >
                <span>Subscribe</span> <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            
            <p className="text-slate-400 text-xs font-medium">We respects your privacy. Zero spam, unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
};
