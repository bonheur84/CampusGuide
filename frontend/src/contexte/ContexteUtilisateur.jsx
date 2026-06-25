import React, { createContext, useState, useEffect } from 'react';
import { apiNotifications } from '../api';
import rappelService from '../services/RappelService';
import offlineService from '../services/OfflineService';

export const ContexteUtilisateur = createContext();

const cleNotifsUser = (userId) => `campus_notifications_${userId}`;
const clePhotoUser  = (userId) => `campus_photo_${userId}`;

export const FournisseurUtilisateur = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState({
    id: '',
    prenom: '',
    nom: '',
    email: '',
    role: 'etudiant'
  });

  const [photoProfil, setPhotoProfil] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [pret, setPret] = useState(false);

  useEffect(() => {
    const userSauvegarde = localStorage.getItem('campus_user');
    if (userSauvegarde) {
      const user = JSON.parse(userSauvegarde);
      
      // S'assurer que prenom et nom sont séparés correctement
      if (!user.prenom && user.nom) {
        const nomParts = user.nom.split(' ');
        user.prenom = nomParts[0] || user.nom;
        user.nom = nomParts.slice(1).join(' ') || '';
      }
      
      // S'assurer que promotion est défini (utiliser annee si promotion n'existe pas)
      if (!user.promotion && user.annee) {
        user.promotion = user.annee;
      }
      
      setUtilisateur(user);

      const notifsSauvegardees = localStorage.getItem(cleNotifsUser(user.id));
      if (notifsSauvegardees) {
        setNotifications(JSON.parse(notifsSauvegardees));
      }

      const photoSauvegardee = localStorage.getItem(clePhotoUser(user.id));
      if (photoSauvegardee) {
        setPhotoProfil(photoSauvegardee);
      }
    }
    setPret(true);
  }, []);

  useEffect(() => {
    if (!utilisateur.id || utilisateur.role === 'admin') return;

    const chargerNotifsServeur = async () => {
      try {
        const data = await apiNotifications.getAll();
        setNotifications(prev => {
          const IDsExistants = new Set(prev.map(n => n.id));
          const nouvelles = data.notifications.filter(n => !IDsExistants.has(n.id));
          const maj = [...nouvelles, ...prev];
          localStorage.setItem(cleNotifsUser(utilisateur.id), JSON.stringify(maj));
          return maj;
        });
      } catch (err) {
        console.error('Erreur synchro notifications:', err);
      }
    };

    chargerNotifsServeur();
    const interval = setInterval(chargerNotifsServeur, 30000);
    
    // Démarrer le service de rappels
    rappelService.demarrer(ajouterNotification);
    
    // Sauvegarder les données critiques pour mode hors ligne
    const sauvegarderDonnees = () => {
      offlineService.sauvegarderDonneesCritiques({
        utilisateur,
        notifications
      });
    };

    sauvegarderDonnees();
    const intervalSauvegarde = setInterval(sauvegarderDonnees, 60000); // Toutes les minutes
    
    // Traiter la file d'attente quand on se connecte
    if (navigator.onLine) {
      offlineService.traiterFileAttente(async (action) => {
        // Ici on peut exécuter les actions en attente
        console.log('Traitement action hors ligne:', action);
        return { succes: true };
      });
    }
    
    return () => {
      clearInterval(interval);
      clearInterval(intervalSauvegarde);
      rappelService.arreter();
    };
  }, [utilisateur.id, utilisateur.role, utilisateur, notifications]);

  useEffect(() => {
    if (!utilisateur.id) return;
    const notifsSauvegardees = localStorage.getItem(cleNotifsUser(utilisateur.id));
    setNotifications(notifsSauvegardees ? JSON.parse(notifsSauvegardees) : []);
    const photoSauvegardee = localStorage.getItem(clePhotoUser(utilisateur.id));
    setPhotoProfil(photoSauvegardee || null);
  }, [utilisateur.id]);

  const mettreAJourUtilisateur = (nouvelUtilisateur) => {
    if (!nouvelUtilisateur) {
      setUtilisateur({ id: '', prenom: '', nom: '', email: '', role: 'etudiant' });
      setNotifications([]);
      setPhotoProfil(null);
      localStorage.removeItem('campus_user');
      localStorage.removeItem('campus_token');
      localStorage.removeItem('campus_user_id');
      window.dispatchEvent(new Event('userChanged'));
      return;
    }
    setUtilisateur(nouvelUtilisateur);
    localStorage.setItem('campus_user', JSON.stringify(nouvelUtilisateur));
    window.dispatchEvent(new Event('userChanged'));
  };

  const mettreAJourPhoto = (nouvellePhoto) => {
    setPhotoProfil(nouvellePhoto);
    if (utilisateur.id) {
      localStorage.setItem(clePhotoUser(utilisateur.id), nouvellePhoto);
    }
  };

  const ajouterNotification = (titre, message, type = 'info', icone = 'fa-bell') => {
    if (utilisateur.role === 'admin') return;

    const nouvelleNotif = {
      id: Date.now(),
      titre,
      message,
      type,
      icone,
      date: new Date().toLocaleDateString(),
      heure: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lue: false
    };

    setNotifications(prev => {
      const maj = [nouvelleNotif, ...prev];
      localStorage.setItem(cleNotifsUser(utilisateur.id), JSON.stringify(maj));
      return maj;
    });
  };

  const marquerLue = async (id) => {
    try {
      if (typeof id === 'string' && id.length > 20) {
        await apiNotifications.marquerLu(id);
      }
    } catch (err) {}

    setNotifications(prev => {
      const maj = prev.map(n => n.id === id ? { ...n, lue: true, lu: true } : n);
      localStorage.setItem(cleNotifsUser(utilisateur.id), JSON.stringify(maj));
      return maj;
    });
  };

  const effacerNotification = (id) => {
    setNotifications(prev => {
      const maj = prev.filter(n => n.id !== id);
      localStorage.setItem(cleNotifsUser(utilisateur.id), JSON.stringify(maj));
      return maj;
    });
  };

  const toutMarquerLu = () => {
    setNotifications(prev => {
      const maj = prev.map(n => ({ ...n, lue: true }));
      localStorage.setItem(cleNotifsUser(utilisateur.id), JSON.stringify(maj));
      return maj;
    });
  };

  return (
    <ContexteUtilisateur.Provider value={{
      utilisateur,
      photoProfil,
      notifications,
      pret,
      mettreAJourUtilisateur,
      mettreAJourPhoto,
      ajouterNotification,
      marquerLue,
      effacerNotification,
      toutMarquerLu
    }}>
      {children}
    </ContexteUtilisateur.Provider>
  );
};
