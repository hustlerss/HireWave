import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, DollarSign, Briefcase, Star, Sparkles, Building2, ChevronRight, TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';
import { dummyCompanies } from '../data/dummyData';
import { fadeInUp, staggerContainer, glowHover, scaleUp, buttonHover } from '../utils/animations';
import { api } from '../utils/api';

export const CompaniesPage = ({ setCurrentPage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.companies.getAll();
      if (res.success && res.data && res.data.length > 0) {
        setCompanies(res.data);
      } else {
        setCompanies(dummyCompanies);
      }
    } catch (err) {
      console.warn('Failed to load real companies, using offline fallback:', err.message);
      setCompanies(dummyCompanies);
    } finally {
      setLoading(false);
    }
  };

  const filterTabs = ['All', 'SaaS', 'Remote First', 'Big Tech'];

  const filteredCompanies = companies.filter(company => {
    const name = company.name || '';
    const industry = company.industry || '';
    const location = company.location || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          location.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeFilterTab === 'SaaS') {
      matchesTab = industry.includes('SaaS');
    } else if (activeFilterTab === 'Remote First') {
      matchesTab = location.includes('Remote') || location.includes('Remote First');
    } else if (activeFilterTab === 'Big Tech') {
      matchesTab = industry.includes('Big Tech') || industry.includes('AI') || sizeMatchesBig(company.size);
    }

    return matchesSearch && matchesTab;
  });

  function sizeMatchesBig(size) {
    if (!size) return false;
    return size.includes('1000+') || size.includes('5,000+');
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 relative overflow-hidden">
      {/* Decorative blurred gradients */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/5 to-purple-400/5 rounded-full filter blur-[100px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-20 -left-20 w-[450px] h-[450px] bg-gradient-to-br from-purple-400/5 to-cyan-400/5 rounded-full filter blur-[100px] -z-10 animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 relative z-10">
        
        {/* Page Header */}
        <div className="mb-12 text-left space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Verified Startups Directory
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Explore Modern Tech Workplaces
          </h1>
          <p className="text-slate-500 text-base max-w-2xl">
            Directly connect with validated, venture-backed organizations and high-velocity engineering cultures hiring world-class builders.
          </p>
        </div>

        {/* Global Telemetry Metric Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12"
        >
          {[
            { label: 'Hiring Partners', value: `${dummyCompanies.length} Verified`, icon: ShieldCheck, color: 'blue' },
            { label: 'Open Opportunities', value: '16 Vacancies', icon: Briefcase, color: 'purple' },
            { label: 'Average Trust Index', value: '4.8 / 5.0', icon: Star, color: 'green' },
            { label: 'Venture Capital Hired', value: '$2.7B+ Total', icon: TrendingUp, color: 'cyan' }
          ].map((metric, idx) => (
            <div 
              key={idx} 
              className="glass-card p-5 rounded-[24px] border relative overflow-hidden hover:-translate-y-0.5 transition duration-300"
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{metric.label}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <metric.icon className={`w-4 h-4 text-${metric.color}-500`} />
                <span className="text-lg font-extrabold text-slate-800">{metric.value}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Search Input */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8"
        >
          <div className="relative shadow-md shadow-slate-100/50 rounded-2xl overflow-hidden bg-white border border-slate-200/60 p-1 flex items-center">
            <div className="flex items-center flex-1 px-4">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Search workplaces by name, tech stacks, or domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3.5 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-base font-medium"
              />
            </div>
          </div>
        </motion.div>

        {/* Filter Pills */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="mb-10 flex gap-2 overflow-x-auto pb-3"
        >
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilterTab(tab)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap border ${
                activeFilterTab === tab
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-transparent shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Companies Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map(company => (
                <motion.div
                  key={company.id}
                  variants={fadeInUp}
                  {...glowHover}
                  className="relative overflow-hidden p-6 sm:p-8 rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-xl transition-all duration-500 cursor-pointer shadow-md hover:-translate-y-1.5 flex flex-col justify-between"
                  onClick={() => setCurrentPage('jobs')}
                >
                  {/* Glowing Highlight line */}
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>

                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-4xl shadow-sm">
                          {company.logo}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{company.name}</h3>
                          <p className="text-xs font-semibold text-blue-600">{company.industry}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-0.5">
                          {company.stage || 'SaaS'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold mt-1.5">{company.raised || 'Validated'}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {company.description}
                    </p>

                    {/* Meta stats tags */}
                    <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-slate-100">
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-500 px-2.5 py-1 bg-slate-100/60 rounded-lg">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {company.size || '51-200'}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-500 px-2.5 py-1 bg-slate-100/60 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {company.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-500 px-2.5 py-1 bg-slate-100/60 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {company.rating || 4.8}
                      </span>
                    </div>
                  </div>

                  {/* Skills/Tech & Action */}
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex gap-1.5 flex-wrap max-w-[65%]">
                      {(company.techStack || ['React', 'TypeScript', 'Node.js']).slice(0, 3).map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="text-[9px] uppercase tracking-wider bg-purple-50/50 text-purple-600 font-bold px-2 py-0.5 rounded border border-purple-100/40"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <motion.button
                      variants={buttonHover}
                      whileHover="whileHover"
                      whileTap="whileTap"
                      className="px-4.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:shadow-indigo-500/10 transition flex items-center gap-1"
                    >
                      <span>View Jobs</span>
                      <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-1">{company.jobsCount}</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 py-20 text-center">
                <span className="text-5xl">🔍</span>
                <h3 className="font-extrabold text-slate-800 text-xl mt-4">No hiring partners match</h3>
                <p className="text-slate-500 text-sm mt-1">Try adapting your search parameters or tab selection.</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
};
