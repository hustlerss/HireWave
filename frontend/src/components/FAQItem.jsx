import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      className={`glass-card rounded-2xl overflow-hidden border transition-all duration-300 ${
        open ? 'border-purple-400/35 bg-white/90 shadow-[0_12px_40px_rgba(147,51,234,0.05)]' : 'border-white/30 hover:border-blue-400/20 shadow-sm'
      }`}
    >
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full p-6 flex justify-between items-center text-left hover:bg-slate-50/20 transition-colors duration-300"
      >
        <span className="flex items-center gap-3">
          <HelpCircle className={`w-5 h-5 flex-shrink-0 ${open ? 'text-purple-600' : 'text-slate-400'}`} />
          <span className="font-semibold text-slate-800 text-base md:text-lg">{question}</span>
        </span>
        <motion.div 
          animate={{ rotate: open ? 180 : 0 }} 
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`p-1 rounded-full ${open ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-slate-200/25"
          >
            <p className="p-6 text-slate-600 text-sm md:text-base leading-relaxed bg-slate-50/10">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
