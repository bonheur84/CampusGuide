import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-[24px] p-6 border-t-[6px] border-slate-200 shadow-sm animate-pulse">
      {/* Header avec avatar et nom */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 rounded-2xl bg-slate-200"></div>
        <div className="flex-1">
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
      
      {/* Spécialité */}
      <div className="p-4 rounded-2xl mb-5 bg-slate-50">
        <div className="h-3 bg-slate-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
      </div>
      
      {/* Bio */}
      <div className="mb-4">
        <div className="h-3 bg-slate-200 rounded w-1/5 mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
      </div>
      
      {/* Badge disponibilité */}
      <div className="mb-5">
        <div className="h-6 bg-slate-200 rounded-full w-24"></div>
      </div>
      
      {/* Bouton */}
      <div className="h-12 bg-slate-200 rounded-xl"></div>
    </div>
  );
};

export default SkeletonCard;
