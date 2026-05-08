import React, { createContext, useState, useEffect } from 'react';
import { apiNotifications } from '../api';

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

  useEffect(() => {
    const userSauvegarde = localStorage.getItem('campus_user');
    if (userSauvegarde) {
      const user = JSON.parse(userSauvegarde);
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
    return () => clearInterval(interval);
  }, [utilisateur.id, utilisateur.role]);

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
      return;
    }
    setUtilisateur(nouvelUtilisateur);
    localStorage.setItem('campus_user', JSON.stringify(nouvelUtilisateur));
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
