import React, { useState, useEffect } from 'react';

const AlertePersonnalisee = ({ 
  type = 'confirm', // 'confirm', 'alert', 'success', 'error'
  titre = '',
  message = '',
  isOpen = false,
  onConfirm = null,
  onCancel = null,
  boutonConfirmText = 'OK',
  boutonCancelText = 'Annuler'
}) => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setAnimating(true), 10);
    } else {
      setAnimating(false);
      setTimeout(() => setVisible(false), 300);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setAnimating(false);
    setTimeout(() => {
      setVisible(false);
      if (onConfirm) onConfirm();
    }, 300);
  };

  const handleCancel = () => {
    setAnimating(false);
    setTimeout(() => {
      setVisible(false);
      if (onCancel) onCancel();
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && type === 'confirm') {
      handleCancel();
    }
  };

  if (!visible) return null;

  // Configuration des styles selon le type
  const configType = {
    confirm: {
      icone: 'fa-exclamation-triangle',
      couleurIcône: 'text-amber-500',
      fondIcône: 'bg-amber-100',
      boutonConfirm: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
      boutonCancel: 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700'
    },
    alert: {
      icone: 'fa-info-circle',
      couleurIcône: 'text-blue-500',
      fondIcône: 'bg-blue-100',
      boutonConfirm: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
      boutonCancel: null
    },
    success: {
      icone: 'fa-check-circle',
      couleurIcône: 'text-green-500',
      fondIcône: 'bg-green-100',
      boutonConfirm: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
      boutonCancel: null
    },
    error: {
      icone: 'fa-times-circle',
      couleurIcône: 'text-red-500',
      fondIcône: 'bg-red-100',
      boutonConfirm: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600',
      boutonCancel: null
    }
  };

  const config = configType[type] || configType.alert;

  return (
    <div 
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        animating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 transform ${
        animating ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
      }`}>
        {/* Header avec icône */}
        <div className="relative h-32 bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
          <div className={`w-20 h-20 ${config.fondIcône} rounded-2xl flex items-center justify-center shadow-lg`}>
            <i className={`fa-solid ${config.icone} ${config.couleurIcône} text-3xl`}></i>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full blur-3xl opacity-30 -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-sky-50 to-blue-50 rounded-full blur-2xl opacity-20 translate-y-12 -translate-x-12"></div>
        </div>

        {/* Contenu */}
        <div className="p-6 text-center">
          {titre && (
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {titre}
            </h3>
          )}
          <p className="text-slate-600 leading-relaxed mb-6">
            {message}
          </p>

          {/* Boutons */}
          <div className={`flex ${type === 'confirm' ? 'gap-3' : 'justify-center'}`}>
            {type === 'confirm' && (
              <button
                onClick={handleCancel}
                className={`flex-1 py-3 px-6 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${config.boutonCancel}`}
              >
                <i className="fa-solid fa-times mr-2"></i>
                {boutonCancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`flex-1 py-3 px-6 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${config.boutonConfirm}`}
            >
              <i className={`fa-solid ${type === 'confirm' ? 'fa-check' : 'fa-times'} mr-2`}></i>
              {boutonConfirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook pour utiliser l'alerte facilement
export const useAlerte = () => {
  const [alerte, setAlerte] = useState({
    isOpen: false,
    type: 'confirm',
    titre: '',
    message: '',
    onConfirm: null,
    onCancel: null
  });

  const montrerAlerte = (options) => {
    return new Promise((resolve) => {
      setAlerte({
        isOpen: true,
        ...options,
        onConfirm: () => {
          if (options.onConfirm) options.onConfirm();
          resolve(true);
        },
        onCancel: () => {
          if (options.onCancel) options.onCancel();
          resolve(false);
        }
      });
    });
  };

  const fermerAlerte = () => {
    setAlerte(prev => ({ ...prev, isOpen: false }));
  };

  const AlerteComponent = () => (
    <AlertePersonnalisee
      {...alerte}
      onCancel={() => {
        if (alerte.onCancel) alerte.onCancel();
        fermerAlerte();
      }}
      onConfirm={() => {
        if (alerte.onConfirm) alerte.onConfirm();
        fermerAlerte();
      }}
    />
  );

  return { montrerAlerte, fermerAlerte, AlerteComponent };
};

export default AlertePersonnalisee;
