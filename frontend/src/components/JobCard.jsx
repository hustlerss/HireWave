import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, DollarSign, Briefcase, Star, ArrowRight } from 'lucide-react';
import { fadeInUp, glowHover, heartPop } from '../utils/animations';

export const JobCard = ({ job, setCurrentPage, savedJobs, setSavedJobs }) => {
  const isSaved = savedJobs.includes(job.id);

  return (
    <motion.div
      variants={fadeInUp}
      {...glowHover}
      className="relative overflow-hidden p-6 rounded-3xl border border-white/30 bg-white/70 backdrop-blur-xl transition-all duration-500 cursor-pointer shadow-md"
      onClick={() => setCurrentPage(`job-${job.id}`)}
    >
      {/* Premium top gradient highlight border */}
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>

      {/* Featured glowing background circles (subtle) */}
      {job.featured && (
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/10 rounded-full filter blur-xl pointer-events-none"></div>
      )}

      {/* Card Header */}
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="flex gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-3xl shadow-sm">
            {job.logo}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
              {job.featured && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 border border-purple-200/50 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-purple-600 text-purple-600" /> Featured
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm font-medium">{job.company}</p>
          </div>
        </div>
        
        {/* Heart pop bookmark trigger */}
        <motion.button
          onClick={(e) => { 
            e.stopPropagation(); 
            setSavedJobs(isSaved ? savedJobs.filter(id => id !== job.id) : [...savedJobs, job.id]); 
          }}
          variants={heartPop}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          animate={isSaved ? "active" : "initial"}
          className={`p-2.5 rounded-full border transition-all duration-300 ${
            isSaved 
              ? 'bg-red-50 border-red-200 text-red-500 shadow-md shadow-red-500/5' 
              : 'bg-slate-50/55 border-slate-200/80 text-slate-400 hover:text-red-500 hover:bg-red-50/20'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500' : ''}`} />
        </motion.button>
      </div>

      {/* Description Preview */}
      <p className="text-slate-600 text-sm mb-5 leading-relaxed relative z-10 line-clamp-2">
        {job.description || "Join our high-velocity development team to lead, design, and deliver cutting-edge frontend interfaces."}
      </p>

      {/* Job Meta details */}
      <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 mb-5 pb-5 border-b border-slate-100 relative z-10">
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/60 rounded-lg">
          <MapPin className="w-3.5 h-3.5 text-blue-500" /> {job.location}
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/60 rounded-lg">
          <DollarSign className="w-3.5 h-3.5 text-green-500" /> {job.salary}
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/60 rounded-lg">
          <Briefcase className="w-3.5 h-3.5 text-purple-500" /> {job.type}
        </span>
      </div>

      {/* Skills list & action trigger */}
      <div className="flex justify-between items-center relative z-10">
        <div className="flex gap-1.5 flex-wrap">
          {job.skills.slice(0, 3).map((skill, idx) => (
            <span 
              key={idx} 
              className="text-[10px] uppercase tracking-wider bg-purple-50 text-purple-600 font-bold px-2 py-1 rounded-md border border-purple-100/40"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-semibold">
              +{job.skills.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition">
          <span>Apply</span> <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
};
