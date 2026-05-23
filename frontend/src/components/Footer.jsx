import React from 'react';
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative bg-slate-950 text-slate-400 pt-24 pb-12 border-t border-slate-900 overflow-hidden">
      {/* Decorative blurred lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[120px] -translate-y-1/2"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[120px] -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 mb-16">
          {/* Brand Info */}
          <div className="col-span-2 space-y-6">
            <h3 className="text-white font-bold text-2xl tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              HireWave
            </h3>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Empowering engineers, designers, and startups to connect, hire, and scale world-class teams with visual excellence.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Mail, href: '#', label: 'Email' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 hover:border-purple-500 hover:text-purple-400 flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 1 - Seeker */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">For Job Seekers</h4>
            <ul className="space-y-2.5 text-sm">
              {['Browse Jobs', 'Explore Companies', 'Salary Estimates', 'Career Advice'].map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white transition duration-200 flex items-center gap-0.5 group">
                    {link} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Companies */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">For Companies</h4>
            <ul className="space-y-2.5 text-sm">
              {['Post a Vacancy', 'Talent Search', 'Pricing Plans', 'Enterprise Solutions'].map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white transition duration-200 flex items-center gap-0.5 group">
                    {link} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Resource */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              {['Help Center', 'API Guide', 'Press Kit', 'Contact Support'].map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-white transition duration-200 flex items-center gap-0.5 group">
                    {link} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Gradient divider line */}
        <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 h-[1px] w-full mb-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} HireWave. Designed for high-growth tech professionals. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white transition duration-200">Terms of Service</a>
            <a href="#" className="hover:text-white transition duration-200">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
