import React, { useState, useEffect } from 'react';

const OfflineIndicator = () => {
  const [estEnLigne, setEstEnLigne] = useState(navigator.onLine);
  const [afficherBanniere, setAfficherBanniere] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setEstEnLigne(true);
      setAfficherBanniere(true);
      // Cacher la bannière après 3 secondes
      setTimeout(() => setAfficherBanniere(false), 3000);
    };

    const handleOffline = () => {
      setEstEnLigne(false);
      setAfficherBanniere(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier l'état initial
    if (!navigator.onLine) {
      setAfficherBanniere(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!afficherBanniere) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[9999] px-4 py-3 text-center text-sm font-bold text-white transform transition-all duration-300 ${
      estEnLigne ? 'bg-green-500' : 'bg-amber-500'
    }`}>
      <div className="flex items-center justify-center gap-2">
        <i className={`fas ${estEnLigne ? 'fa-check-circle' : 'fa-wifi'}`}></i>
        <span>
          {estEnLigne 
            ? 'Vous êtes de nouveau en ligne !' 
            : 'Vous êtes hors ligne - Certaines fonctionnalités sont limitées'}
        </span>
      </div>
    </div>
  );
};

export default OfflineIndicator;