import React, { createContext, useState, useEffect } from 'react';

export const ContexteUtilisateur = createContext();

export const FournisseurUtilisateur = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState({
    prenom: 'Administrateur',
    nom: 'admin',
    email: 'nzaubonheur84@gmail.com',
    password: 'admin'
  });
  
  const [photoProfil, setPhotoProfil] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userSauvegarde = localStorage.getItem('campus_user');
    if (userSauvegarde) {
      setUtilisateur(JSON.parse(userSauvegarde));
    }

    const photoSauvegardee = localStorage.getItem('profilePhoto');
    if (photoSauvegardee) {
      setPhotoProfil(photoSauvegardee);
    }

    const notifsSauvegardees = localStorage.getItem('campus_notifications');
    if (notifsSauvegardees) {
      setNotifications(JSON.parse(notifsSauvegardees));
    }
  }, []);

  const mettreAJourUtilisateur = (nouvelUtilisateur) => {
    setUtilisateur(nouvelUtilisateur);
    localStorage.setItem('campus_user', JSON.stringify(nouvelUtilisateur));
  };

  const mettreAJourPhoto = (nouvellePhoto) => {
    setPhotoProfil(nouvellePhoto);
    localStorage.setItem('profilePhoto', nouvellePhoto);
  };
  const ajouterNotification = (titre, message, type = 'info', icone = 'fa-bell') => {
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
      localStorage.setItem('campus_notifications', JSON.stringify(maj));
      return maj;
    });
  };

  const marquerLue = (id) => {
    setNotifications(prev => {
      const maj = prev.map(n => n.id === id ? { ...n, lue: true } : n);
      localStorage.setItem('campus_notifications', JSON.stringify(maj));
      return maj;
    });
  };

  const effacerNotification = (id) => {
    setNotifications(prev => {
      const maj = prev.filter(n => n.id !== id);
      localStorage.setItem('campus_notifications', JSON.stringify(maj));
      return maj;
    });
  };

  const toutMarquerLu = () => {
    setNotifications(prev => {
      const maj = prev.map(n => ({ ...n, lue: true }));
      localStorage.setItem('campus_notifications', JSON.stringify(maj));
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
