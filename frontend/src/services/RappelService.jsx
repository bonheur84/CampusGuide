import { apiEvenements } from '../api';

class RappelService {
  constructor() {
    this.interval = null;
    this.rappelsEnvoyes = new Set();
  }

  // Vérifier si un rappel a déjà été envoyé pour un événement
  aDejaRappel(evenementId, typeRappel) {
    const cle = `${evenementId}_${typeRappel}`;
    return this.rappelsEnvoyes.has(cle);
  }

  // Marquer un rappel comme envoyé
  marquerRappelEnvoye(evenementId, typeRappel) {
    const cle = `${evenementId}_${typeRappel}`;
    this.rappelsEnvoyes.add(cle);
    // Persister dans localStorage
    const sauvegarde = JSON.parse(localStorage.getItem('campus_rappels') || '{}');
    sauvegarde[cle] = Date.now();
    localStorage.setItem('campus_rappels', JSON.stringify(sauvegarde));
  }

  // Charger les rappels envoyés depuis localStorage
  chargerRappelsEnvoyes() {
    const sauvegarde = JSON.parse(localStorage.getItem('campus_rappels') || '{}');
    Object.keys(sauvegarde).forEach(cle => {
      this.rappelsEnvoyes.add(cle);
    });
  }

  // Calculer le temps restant avant un événement (en heures)
  calculerTempsRestant(dateEvenement, heureEvenement) {
    const maintenant = new Date();
    const [annee, mois, jour] = dateEvenement.split('-').map(Number);
    const [heure, minute] = heureEvenement.split(':').map(Number);
    
    const dateEv = new Date(annee, mois - 1, jour, heure, minute);
    const differenceMs = dateEv - maintenant;
    const differenceHeures = differenceMs / (1000 * 60 * 60);
    
    return differenceHeures;
  }

  // Démarrer le service de rappels
  demarrer(ajouterNotification) {
    this.chargerRappelsEnvoyes();
    
    // Vérifier toutes les heures
    this.interval = setInterval(async () => {
      try {
        const data = await apiEvenements.getAll({ avenir: 'true' });
        const evenements = data.evenements || [];
        
        evenements.forEach(evenement => {
          const tempsRestant = this.calculerTempsRestant(evenement.date, evenement.heure);
          
          // Rappel 24h avant
          if (tempsRestant <= 24 && tempsRestant > 23 && !this.aDejaRappel(evenement.id, '24h')) {
            ajouterNotification(
              'Rappel Événement',
              `"${evenement.titre}" a lieu demain à ${evenement.heure}`,
              'info',
              'fa-bell'
            );
            this.marquerRappelEnvoye(evenement.id, '24h');
          }
          
          // Rappel 1h avant
          if (tempsRestant <= 1 && tempsRestant > 0 && !this.aDejaRappel(evenement.id, '1h')) {
            ajouterNotification(
              'Rappel Événement',
              `"${evenement.titre}" commence dans 1 heure à ${evenement.heure}`,
              'warning',
              'fa-clock'
            );
            this.marquerRappelEnvoye(evenement.id, '1h');
          }
        });
      } catch (err) {
        console.error('Erreur lors de la vérification des rappels:', err);
      }
    }, 60 * 60 * 1000); // Toutes les heures
  }

  // Arrêter le service
  arreter() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export default new RappelService();
