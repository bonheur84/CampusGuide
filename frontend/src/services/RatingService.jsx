import { apiMentors, apiClubs } from '../api';

class RatingService {
  constructor() {
    this.cleStockage = 'campus_ratings';
    this.cache = new Map(); // Cache local pour les statistiques
  }

  // Obtenir la moyenne des ratings depuis le backend
  async getAverageRating(itemType, itemId) {
    if (itemType === 'mentor') {
      try {
        const data = await apiMentors.getRatings(itemId);
        return parseFloat(data.moyenne);
      } catch (err) {
        console.error('Erreur récupération moyenne mentors:', err);
        return 0;
      }
    } else if (itemType === 'club') {
      try {
        const data = await apiClubs.getRatings(itemId);
        return parseFloat(data.moyenne);
      } catch (err) {
        console.error('Erreur récupération moyenne clubs:', err);
        return 0;
      }
    } else {
      // Pour les autres types, utiliser localStorage (compatibilité)
      return this.getAverageRatingLocal(itemType, itemId);
    }
  }

  // Obtenir le nombre de ratings depuis le backend
  async getRatingCount(itemType, itemId) {
    if (itemType === 'mentor') {
      try {
        const data = await apiMentors.getRatings(itemId);
        return data.totalVotes;
      } catch (err) {
        console.error('Erreur récupération nombre de votes mentors:', err);
        return 0;
      }
    } else if (itemType === 'club') {
      try {
        const data = await apiClubs.getRatings(itemId);
        return data.totalVotes;
      } catch (err) {
        console.error('Erreur récupération nombre de votes clubs:', err);
        return 0;
      }
    } else {
      return this.getRatingCountLocal(itemType, itemId);
    }
  }

  // Obtenir le rating de l'utilisateur connecté depuis le backend
  async getMyRating(itemType, itemId) {
    if (itemType === 'mentor') {
      try {
        const data = await apiMentors.getMyRating(itemId);
        return data.note || 0;
      } catch (err) {
        console.error('Erreur récupération mon rating mentors:', err);
        return 0;
      }
    } else if (itemType === 'club') {
      try {
        const data = await apiClubs.getMyRating(itemId);
        return data.note || 0;
      } catch (err) {
        console.error('Erreur récupération mon rating clubs:', err);
        return 0;
      }
    } else {
      return this.getRatingUtilisateurLocal(itemType, itemId, this.getCurrentUserId());
    }
  }

  // Ajouter ou mettre à jour un rating via le backend
  async ajouterRating(itemType, itemId, userId, valeur) {
    if (itemType === 'mentor') {
      try {
        const data = await apiMentors.rate(itemId, valeur);
        // Vider le cache pour forcer le rechargement
        this.cache.delete(`${itemType}_${itemId}`);
        return parseFloat(data.moyenne);
      } catch (err) {
        console.error('Erreur ajout rating mentors:', err);
        return 0;
      }
    } else if (itemType === 'club') {
      try {
        const data = await apiClubs.rate(itemId, valeur);
        // Vider le cache pour forcer le rechargement
        this.cache.delete(`${itemType}_${itemId}`);
        return parseFloat(data.moyenne);
      } catch (err) {
        console.error('Erreur ajout rating clubs:', err);
        return 0;
      }
    } else {
      return this.ajouterRatingLocal(itemType, itemId, userId, valeur);
    }
  }

  // Vérifier si un utilisateur a déjà voté
  async aDejaVote(itemType, itemId, userId) {
    if (itemType === 'mentor' || itemType === 'club') {
      const myRating = await this.getMyRating(itemType, itemId);
      return myRating > 0;
    } else {
      return this.aDejaVoteLocal(itemType, itemId, userId);
    }
  }

  // Obtenir le rating d'un utilisateur spécifique
  async getRatingUtilisateur(itemType, itemId, userId) {
    if (itemType === 'mentor' || itemType === 'club') {
      // Pour mentors et clubs, on ne peut voir que son propre rating
      if (userId === this.getCurrentUserId()) {
        return await this.getMyRating(itemType, itemId);
      }
      return 0;
    } else {
      return this.getRatingUtilisateurLocal(itemType, itemId, userId);
    }
  }

  // Supprimer un rating (non implémenté pour mentors et clubs)
  supprimerRating(itemType, itemId, userId) {
    if (itemType === 'mentor' || itemType === 'club') {
      // Pour mentors et clubs, on ne permet pas de supprimer, seulement de modifier
      console.warn('Suppression de rating non supportée pour mentors et clubs');
    } else {
      return this.supprimerRatingLocal(itemType, itemId, userId);
    }
  }

  // Obtenir les statistiques d'un item (pour admin)
  async getStatistiques(itemType, itemId) {
    if (itemType === 'mentor') {
      try {
        const data = await apiMentors.getRatings(itemId);
        return {
          moyenne: parseFloat(data.moyenne),
          nombreVotes: data.totalVotes,
          distribution: null, // Distribution non disponible pour l'instant
          ratings: [] // Détails individuels non disponibles pour l'instant
        };
      } catch (err) {
        console.error('Erreur récupération statistiques mentors:', err);
        return {
          moyenne: 0,
          nombreVotes: 0,
          distribution: null,
          ratings: []
        };
      }
    } else if (itemType === 'club') {
      try {
        const data = await apiClubs.getRatings(itemId);
        return {
          moyenne: parseFloat(data.moyenne),
          nombreVotes: data.totalVotes,
          distribution: null, // Distribution non disponible pour l'instant
          ratings: [] // Détails individuels non disponibles pour l'instant
        };
      } catch (err) {
        console.error('Erreur récupération statistiques clubs:', err);
        return {
          moyenne: 0,
          nombreVotes: 0,
          distribution: null,
          ratings: []
        };
      }
    } else {
      return this.getStatistiquesLocal(itemType, itemId);
    }
  }

  // Réinitialiser tous les ratings d'un item (pour admin)
  reinitialiserRatings(itemType, itemId) {
    if (itemType === 'mentor' || itemType === 'club') {
      console.warn('Réinitialisation de ratings non supportée pour mentors et clubs');
    } else {
      return this.reinitialiserRatingsLocal(itemType, itemId);
    }
  }

  // ===== Méthodes locales (compatibilité pour non-mentors) =====

  getAverageRatingLocal(itemType, itemId) {
    const ratings = this.getRatingsLocal(itemType, itemId);
    if (ratings.length === 0) return 0;
    const somme = ratings.reduce((acc, r) => acc + r.valeur, 0);
    return Math.round((somme / ratings.length) * 10) / 10;
  }

  getRatingCountLocal(itemType, itemId) {
    return this.getRatingsLocal(itemType, itemId).length;
  }

  ajouterRatingLocal(itemType, itemId, userId, valeur) {
    const tousRatings = this.obtenirTousRatingsLocal();
    const cle = `${itemType}_${itemId}`;
    
    if (!tousRatings[cle]) {
      tousRatings[cle] = [];
    }

    const indexExistant = tousRatings[cle].findIndex(r => r.userId === userId);
    
    if (indexExistant >= 0) {
      tousRatings[cle][indexExistant].valeur = valeur;
      tousRatings[cle][indexExistant].date = new Date().toISOString();
    } else {
      tousRatings[cle].push({
        userId,
        valeur,
        date: new Date().toISOString()
      });
    }

    this.sauvegarderTousRatingsLocal(tousRatings);
    return this.getAverageRatingLocal(itemType, itemId);
  }

  aDejaVoteLocal(itemType, itemId, userId) {
    const ratings = this.getRatingsLocal(itemType, itemId);
    return ratings.some(r => r.userId === userId);
  }

  getRatingUtilisateurLocal(itemType, itemId, userId) {
    const ratings = this.getRatingsLocal(itemType, itemId);
    const rating = ratings.find(r => r.userId === userId);
    return rating ? rating.valeur : 0;
  }

  supprimerRatingLocal(itemType, itemId, userId) {
    const tousRatings = this.obtenirTousRatingsLocal();
    const cle = `${itemType}_${itemId}`;
    
    if (tousRatings[cle]) {
      tousRatings[cle] = tousRatings[cle].filter(r => r.userId !== userId);
      this.sauvegarderTousRatingsLocal(tousRatings);
    }
  }

  getRatingsLocal(itemType, itemId) {
    const tousRatings = this.obtenirTousRatingsLocal();
    const cle = `${itemType}_${itemId}`;
    return tousRatings[cle] || [];
  }

  obtenirTousRatingsLocal() {
    const data = localStorage.getItem(this.cleStockage);
    return data ? JSON.parse(data) : {};
  }

  sauvegarderTousRatingsLocal(ratings) {
    localStorage.setItem(this.cleStockage, JSON.stringify(ratings));
  }

  getStatistiquesLocal(itemType, itemId) {
    const ratings = this.getRatingsLocal(itemType, itemId);
    const moyenne = this.getAverageRatingLocal(itemType, itemId);
    const nombreVotes = ratings.length;
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(r => {
      if (distribution[r.valeur] !== undefined) {
        distribution[r.valeur]++;
      }
    });

    return {
      moyenne,
      nombreVotes,
      distribution,
      ratings: ratings.map(r => ({
        userId: r.userId,
        valeur: r.valeur,
        date: r.date
      }))
    };
  }

  reinitialiserRatingsLocal(itemType, itemId) {
    const tousRatings = this.obtenirTousRatingsLocal();
    const cle = `${itemType}_${itemId}`;
    delete tousRatings[cle];
    this.sauvegarderTousRatingsLocal(tousRatings);
  }

  // Helper: obtenir l'ID de l'utilisateur connecté
  getCurrentUserId() {
    return localStorage.getItem('campus_user_id');
  }
}

export default new RatingService();