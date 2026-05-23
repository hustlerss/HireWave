import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { buttonHover } from '../utils/animations';

export const OTPVerification = ({ setCurrentPage }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center mx-auto mb-4 border border-blue-400/25 shadow-lg shadow-blue-500/10">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Security Check</h2>
        <p className="text-slate-400 text-sm">We sent a 6-digit confirmation code to your email.</p>
      </div>

      <div className="flex gap-2 justify-center py-2">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-${idx}`}
            type="text"
            maxLength="1"
            value={digit}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onChange={(e) => handleChange(idx, e.target.value)}
            className="w-12 h-14 text-center text-xl font-extrabold border border-slate-200 bg-white/60 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl outline-none transition-all duration-300 shadow-sm"
          />
        ))}
      </div>

      <motion.button
        variants={buttonHover}
        whileHover="whileHover"
        whileTap="whileTap"
        onClick={() => setCurrentPage('home')}
        className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:-translate-y-0.5 transition duration-300 flex items-center justify-center gap-2"
      >
        Verify Email & Sign In <ArrowRight className="w-4 h-4" />
      </motion.button>

      <p className="text-center text-slate-500 text-xs font-semibold">
        Didn't receive the email?{' '}
        <button className="text-blue-600 font-bold hover:underline">
          Resend Code
        </button>
      </p>
    </div>
  );
};
