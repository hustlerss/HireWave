import React from 'react';
import { Filter } from 'lucide-react';

export const FilterSidebar = ({ filters, setFilters }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/50 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Filter className="w-5 h-5" /> Filters
      </h3>

      {/* Level Filter */}
      <div className="mb-8">
        <h4 className="font-semibold text-slate-900 mb-3">Level</h4>
        <div className="space-y-2">
          {['Junior', 'Mid-level', 'Senior'].map(level => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" />
              <span className="text-slate-600">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-8">
        <h4 className="font-semibold text-slate-900 mb-3">Type</h4>
        <div className="space-y-2">
          {['Full-time', 'Part-time', 'Contract', 'Remote'].map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" />
              <span className="text-slate-600">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <h4 className="font-semibold text-slate-900 mb-3">Location</h4>
        <div className="space-y-2">
          {['Remote', 'On-site', 'Hybrid'].map(location => (
            <label key={location} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" />
              <span className="text-slate-600">{location}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
