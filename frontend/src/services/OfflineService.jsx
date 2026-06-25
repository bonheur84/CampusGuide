class OfflineService {
  constructor() {
    this.cleFileAttente = 'campus_offline_queue';
    this.cleDonneesCache = 'campus_offline_cache';
  }

  // Sauvegarder une action pour exécution ultérieure (quand en ligne)
  ajouterAFileAttente(action) {
    const fileAttente = this.obtenirFileAttente();
    const nouvelleAction = {
      id: Date.now(),
      action,
      timestamp: new Date().toISOString()
    };
    fileAttente.push(nouvelleAction);
    localStorage.setItem(this.cleFileAttente, JSON.stringify(fileAttente));
  }

  // Obtenir la file d'attente
  obtenirFileAttente() {
    const fileAttente = localStorage.getItem(this.cleFileAttente);
    return fileAttente ? JSON.parse(fileAttente) : [];
  }

  // Vider la file d'attente
  viderFileAttente() {
    localStorage.removeItem(this.cleFileAttente);
  }

  // Mettre en cache des données pour accès hors ligne
  mettreEnCache(cle, donnees) {
    const cache = this.obtenirCache();
    cache[cle] = {
      donnees,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(this.cleDonneesCache, JSON.stringify(cache));
  }

  // Obtenir les données en cache
  obtenirCache() {
    const cache = localStorage.getItem(this.cleDonneesCache);
    return cache ? JSON.parse(cache) : {};
  }

  // Obtenir des données spécifiques du cache
  obtenirDuCache(cle) {
    const cache = this.obtenirCache();
    return cache[cle]?.donnees || null;
  }

  // Vérifier si des données sont en cache et valides (moins de 24h)
  estCacheValide(cle, dureeMaxHeures = 24) {
    const cache = this.obtenirCache();
    if (!cache[cle]) return false;

    const timestamp = new Date(cache[cle].timestamp);
    const maintenant = new Date();
    const differenceHeures = (maintenant - timestamp) / (1000 * 60 * 60);

    return differenceHeures < dureeMaxHeures;
  }

  // Traiter la file d'attente (exécuter les actions quand en ligne)
  async traiterFileAttente(executeurAction) {
    const fileAttente = this.obtenirFileAttente();
    
    if (fileAttente.length === 0) return;

    const resultats = [];
    
    for (const item of fileAttente) {
      try {
        const resultat = await executeurAction(item.action);
        resultats.push({ succes: true, id: item.id, resultat });
      } catch (erreur) {
        console.error('Erreur lors du traitement de l\'action:', erreur);
        resultats.push({ succes: false, id: item.id, erreur: erreur.message });
      }
    }

    // Vider la file d'attente après traitement
    this.viderFileAttente();
    
    return resultats;
  }

  // Sauvegarder les données importantes pour mode hors ligne
  sauvegarderDonneesCritiques(donnees) {
    const donneesCritiques = {
      mentors: donnees.mentors || [],
      clubs: donnees.clubs || [],
      evenements: donnees.evenements || [],
      utilisateur: donnees.utilisateur || null
    };
    
    localStorage.setItem(this.cleDonneesCache, JSON.stringify({
      donnees: donneesCritiques,
      timestamp: new Date().toISOString()
    }));
  }

  // Charger les données critiques en mode hors ligne
  chargerDonneesCritiques() {
    const cache = this.obtenirCache();
    return cache?.donnees || null;
  }

  // Vérifier si on est en mode hors ligne
  estHorsLigne() {
    return !navigator.onLine;
  }

  // Obtenir des statistiques sur le mode hors ligne
  obtenirStatistiques() {
    const fileAttente = this.obtenirFileAttente();
    const cache = this.obtenirCache();
    
    return {
      actionsEnAttente: fileAttente.length,
      elementsEnCache: Object.keys(cache).length,
      estHorsLigne: this.estHorsLigne()
    };
  }
}

export default new OfflineService();