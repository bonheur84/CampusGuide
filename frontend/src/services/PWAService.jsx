class PWAService {
  constructor() {
    this.deferredPrompt = null;
    this.estInstallable = false;
    this.estInstalle = false;
    
    this.initialiser();
  }

  initialiser() {
    // Détecter si l'app peut être installée
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.estInstallable = true;
      this.notifierChangement();
    });

    // Détecter si l'app est déjà installée
    window.addEventListener('appinstalled', () => {
      this.estInstalle = true;
      this.estInstallable = false;
      this.deferredPrompt = null;
      this.notifierChangement();
    });

    // Vérifier si déjà installée (mode standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.estInstalle = true;
    }
  }

  // Demander l'installation de l'app
  async installer() {
    if (!this.deferredPrompt) {
      return { succes: false, message: 'L\'application n\'est pas installable' };
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      this.estInstallable = false;
      this.deferredPrompt = null;
      return { succes: true, message: 'Application installée avec succès !' };
    } else {
      return { succes: false, message: 'Installation annulée par l\'utilisateur' };
    }
  }

  // Vérifier si l'app est installable
  peutInstaller() {
    return this.estInstallable && !this.estInstalle;
  }

  // Vérifier si l'app est installée
  estInstallee() {
    return this.estInstalle;
  }

  // Demander la permission pour les notifications push
  async demanderPermissionNotifications() {
    if (!('Notification' in window)) {
      return { succes: false, message: 'Les notifications ne sont pas supportées' };
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      return { succes: true, message: 'Notifications activées !' };
    } else if (permission === 'denied') {
      return { succes: false, message: 'Notifications bloquées' };
    } else {
      return { succes: false, message: 'Permission non accordée' };
    }
  }

  // Envoyer une notification locale
  envoyerNotification(titre, options = {}) {
    if (!('Notification' in window)) {
      console.warn('Notifications non supportées');
      return;
    }

    if (Notification.permission === 'granted') {
      const notification = new Notification(titre, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options
      });

      notification.onclick = (e) => {
        e.preventDefault();
        window.focus();
        notification.close();
      };

      return notification;
    }
  }

  // Programmer une notification
  programmerNotification(titre, contenu, delaiMs) {
    setTimeout(() => {
      this.envoyerNotification(titre, {
        body: contenu,
        icon: '/icon-192.png',
        tag: 'campusguide-notification',
        requireInteraction: true
      });
    }, delaiMs);
  }

  // Activer le mode plein écran
  async activerPleinEcran() {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        return { succes: true };
      }
      return { succes: false, message: 'Mode plein écran non supporté' };
    } catch (err) {
      return { succes: false, message: err.message };
    }
  }

  // Désactiver le mode plein écran
  async desactiverPleinEcran() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return { succes: true };
      }
      return { succes: false, message: 'Pas en mode plein écran' };
    } catch (err) {
      return { succes: false, message: err.message };
    }
  }

  // Vérifier le statut du mode plein écran
  estPleinEcran() {
    return !!document.fullscreenElement;
  }

  // Partager du contenu (Web Share API)
  async partager(donnees) {
    if (!navigator.share) {
      return { 
        succes: false, 
        message: 'Le partage n\'est pas supporté sur ce navigateur',
        fallback: true 
      };
    }

    try {
      await navigator.share({
        title: donnees.titre || 'CampusGuide',
        text: donnees.texte || '',
        url: donnees.url || window.location.href
      });
      return { succes: true };
    } catch (err) {
      if (err.name !== 'AbortError') {
        return { succes: false, message: err.message };
      }
      return { succes: false, message: 'Partage annulé' };
    }
  }

  // Copier dans le presse-papier
  async copierPressePapier(texte) {
    try {
      await navigator.clipboard.writeText(texte);
      return { succes: true, message: 'Copié !' };
    } catch (err) {
      // Fallback pour les anciens navigateurs
      const textarea = document.createElement('textarea');
      textarea.value = texte;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        return { succes: true, message: 'Copié !' };
      } catch (err) {
        return { succes: false, message: 'Impossible de copier' };
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }

  // Détecter la connexion réseau
  getEtatConnexion() {
    return {
      enLigne: navigator.onLine,
      type: navigator.connection?.effectiveType || 'unknown',
      downlink: navigator.connection?.downlink || 0
    };
  }

  // Écouter les changements de connexion
  ecouterChangementsConnexion(callback) {
    const handleOnline = () => callback({ enLigne: true });
    const handleOffline = () => callback({ enLigne: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }

  // Obtenir les informations sur l'appareil
  getInfosAppareil() {
    return {
      userAgent: navigator.userAgent,
      plateforme: navigator.platform,
      langue: navigator.language,
      enLigne: navigator.onLine,
      ecran: {
        largeur: window.screen.width,
        hauteur: window.screen.height
      },
      fenetre: {
        largeur: window.innerWidth,
        hauteur: window.innerHeight
      }
    };
  }

  // Gestionnaires d'événements
  notifierChangement() {
    // Peut être étendu avec un système d'événements
    window.dispatchEvent(new CustomEvent('pwa:changement', {
      detail: {
        estInstallable: this.estInstallable,
        estInstalle: this.estInstalle
      }
    }));
  }
}

export default new PWAService();