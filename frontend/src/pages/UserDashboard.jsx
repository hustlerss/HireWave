import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Heart, TrendingUp, Calendar, LogOut, Bell,
  CheckCircle, Upload, Shield, Trash2, ArrowRight, User,
  Settings, FileText, MapPin, Phone, Mail, Star, RefreshCw,
  Edit3, Save, X, Link, Clock, XCircle, AlertCircle, Plus
} from 'lucide-react';
import { buttonHover } from '../utils/animations';
import { api } from '../utils/api';

export const UserDashboard = ({ user, setCurrentPage, setUser }) => {
  const [activeTab, setActiveTab] = useState('applied');

  // Real applications state
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState(null);

  // Profile editing state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || '',
    skills: (user?.skills || []).join(', '),
    experience: user?.experience || '',
    resume: user?.resume || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Load real applications on mount
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setAppsLoading(true);
    setAppsError(null);
    try {
      const res = await api.applications.getUserApplications();
      if (res.success) setApplications(res.data);
    } catch (err) {
      setAppsError(err.message || 'Failed to load applications');
    } finally {
      setAppsLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSaved(false);
    try {
      const skillsArray = profileForm.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await api.users.updateProfile({
        name: profileForm.name,
        bio: profileForm.bio,
        phone: profileForm.phone,
        location: profileForm.location,
        skills: skillsArray,
        experience: profileForm.experience ? Number(profileForm.experience) : undefined,
        resume: profileForm.resume,
      });

      if (res.success) {
        // Update parent state so navbar + other components see new name
        setUser(prev => ({ ...prev, ...res.data }));
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to save profile');
    } finally {
      setProfileSaving(false);
    }
  };

  // Derived real stats
  const totalApps = applications.length;
  const shortlistedCount = applications.filter(a => ['shortlisted', 'accepted'].includes(a.status)).length;
  const approvedApps = applications.filter(a => ['shortlisted', 'accepted'].includes(a.status));
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const interviewCount = applications.filter(a => a.status === 'reviewed').length;

  // Status display config
  const statusConfig = {
    pending:     { label: 'Pending Review', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    reviewed:    { label: 'Under Review',   color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    shortlisted: { label: 'Shortlisted 🎉', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    rejected:    { label: 'Not Selected',   color: 'bg-red-500/10 text-red-500 border-red-500/20' },
    accepted:    { label: 'Offer Received 🎊', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  };

  const statStyles = {
    blue:   'bg-blue-500/10 text-blue-600 border-blue-500/20',
    red:    'bg-red-500/10 text-red-500 border-red-500/20',
    green:  'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  };

  const inputCls = 'w-full px-4 py-3 bg-white/60 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none rounded-xl text-sm transition-all duration-300 font-medium text-slate-800 placeholder-slate-400';
  const labelCls = 'block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1';

  const skillsList = (user?.skills || []);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-24 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-blue-300/10 to-indigo-300/10 filter blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-tr from-purple-300/10 to-pink-300/10 filter blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Candidate</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Welcome Back,{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {user.name.split(' ')[0]}
                </span>!
              </h1>
              <p className="text-slate-500 text-sm sm:text-base mt-1">
                {user.bio || 'Complete your profile to stand out to recruiters.'}
              </p>
            </div>

            <motion.button
              variants={buttonHover} whileHover="whileHover" whileTap="whileTap"
              onClick={() => { setUser(null); setCurrentPage('home'); }}
              className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-red-500 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 font-bold text-sm self-start sm:self-auto"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </motion.button>
          </div>

          {/* Celebratory Congratulatory Banner */}
          {approvedApps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
              className="mb-8 p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 text-white border border-indigo-500/20 shadow-[0_20px_50px_rgba(31,38,135,0.15)] relative overflow-hidden group"
            >
              {/* Animated glow particles */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/20 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-cyan-500/15 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-900 flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-amber-500/20 animate-bounce shrink-0 mt-0.5">
                    🎉
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">Congratulations! Recruiter Decision Received</h3>
                    <p className="text-indigo-200/90 text-sm font-semibold mt-1">
                      You have active approvals or offers waiting in your pipeline!
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      {approvedApps.map((app, idx) => (
                        <div key={idx} className="flex flex-wrap items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 w-fit">
                          <span className="font-bold text-white">{app.job?.title || 'Engineer'}</span> at
                          <span className="font-bold text-yellow-300">{app.job?.company?.name || app.job?.company || 'Partner'}</span>
                          <span className={`px-2 py-0.5 rounded-md font-extrabold text-[9px] uppercase tracking-wider ${
                            app.status === 'accepted' ? 'bg-purple-500 text-white' : 'bg-emerald-500 text-white'
                          }`}>
                            {app.status === 'accepted' ? 'Offer Received 🎊' : 'Shortlisted 🎉'}
                          </span>
                          {app.recruiterNotes && (
                            <span className="italic text-indigo-200 pl-1 border-l border-white/20">
                              "{app.recruiterNotes}"
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setActiveTab('applied')}
                  className="px-5 py-3 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-slate-50 transition duration-300 shrink-0 self-start sm:self-auto flex items-center gap-1.5"
                >
                  Go to Action Items <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Real Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Briefcase, label: 'Applications',  value: totalApps,        color: 'blue' },
              { icon: Star,      label: 'Shortlisted',   value: shortlistedCount, color: 'green' },
              { icon: Clock,     label: 'Pending Review',value: pendingCount,     color: 'red' },
              { icon: TrendingUp,label: 'Under Review',  value: interviewCount,   color: 'purple' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="glass-card p-5 sm:p-6 rounded-[28px] border relative overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl border ${statStyles[stat.color]} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-0.5">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-6">

            {/* Profile Card */}
            <div className="glass-card p-6 rounded-[32px] border relative overflow-hidden text-center group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />

              <div className="relative inline-block mt-4 mb-4">
                <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1.5 border-4 border-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-0.5 truncate">{user.name}</h3>
              <p className="text-slate-400 text-xs truncate mb-1">{user.email}</p>
              {user.location && (
                <p className="text-slate-400 text-xs flex items-center justify-center gap-1 mb-2">
                  <MapPin className="w-3 h-3" /> {user.location}
                </p>
              )}

              {skillsList.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mb-3 mt-2">
                  {skillsList.slice(0, 3).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-500/5 text-blue-600 border border-blue-500/10 rounded-full text-[10px] font-bold">
                      {s}
                    </span>
                  ))}
                  {skillsList.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">
                      +{skillsList.length - 3}
                    </span>
                  )}
                </div>
              )}

              {user.resume ? (
                <a
                  href={user.resume} target="_blank" rel="noopener noreferrer"
                  className="w-full py-2.5 mt-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition duration-300 flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" /> View My Resume
                </a>
              ) : (
                <button
                  onClick={() => setActiveTab('profile')}
                  className="w-full py-2.5 mt-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:text-blue-600 hover:bg-slate-50 transition duration-300"
                >
                  + Complete Profile
                </button>
              )}
            </div>

            {/* Nav Menu */}
            <div className="glass-card p-3 rounded-[32px] border space-y-1">
              {[
                { tab: 'applied',  label: 'My Applications', icon: Briefcase },
                { tab: 'profile',  label: 'Edit Profile',    icon: User },
                { tab: 'resume',   label: 'Resume & Docs',   icon: FileText },
                { tab: 'settings', label: 'Settings',        icon: Settings },
              ].map(item => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full p-3.5 rounded-2xl flex items-center gap-3.5 transition duration-300 text-left font-bold text-sm ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                    {item.tab === 'applied' && totalApps > 0 && (
                      <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-600'}`}>
                        {totalApps}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
            <AnimatePresence mode="wait">

              {/* ─── MY APPLICATIONS (Real) ─── */}
              {activeTab === 'applied' && (
                <motion.div
                  key="applied-tab"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 tracking-tight">My Applications</h2>
                      <p className="text-slate-400 text-xs">Track the real-time status of every role you applied to</p>
                    </div>
                    <button
                      onClick={loadApplications}
                      className="px-3 py-2 text-xs font-bold text-blue-600 border border-blue-500/20 rounded-xl hover:bg-blue-50 transition flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                  </div>

                  {/* Loading */}
                  {appsLoading && (
                    <div className="flex items-center justify-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                        <p className="text-slate-400 text-sm font-medium">Loading applications...</p>
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {appsError && !appsLoading && (
                    <div className="text-center py-10 bg-red-50/50 rounded-[28px] border border-red-200/50">
                      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <h3 className="font-bold text-red-700 text-sm">{appsError}</h3>
                      <button onClick={loadApplications} className="mt-3 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition">
                        Try Again
                      </button>
                    </div>
                  )}

                  {/* Empty */}
                  {!appsLoading && !appsError && applications.length === 0 && (
                    <div className="text-center py-16 bg-white/50 backdrop-blur rounded-[28px] border border-slate-200/50">
                      <span className="text-5xl">🚀</span>
                      <h3 className="font-bold text-slate-800 text-base mt-3">No applications yet</h3>
                      <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">Browse open positions and hit Apply — they'll show up here with live status updates.</p>
                      <button
                        onClick={() => setCurrentPage('jobs')}
                        className="mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold rounded-xl hover:opacity-90 transition"
                      >
                        Browse Jobs
                      </button>
                    </div>
                  )}

                  {/* Real application cards */}
                  {!appsLoading && !appsError && applications.length > 0 && (
                    <div className="space-y-4">
                      {applications.map((app, idx) => {
                        const job = app.job || {};
                        const company = job.company || {};
                        const status = app.status || 'pending';
                        const cfg = statusConfig[status] || statusConfig.pending;

                        return (
                          <motion.div
                            key={app._id}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card p-6 rounded-[28px] border hover:border-slate-300 hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                              <div className="flex gap-4 items-start">
                                {/* Company logo */}
                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-2xl shadow-sm shrink-0">
                                  {company.logo || '💼'}
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-800 text-base">{job.title || 'Unknown Role'}</h3>
                                  <p className="text-slate-400 text-xs mt-0.5">
                                    {company.name || 'Company'}{job.location ? ` · ${job.location}` : ''}
                                  </p>
                                  <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Applied {app.appliedAt
                                      ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                      : 'Recently'}
                                  </p>
                                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                    <span className={`px-3 py-1 border text-[11px] font-bold rounded-full ${cfg.color}`}>
                                      {cfg.label}
                                    </span>
                                    {app.reviewedAt && (
                                      <span className="text-[10px] text-slate-400 font-semibold">
                                        Reviewed: {new Date(app.reviewedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {app.recruiterNotes && (
                                    <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 italic">
                                      <span className="font-bold text-slate-500 not-italic block mb-0.5">Recruiter Feedback:</span>
                                      "{app.recruiterNotes}"
                                    </div>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => setCurrentPage(`job-${job._id || job.id}`)}
                                className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:text-blue-700 transition self-end sm:self-start mt-1 shrink-0"
                              >
                                View Job <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── EDIT PROFILE (Real save to DB) ─── */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Edit Your Profile</h2>
                    <p className="text-slate-400 text-xs">This info is shown to recruiters when you apply. Keep it updated.</p>
                  </div>

                  <div className="glass-card p-8 rounded-[32px] border space-y-5">

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Full Name *</label>
                        <input
                          value={profileForm.name}
                          onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="Your full name"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            value={profileForm.phone}
                            onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                            placeholder="+91 98765 43210"
                            className={inputCls + ' pl-10'}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          value={profileForm.location}
                          onChange={e => setProfileForm(p => ({ ...p, location: e.target.value }))}
                          placeholder="e.g. Pune, Maharashtra, India"
                          className={inputCls + ' pl-10'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Professional Bio</label>
                      <textarea
                        value={profileForm.bio}
                        onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                        placeholder="Write a 2-3 line summary about yourself — your skills, experience, and what you're looking for..."
                        rows="3"
                        className={inputCls + ' resize-none rounded-2xl'}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Skills</label>
                        <input
                          value={profileForm.skills}
                          onChange={e => setProfileForm(p => ({ ...p, skills: e.target.value }))}
                          placeholder="e.g. React, Python, Figma, SQL"
                          className={inputCls}
                        />
                        <p className="text-[10px] text-slate-400 mt-1 pl-1">Separate with commas</p>
                      </div>
                      <div>
                        <label className={labelCls}>Years of Experience</label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={profileForm.experience}
                          onChange={e => setProfileForm(p => ({ ...p, experience: e.target.value }))}
                          placeholder="e.g. 2"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Resume URL</label>
                      <div className="relative">
                        <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          value={profileForm.resume}
                          onChange={e => setProfileForm(p => ({ ...p, resume: e.target.value }))}
                          placeholder="https://drive.google.com/your-resume-link"
                          className={inputCls + ' pl-10'}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 pl-1">
                        Paste your Google Drive, Notion, or any public PDF link. Recruiters will see this.
                      </p>
                    </div>

                    {/* Save / feedback */}
                    {profileError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" /> {profileError}
                      </div>
                    )}

                    {profileSaved && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" /> Profile saved successfully! Recruiters can now see your updated details.
                      </div>
                    )}

                    <div className="flex gap-3 pt-2 border-t border-slate-100">
                      <motion.button
                        variants={buttonHover}
                        whileHover={profileSaving ? {} : 'whileHover'}
                        whileTap={profileSaving ? {} : 'whileTap'}
                        onClick={handleProfileSave}
                        disabled={profileSaving}
                        className={`px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/10 transition flex items-center gap-2 ${profileSaving ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                      >
                        {profileSaving ? (
                          <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                        ) : (
                          <><Save className="w-3.5 h-3.5" /> Save Profile</>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─── RESUME & DOCS ─── */}
              {activeTab === 'resume' && (
                <motion.div
                  key="resume-tab"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Resume & Documents</h2>
                    <p className="text-slate-400 text-xs">Your resume URL is shown to recruiters on every application you submit</p>
                  </div>

                  <div className="glass-card p-8 sm:p-10 rounded-[32px] border space-y-6">
                    {/* Current resume status */}
                    {user.resume ? (
                      <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-emerald-800 text-sm">Resume Linked ✓</h4>
                          <a href={user.resume} target="_blank" rel="noopener noreferrer"
                            className="text-emerald-600 text-xs font-semibold truncate block hover:underline mt-0.5">
                            {user.resume}
                          </a>
                        </div>
                        <a href={user.resume} target="_blank" rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition shrink-0">
                          View
                        </a>
                      </div>
                    ) : (
                      <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="text-amber-700 text-xs font-semibold">
                          No resume linked yet. Recruiters won't see your resume until you add a link below.
                        </p>
                      </div>
                    )}

                    {/* Update resume URL */}
                    <div>
                      <label className={labelCls}>Update Resume Link</label>
                      <div className="relative">
                        <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          value={profileForm.resume}
                          onChange={e => setProfileForm(p => ({ ...p, resume: e.target.value }))}
                          placeholder="https://drive.google.com/file/d/your-resume/view"
                          className={inputCls + ' pl-10'}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 pl-1">
                        Use a publicly shareable Google Drive, Dropbox, or direct PDF URL. Make sure the link is accessible.
                      </p>
                    </div>

                    {profileSaved && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Resume link saved!
                      </div>
                    )}

                    <div className="flex gap-3 pt-2 border-t border-slate-100">
                      <button
                        onClick={handleProfileSave}
                        disabled={profileSaving}
                        className={`px-7 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 transition flex items-center gap-2 ${profileSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {profileSaving
                          ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                          : <><Save className="w-3.5 h-3.5" /> Save Resume Link</>}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─── SETTINGS ─── */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings-tab"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Settings</h2>
                    <p className="text-slate-400 text-xs">Manage notifications and account preferences</p>
                  </div>

                  <div className="glass-card p-8 rounded-[32px] border space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-500" /> Notification Preferences
                      </h3>
                      <div className="space-y-4">
                        {[
                          'Email alerts for new matching job postings',
                          'Immediate updates when your application status changes',
                          'Weekly career digest and tips newsletter'
                        ].map((item, idx) => (
                          <label key={idx} className="flex items-center gap-3.5 cursor-pointer group">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" />
                            <span className="text-slate-500 text-xs sm:text-sm font-semibold group-hover:text-slate-800 transition-colors">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-500" /> Privacy
                      </h3>
                      <label className="flex items-center gap-3.5 cursor-pointer group">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer" />
                        <span className="text-slate-500 text-xs sm:text-sm font-semibold group-hover:text-slate-800 transition-colors">
                          Allow verified recruiters to view my profile and contact details
                        </span>
                      </label>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="pt-2">
                      <h4 className="font-bold text-red-600 text-sm mb-2">Danger Zone</h4>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4">
                        Permanently delete your account, applications, and all data. This cannot be undone.
                      </p>
                      <button className="px-5 py-3 border border-red-200 text-red-500 rounded-2xl text-xs font-bold hover:bg-red-50 transition flex items-center gap-1.5">
                        <Trash2 className="w-4 h-4" /> Delete Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
