import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, DollarSign, Filter, Sparkles } from 'lucide-react';
import { staggerContainer, scaleUp } from '../utils/animations';
import { FilterSidebar } from '../components/FilterSidebar';
import { JobCard } from '../components/JobCard';

export const JobsListingPage = ({ setCurrentPage, user, jobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filters, setFilters] = useState({ level: [], type: [], location: [] });
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentPage, setCurrentPageNum] = useState(1);

  const categories = ['All', 'Frontend', 'Backend', 'Full Stack', 'Design', 'Product'];
  const jobsPerPage = 6;

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 relative overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full filter blur-[100px] -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/2 -left-20 w-[400px] h-[400px] bg-purple-500/5 rounded-full filter blur-[100px] -z-10 animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 relative z-10">
        
        {/* Title Header */}
        <div className="mb-12 text-left space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Explore Open Roles
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Find Your Next Engineering Challenge
          </h1>
          <p className="text-slate-500 text-base max-w-2xl">
            Filter through verified high-growth opportunities. Align your skills, select your preferences, and apply instantly.
          </p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="relative shadow-lg shadow-slate-100/80 rounded-2xl overflow-hidden bg-white border border-slate-200/60 p-1.5 flex items-center">
            <div className="flex items-center flex-1 px-4">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Search jobs, tech stacks, or companies..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPageNum(1); }}
                className="w-full py-3 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-base md:text-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="mb-10 flex gap-2.5 overflow-x-auto pb-3"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPageNum(1); }}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-transparent shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Filters */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className="hidden lg:block sticky top-28"
          >
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </motion.div>

          {/* Jobs Grid */}
          <div className="lg:col-span-3">
            <motion.div 
              variants={staggerContainer} 
              initial="initial" 
              animate="animate" 
              className="grid md:grid-cols-2 gap-6"
            >
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    setCurrentPage={setCurrentPage}
                    savedJobs={savedJobs}
                    setSavedJobs={setSavedJobs}
                  />
                ))
              ) : (
                <div className="col-span-2 py-16 text-center">
                  <span className="text-4xl">🔍</span>
                  <h3 className="font-bold text-slate-800 text-lg mt-4">No jobs match your search</h3>
                  <p className="text-slate-500 text-sm mt-1">Try refining your keyword terms or category selection.</p>
                </div>
              )}
            </motion.div>

            {/* Pagination */}
            {filteredJobs.length > jobsPerPage && (
              <div className="flex justify-center gap-2 mt-16">
                {[...Array(Math.ceil(filteredJobs.length / jobsPerPage))].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentPageNum(idx + 1);
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 border ${
                      currentPage === idx + 1
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
