import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { JobsListingPage } from './pages/JobsListingPage';
import { SingleJobPage } from './pages/SingleJobPage';
import { CompanyDashboard } from './pages/CompanyDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { CompaniesPage } from './pages/CompaniesPage';
import { dummyJobs } from './data/dummyData';
import { api } from './utils/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch real jobs from backend MongoDB
    api.jobs.getAll()
      .then(data => {
        if (data && data.length > 0) {
          setJobs(data);
        }
      })
      .catch(err => console.error('Failed to fetch jobs:', err));

    // Handle token auto-login with safe sandboxed checks
    let token = null;
    try {
      token = localStorage.getItem('token');
    } catch (e) {}

    if (token) {
      api.auth.getProfile()
        .then(res => {
          if (res.success && res.data) {
            setUser(res.data);
          }
        })
        .catch(err => {
          console.error('Auto login failed:', err);
          try {
            localStorage.removeItem('token');
          } catch (e) {}
        });
    }
  }, []);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} setUser={setUser} />

      {currentPage === 'home' && (
      <LandingPage key="home" setCurrentPage={setCurrentPage} setUser={setUser} jobs={jobs} user={user} />
      )}
      {currentPage === 'login' && (
        // Already logged-in → send to their dashboard based on role
        user ? (
          user.role === 'company' ?
            <CompanyDashboard key="dashboard" user={user} setCurrentPage={setCurrentPage} setUser={setUser} jobs={jobs} setJobs={setJobs} /> :
            <UserDashboard key="dashboard" user={user} setCurrentPage={setCurrentPage} setUser={setUser} />
        ) :
        <AuthPage key="login" currentPage={currentPage} setCurrentPage={setCurrentPage} setUser={setUser} />
      )}
      {currentPage === 'register' && (
        user ? (
          user.role === 'company' ?
            <CompanyDashboard key="dashboard" user={user} setCurrentPage={setCurrentPage} setUser={setUser} jobs={jobs} setJobs={setJobs} /> :
            <UserDashboard key="dashboard" user={user} setCurrentPage={setCurrentPage} setUser={setUser} />
        ) :
        <AuthPage key="register" currentPage={currentPage} setCurrentPage={setCurrentPage} setUser={setUser} />
      )}
      {currentPage === 'forgot-password' && (
        <AuthPage key="forgot-password" currentPage={currentPage} setCurrentPage={setCurrentPage} setUser={setUser} />
      )}
      {currentPage === 'otp-verify' && (
        <AuthPage key="otp-verify" currentPage={currentPage} setCurrentPage={setCurrentPage} setUser={setUser} />
      )}
      {currentPage === 'jobs' && (
        <JobsListingPage key="jobs" setCurrentPage={setCurrentPage} user={user} jobs={jobs} />
      )}
      {currentPage === 'companies' && (
        <CompaniesPage key="companies" setCurrentPage={setCurrentPage} />
      )}
      {currentPage.startsWith('job-') && (
        <SingleJobPage key={currentPage} jobId={currentPage} setCurrentPage={setCurrentPage} user={user} jobs={jobs} />
      )}
      {currentPage === 'dashboard' && user && (
        user.role === 'company' ? (
          <CompanyDashboard key="dashboard" user={user} setCurrentPage={setCurrentPage} setUser={setUser} jobs={jobs} setJobs={setJobs} />
        ) : (
          <UserDashboard key="dashboard" user={user} setCurrentPage={setCurrentPage} setUser={setUser} />
        )
      )}
    </div>
  );
}
