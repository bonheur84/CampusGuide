const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken() {
  return localStorage.getItem('campus_token');
}

// Cache simple pour les requêtes GET
const cacheRequetes = new Map();
const DUREE_CACHE = 5 * 60 * 1000; // 5 minutes

async function requete(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Pour les requêtes GET, vérifier le cache d'abord
  const estRequeteGet = !options.method || options.method === 'GET';
  const cleCache = `${endpoint}_${JSON.stringify(options.body || '')}`;

  if (estRequeteGet && cacheRequetes.has(cleCache)) {
    const { data, timestamp } = cacheRequetes.get(cleCache);
    if (Date.now() - timestamp < DUREE_CACHE) {
      // Retourner les données du cache si on est hors ligne
      if (!navigator.onLine) {
        return data;
      }
    } else {
      cacheRequetes.delete(cleCache);
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (response.status === 403) {
      localStorage.removeItem('campus_token');
      localStorage.removeItem('campus_user_id');
      window.location.href = '/login';
      throw new Error('Session expirée — reconnectez-vous');
    }

    if (!response.ok) {
      throw new Error(data.erreur || `Erreur ${response.status}`);
    }

    // Mettre en cache les requêtes GET réussies
    if (estRequeteGet && data) {
      cacheRequetes.set(cleCache, { data, timestamp: Date.now() });
    }

    return data;
  } catch (error) {
    // Si hors ligne, essayer de retourner les données du cache
    if (!navigator.onLine && estRequeteGet && cacheRequetes.has(cleCache)) {
      const { data } = cacheRequetes.get(cleCache);
      console.log('Mode hors ligne - utilisation du cache:', endpoint);
      return data;
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Serveur inaccessible — vérifiez que le backend est démarré');
    }
    throw error;
  }
}

// Fonction pour vider le cache (utile après modifications)
export function viderCache() {
  cacheRequetes.clear();
}

// Fonction pour précharger des données dans le cache
export function prechargerCache(endpoint, options = {}) {
  const cleCache = `${endpoint}_${JSON.stringify(options.body || '')}`;
  if (!cacheRequetes.has(cleCache)) {
    requete(endpoint, options).then(data => {
      if (data) {
        cacheRequetes.set(cleCache, { data, timestamp: Date.now() });
      }
    }).catch(err => {
      console.error('Erreur préchargement cache:', err);
    });
  }
}

export const apiUtilisateurs = {
  getIdConnecte: () => localStorage.getItem('campus_user_id'),
  estConnecte: () => !!localStorage.getItem('campus_token'),

  inscription: async (email, motDePasse, nom, filiere, annee) => {
    const data = await requete('/utilisateurs/inscription', {
      method: 'POST',
      body: JSON.stringify({ email, motDePasse, nom, filiere, annee }),
    });
    return data;
  },

  connexion: async (email, motDePasse) => {
    const data = await requete('/utilisateurs/connexion', {
      method: 'POST',
      body: JSON.stringify({ email, motDePasse }),
    });
    if (data.token) {
      localStorage.setItem('campus_token', data.token);
      localStorage.setItem('campus_user_id', data.utilisateur.id);
    }
    return data;
  },

  deconnexion: () => {
    localStorage.removeItem('campus_token');
    localStorage.removeItem('campus_user_id');
  },

  getMoi: () => requete('/utilisateurs/moi'),
  getById: (id) => requete(`/utilisateurs/${id}`),

  modifier: (id, donnees) => requete(`/utilisateurs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(donnees),
  }),

  modifierMotDePasse: (id, ancienMotDePasse, nouveauMotDePasse) => requete(`/utilisateurs/${id}/mot-de-passe`, {
    method: 'PUT',
    body: JSON.stringify({ ancienMotDePasse, nouveauMotDePasse }),
  }),

  supprimer: (id) => requete(`/utilisateurs/${id}`, { method: 'DELETE' }),
  adminGetTous: () => requete('/utilisateurs/admin/tous'),
};

export const apiMentors = {
  getAll: (filtres = {}) => {
    const params = new URLSearchParams(filtres).toString();
    return requete(`/mentors${params ? '?' + params : ''}`);
  },
  getMesProfils: () => requete('/mentors/mes-profils'),
  getById: (id) => requete(`/mentors/${id}`),
  creer: (donnees) => requete('/mentors', {
    method: 'POST',
    body: JSON.stringify(donnees),
  }),
  modifier: (id, donnees) => requete(`/mentors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(donnees),
  }),
  supprimer: (id) => requete(`/mentors/${id}`, { method: 'DELETE' }),
  adminUpdateStatus: (id, status) => requete(`/mentors/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  rate: (id, note) => requete(`/mentors/${id}/rate`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  }),
  getRatings: (id) => requete(`/mentors/${id}/ratings`),
  getMyRating: (id) => requete(`/mentors/${id}/my-rating`),
};

export const apiClubs = {
  getAll: (filtres = {}) => {
    const params = new URLSearchParams(filtres).toString();
    return requete(`/clubs${params ? '?' + params : ''}`);
  },
  getById: (id) => requete(`/clubs/${id}`),
  creer: (donnees) => requete('/clubs', {
    method: 'POST',
    body: JSON.stringify(donnees),
  }),
  modifier: (id, donnees) => requete(`/clubs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(donnees),
  }),
  supprimer: (id) => requete(`/clubs/${id}`, { method: 'DELETE' }),
  rejoindre: (id) => requete(`/clubs/${id}/rejoindre`, { method: 'POST' }),
  rate: (id, note) => requete(`/clubs/${id}/rate`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  }),
  getRatings: (id) => requete(`/clubs/${id}/ratings`),
  getMyRating: (id) => requete(`/clubs/${id}/my-rating`),
};

export const apiMessages = {
  getConversation: (expediteurId, destinataireId) =>
    requete(`/messages?expediteurId=${expediteurId}&destinataireId=${destinataireId}`),
  getConversations: (userId) => requete(`/messages/conversations/${userId}`),
  envoyer: (expediteurId, destinataireId, contenu, type = 'texte') => requete('/messages', {
    method: 'POST',
    body: JSON.stringify({ expediteurId, destinataireId, contenu, type }),
  }),
  marquerLu: (id) => requete(`/messages/${id}/lire`, { method: 'PUT' }),
  supprimer: (id) => requete(`/messages/${id}`, { method: 'DELETE' }),
};

export const apiNotifications = {
  getAll: () => requete('/notifications'),
  marquerLu: (id) => requete(`/notifications/${id}/lire`, { method: 'PUT' }),
  marquerToutLu: () => requete('/notifications/lire-tout', { method: 'PUT' }),
  supprimer: (id) => requete(`/notifications/${id}`, { method: 'DELETE' }),
};

export const apiEvenements = {
  getAll: (filtres = {}) => {
    const params = new URLSearchParams(filtres).toString();
    return requete(`/evenements${params ? '?' + params : ''}`);
  },
  getById: (id) => requete(`/evenements/${id}`),
  creer: (donnees) => requete('/evenements', {
    method: 'POST',
    body: JSON.stringify(donnees),
  }),
  modifier: (id, donnees) => requete(`/evenements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(donnees),
  }),
  inscrire: (id) => requete(`/evenements/${id}/inscrire`, { method: 'POST' }),
  supprimer: (id) => requete(`/evenements/${id}`, { method: 'DELETE' }),
};
