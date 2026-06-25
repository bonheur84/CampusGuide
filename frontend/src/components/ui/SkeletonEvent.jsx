import React from 'react';

const SkeletonEvent = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
      <div className="flex gap-4">
        {/* Date */}
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex flex-col items-center justify-center text-white">
          <div className="h-5 bg-white/30 rounded w-8 mb-1"></div>
          <div className="h-3 bg-white/30 rounded w-6"></div>
        </div>
        
        {/* Contenu */}
        <div className="flex-1">
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
          <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-slate-200 rounded w-2/3 mb-3"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-slate-200 rounded-full w-20"></div>
            <div className="h-6 bg-slate-200 rounded-full w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonEvent;
