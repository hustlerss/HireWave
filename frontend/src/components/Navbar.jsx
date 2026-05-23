import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { buttonHover } from '../utils/animations';
import { api } from '../utils/api';

export const Navbar = ({ currentPage, setCurrentPage, user, setUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 20000); // poll every 20s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.notifications.getAll();
      if (res.success) setNotifications(res.data || []);
    } catch (err) {
      console.warn('Failed to fetch notifications:', err.message);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.notifications.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'companies', label: 'Companies' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-nav py-3 shadow-[0_10px_30px_rgba(0,0,0,0.03)]' 
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 cursor-pointer font-bold text-2xl tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>HireWave</span>
        </motion.div>

        {/* Desktop Menu - Animated Underline */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id || (link.id === 'jobs' && currentPage.startsWith('job-'));
            return (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full hover:text-slate-900 ${
                  isActive ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute inset-0 bg-slate-100 rounded-full -z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Auth / Action CTA Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-5">
              <div className="relative">
                <div 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative cursor-pointer p-1.5 hover:bg-slate-100 rounded-full transition-colors duration-200"
                >
                  <Bell className="w-5 h-5 text-slate-600 hover:text-blue-600" />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 text-white border border-white rounded-full text-[9px] flex items-center justify-center font-bold">
                      {notifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </div>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 p-4 z-50 max-h-[400px] overflow-y-auto"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                        <span className="font-bold text-slate-800 text-xs sm:text-sm">Notifications</span>
                        {notifications.filter(n => !n.isRead).length > 0 && (
                          <button 
                            onClick={handleMarkAllRead}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {notifications.length > 0 ? (
                        <div className="space-y-2">
                          {notifications.map(n => (
                            <div 
                              key={n._id}
                              onClick={() => {
                                handleMarkRead(n._id);
                                if (n.data?.jobId || n.data?.applicationId) {
                                  setCurrentPage('dashboard');
                                }
                                setShowNotifications(false);
                              }}
                              className={`p-2.5 rounded-xl border text-left cursor-pointer transition duration-200 ${
                                n.isRead 
                                  ? 'bg-slate-50/50 border-slate-100/50 text-slate-500' 
                                  : 'bg-indigo-500/5 border-indigo-500/10 hover:bg-indigo-500/10 text-slate-800'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className={`font-bold text-xs ${n.isRead ? 'text-slate-600' : 'text-slate-800'}`}>
                                  {n.title}
                                </span>
                                {!n.isRead && (
                                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-[10px] leading-normal mt-0.5">{n.message}</p>
                              <span className="text-[8px] text-slate-400 font-semibold block mt-1">
                                {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-slate-400 text-xs">
                          No notifications yet
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div 
                className="flex items-center gap-3 cursor-pointer group" 
                onClick={() => setCurrentPage('dashboard')}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/10 group-hover:scale-105 transition-all duration-300">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{user.name}</span>
                  <span className="text-xs text-slate-500 leading-none">Dashboard</span>
                </div>
              </div>

              <motion.button 
                {...buttonHover}
                onClick={() => { api.auth.logout(); setUser(null); setCurrentPage('home'); }} 
                className="px-4 py-2 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" /> Logout
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <motion.button 
                {...buttonHover}
                onClick={() => setCurrentPage('login')} 
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
              >
                Login
              </motion.button>
              <motion.button 
                {...buttonHover}
                onClick={() => setCurrentPage('register')} 
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/20 transition duration-300 flex items-center gap-1"
              >
                Sign Up <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2 hover:bg-slate-100 rounded-full" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
        </motion.button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/50 absolute top-full left-0 w-full overflow-hidden shadow-xl"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <button 
                  key={link.id}
                  onClick={() => { setCurrentPage(link.id); setMenuOpen(false); }} 
                  className={`text-left text-base font-semibold py-1.5 transition-colors ${
                    currentPage === link.id ? 'text-blue-600' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <hr className="border-slate-100" />
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3" onClick={() => { setCurrentPage('dashboard'); setMenuOpen(false); }}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-500">View Profile</div>
                    </div>
                  </div>
                  <button onClick={() => { api.auth.logout(); setUser(null); setCurrentPage('home'); setMenuOpen(false); }} className="bg-red-50 text-red-600 px-5 py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button onClick={() => { setCurrentPage('login'); setMenuOpen(false); }} className="w-full py-3 text-slate-600 hover:text-blue-600 font-semibold border border-slate-200 rounded-full">
                    Login
                  </button>
                  <button onClick={() => { setCurrentPage('register'); setMenuOpen(false); }} className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg shadow-purple-500/20">
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
