import React, { useState, useEffect } from 'react';
import pwaService from '../services/PWAService';

const PWAFeatures = () => {
  const [peutInstaller, setPeutInstaller] = useState(false);
  const [estInstalle, setEstInstalle] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Vérifier l'état initial
    setPeutInstaller(pwaService.peutInstaller());
    setEstInstalle(pwaService.estInstallee());
    setNotificationPermission(Notification.permission);

    // Écouter les changements
    const handleChangement = (e) => {
      setPeutInstaller(e.detail.estInstallable);
      setEstInstalle(e.detail.estInstalle);
    };

    window.addEventListener('pwa:changement', handleChangement);

    return () => {
      window.removeEventListener('pwa:changement', handleChangement);
    };
  }, []);

  const handleInstaller = async () => {
    const resultat = await pwaService.installer();
    setMessage(resultat.message);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleNotifications = async () => {
    const resultat = await pwaService.demanderPermissionNotifications();
    setNotificationPermission(Notification.permission);
    setMessage(resultat.message);
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePleinEcran = async () => {
    const resultat = await pwaService.activerPleinEcran();
    setMessage(resultat.succes ? 'Mode plein écran activé' : resultat.message);
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePartager = async () => {
    const resultat = await pwaService.partager({
      titre: 'CampusGuide',
      texte: 'Découvrez CampusGuide, l\'application qui facilite la vie étudiante !',
      url: window.location.href
    });
    
    if (!resultat.succes && !resultat.fallback) {
      setMessage(resultat.message);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const infosAppareil = pwaService.getInfosAppareil();
  const etatConnexion = pwaService.getEtatConnexion();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Fonctionnalités PWA</h2>
        <p className="text-slate-600">Optimisez votre expérience avec les fonctionnalités avancées</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Installation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <i className="fas fa-download text-primary text-xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Installer l'application</h3>
              <p className="text-xs text-slate-500">Accès rapide depuis votre écran d'accueil</p>
            </div>
          </div>
          {peutInstaller && !estInstalle ? (
            <button
              onClick={handleInstaller}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all"
            >
              <i className="fas fa-download mr-2"></i>
              Installer CampusGuide
            </button>
          ) : estInstalle ? (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <i className="fas fa-check-circle"></i>
              <span>Application installée</span>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Utilisez le menu du navigateur pour installer l'application</p>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-bell text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">Recevez des alertes importantes</p>
            </div>
          </div>
          {notificationPermission === 'granted' ? (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <i className="fas fa-check-circle"></i>
              <span>Notifications activées</span>
            </div>
          ) : (
            <button
              onClick={handleNotifications}
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all"
            >
              <i className="fas fa-bell mr-2"></i>
              Activer les notifications
            </button>
          )}
        </div>

        {/* Plein écran */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-expand text-slate-700 text-xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Mode plein écran</h3>
              <p className="text-xs text-slate-500">Profitez d'une vue immersive</p>
            </div>
          </div>
          <button
            onClick={handlePleinEcran}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            <i className="fas fa-expand mr-2"></i>
            Activer plein écran
          </button>
        </div>

        {/* Partage */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-share-alt text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Partager l'application</h3>
              <p className="text-xs text-slate-500">Faites découvrir CampusGuide</p>
            </div>
          </div>
          <button
            onClick={handlePartager}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
          >
            <i className="fas fa-share mr-2"></i>
            Partager
          </button>
        </div>
      </div>

      {/* Informations techniques */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <i className="fas fa-info-circle text-primary"></i>
          Informations sur votre appareil
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 mb-1">Plateforme</p>
            <p className="font-medium text-slate-900">{infosAppareil.plateforme}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Langue</p>
            <p className="font-medium text-slate-900">{infosAppareil.langue}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">État de la connexion</p>
            <p className="font-medium text-slate-900">
              {etatConnexion.enLigne ? (
                <span className="text-green-600">En ligne ({etatConnexion.type})</span>
              ) : (
                <span className="text-amber-600">Hors ligne</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Résolution d'écran</p>
            <p className="font-medium text-slate-900">
              {infosAppareil.ecran.largeur} x {infosAppareil.ecran.hauteur}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAFeatures;