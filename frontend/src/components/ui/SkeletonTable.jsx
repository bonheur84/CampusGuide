import React from 'react';

const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-100 p-5">
        <div className="flex gap-4">
          <div className="h-4 bg-slate-200 rounded w-1/5"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/6"></div>
          <div className="h-4 bg-slate-200 rounded w-1/5"></div>
          <div className="h-4 bg-slate-200 rounded w-1/6"></div>
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-slate-50">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="p-5 flex gap-4">
            <div className="h-4 bg-slate-200 rounded w-1/5 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-1/6 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-1/5 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-1/6 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTable;
