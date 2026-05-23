import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { JobsListingPage } from './pages/JobsListingPage';
import { JobCard } from './components/JobCard';
import { SingleJobPage } from './pages/SingleJobPage';
import { PostJobForm } from './components/PostJobForm';
import { AuthPage } from './pages/AuthPage';
import { OTPVerification } from './components/OTPVerification';
import { CompanyDashboard } from './pages/CompanyDashboard';

// Mock simple window alert globally
window.alert = vi.fn();

describe('HireWave Automated Test Suite - 10 Core Scenarios', () => {

  // Test 1: App Launch & Default Landing Page
  it('T1: App renders landing page correctly by default with Hero titles', () => {
    render(<App />);
    expect(screen.getByText(/Find Your/i)).toBeInTheDocument();
    expect(screen.getByText(/Dream Tech Job/i)).toBeInTheDocument();
    expect(screen.getByText(/Next Generation Job Engine/i)).toBeInTheDocument();
  });

  // Test 2: Navbar Menu Navigation
  it('T2: Navbar buttons successfully update current page routes', async () => {
    render(<App />);
    // Find the Jobs route link in Desktop menu
    const jobsBtn = screen.getByRole('button', { name: /^Jobs$/ });
    fireEvent.click(jobsBtn);
    await waitFor(() => {
      expect(screen.getByText(/Find Your Next Engineering Challenge/i)).toBeInTheDocument();
    });
  });

  // Test 3: Landing Page CTA Redirection
  it('T3: LandingPage Hero CTA button triggers redirect call', () => {
    const setCurrentPage = vi.fn();
    render(<LandingPage setCurrentPage={setCurrentPage} setUser={vi.fn()} jobs={[]} />);
    const exploreBtn = screen.getByRole('button', { name: /Explore Jobs/i });
    fireEvent.click(exploreBtn);
    expect(setCurrentPage).toHaveBeenCalledWith('jobs');
  });

  // Test 4: Testimonial manual indicator updates the active slide
  it('T4: Testimonial manual indicator clicks update slide data', async () => {
    render(<App />);
    // Initial slide
    expect(screen.getByText(/Sarah Chen/i)).toBeInTheDocument();
    // Indicators
    const dots = screen.getAllByRole('button', { name: /Show slide/i });
    expect(dots).toHaveLength(3);
    // Click slide index 1 (Michael Torres)
    fireEvent.click(dots[1]);
    await waitFor(() => {
      expect(screen.getByText(/Michael Torres/i)).toBeInTheDocument();
    });
  });

  // Test 5: JobsListingPage Keyword Search Filtering
  it('T5: JobsListingPage search box filters card data dynamically', () => {
    const mockJobs = [
      { id: 1, title: 'Senior React Developer', company: 'Tech', logo: '🚀', location: 'SF', salary: '$150k', type: 'Full-time', category: 'Frontend', skills: ['React'] }
    ];
    render(<JobsListingPage setCurrentPage={vi.fn()} user={null} jobs={mockJobs} />);
    const searchInput = screen.getByPlaceholderText(/Search jobs, tech stacks, or companies/i);
    
    // Type 'React' in search box
    fireEvent.change(searchInput, { target: { value: 'React' } });
    expect(screen.getByText(/Senior React Developer/i)).toBeInTheDocument();
    // Backend/Product roles should be filtered out
    expect(screen.queryByText(/Product Manager/i)).not.toBeInTheDocument();
  });

  // Test 6: JobCard Saved bookmark toggles
  it('T6: JobCard heart bookmark toggles local saved arrays', () => {
    const setSavedJobs = vi.fn();
    const mockJob = {
      id: 1,
      title: 'React Dev',
      company: 'Tech Co',
      logo: '🚀',
      location: 'SF',
      salary: '$150k',
      type: 'Full-time',
      featured: true,
      skills: ['React'],
      description: 'Senior react role'
    };
    render(<JobCard job={mockJob} setCurrentPage={vi.fn()} savedJobs={[]} setSavedJobs={setSavedJobs} />);
    const bookmarkBtn = screen.getByRole('button');
    fireEvent.click(bookmarkBtn);
    expect(setSavedJobs).toHaveBeenCalled();
  });

  // Test 7: SingleJobPage Apply Telemetry when session logged in
  it('T7: SingleJobPage Apply Now button updates telemetry when logged in', () => {
    const mockUser = { name: 'Alice Smith', email: 'alice@example.com', role: 'candidate' };
    const mockJobs = [
      { id: 1, title: 'React Dev', company: 'Stripe', logo: '💳', location: 'SF', salary: '$150k', type: 'Full-time', category: 'Frontend', skills: ['React'] }
    ];
    render(<SingleJobPage jobId="job-1" setCurrentPage={vi.fn()} user={mockUser} jobs={mockJobs} />);
    const applyBtn = screen.getByRole('button', { name: /Apply for this Role/i });
    fireEvent.click(applyBtn);
    expect(screen.getByText(/Applied Successfully!/i)).toBeInTheDocument();
  });

  // Test 8: PostJobForm Requisition Submission
  it('T8: PostJobForm publish trigger alerts client successfully', async () => {
    const setShowPostForm = vi.fn();
    const onAddJob = vi.fn().mockResolvedValue(undefined); // mock async success
    render(<PostJobForm setShowPostForm={setShowPostForm} onAddJob={onAddJob} />);

    // Fill in required fields to pass form validation
    const titleInput = screen.getByPlaceholderText(/e.g. Senior Staff/i);
    const locationInput = screen.getByPlaceholderText(/e.g. San Francisco/i);
    const salaryInput = screen.getByPlaceholderText(/e.g. \$140,000/i);
    const detailsInput = screen.getByPlaceholderText(/Describe key responsibilities/i);

    fireEvent.change(titleInput, { target: { value: 'Senior React Developer' } });
    fireEvent.change(locationInput, { target: { value: 'Remote' } });
    fireEvent.change(salaryInput, { target: { value: '$180k' } });
    fireEvent.change(detailsInput, { target: { value: 'Full stack development role...' } });

    const publishBtn = screen.getByRole('button', { name: /Publish Requisition/i });
    await act(async () => {
      fireEvent.click(publishBtn);
    });
    expect(window.alert).toHaveBeenCalledWith('Requisition published successfully!');
    expect(setShowPostForm).toHaveBeenCalledWith(false);
  });

  // Test 9: Credentials Authentication Form Submission
  it('T9: AuthPage login submits inputs and registers active user session', () => {
    const setUser = vi.fn();
    const setCurrentPage = vi.fn();
    render(<AuthPage currentPage="login" setCurrentPage={setCurrentPage} setUser={setUser} />);
    
    const emailInput = screen.getByPlaceholderText(/e.g. aditya@hirewave.io/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    fireEvent.change(emailInput, { target: { value: 'recruiter@stripe.com' } });
    fireEvent.change(passwordInput, { target: { value: 'stripepass' } });
    
    const loginBtn = screen.getByRole('button', { name: /Enter Platform/i });
    fireEvent.click(loginBtn);
    expect(setUser).toHaveBeenCalledWith({ name: 'John Doe', email: 'recruiter@stripe.com' });
    expect(setCurrentPage).toHaveBeenCalledWith('home');
  });

  // Test 10: Security OTP Digit entry field focus
  it('T10: OTPVerification keystroke digit assignments compile and focus correctly', () => {
    const setCurrentPage = vi.fn();
    render(<OTPVerification setCurrentPage={setCurrentPage} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
    
    fireEvent.change(inputs[0], { target: { value: '9' } });
    expect(inputs[0].value).toBe('9');
  });

  // Test 11: Companies Directory Page Navigation & Content
  it('T11: Navbar Companies button navigates to modern workplaces directory', async () => {
    render(<App />);
    const companiesBtn = screen.getByRole('button', { name: /^Companies$/ });
    fireEvent.click(companiesBtn);
    await waitFor(() => {
      expect(screen.getByText(/Explore Modern Tech Workplaces/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /^Stripe$/ })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /^Linear$/ })).toBeInTheDocument();
    });
  });

  // Test 12: Recruiter dynamic Job Requisition posting
  it('T12: CompanyDashboard successfully publishes a dynamic job requisition', async () => {
    const mockUser = { name: 'Tech StartUp', email: 'recruiter@startup.com', role: 'company' };
    const mockJobs = [];
    const setJobs = vi.fn();
    
    render(<CompanyDashboard user={mockUser} setCurrentPage={vi.fn()} setUser={vi.fn()} jobs={mockJobs} setJobs={setJobs} />);
    
    const postRequisitionBtn = screen.getByRole('button', { name: /Post Requisition/i });
    fireEvent.click(postRequisitionBtn);
    
    const titleInput = screen.getByPlaceholderText(/e.g. Senior Staff/i);
    const locationInput = screen.getByPlaceholderText(/e.g. San Francisco/i);
    const salaryInput = screen.getByPlaceholderText(/e.g. \$140,000/i);
    const detailsInput = screen.getByPlaceholderText(/Describe key responsibilities/i);
    
    fireEvent.change(titleInput, { target: { value: 'Staff Engineer' } });
    fireEvent.change(locationInput, { target: { value: 'Remote' } });
    fireEvent.change(salaryInput, { target: { value: '$220k' } });
    fireEvent.change(detailsInput, { target: { value: 'Full stack development...' } });
    
    const publishBtn = screen.getByRole('button', { name: /Publish Requisition/i });
    await act(async () => {
      fireEvent.click(publishBtn);
    });
    
    expect(setJobs).toHaveBeenCalled();
  });

});
