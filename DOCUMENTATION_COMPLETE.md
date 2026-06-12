vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv# 📚 DOCUMENTATION COMPLÈTE - CampusGuide
## Explication Détaillée de Chaque Ligne de Code

**Version:** 2.0.0  
**Stack:** Node.js + Express + React + MySQL + JWT  
**Description:** Application complète de gestion et de mentoring universitaire

---

## 📑 TABLE DES MATIÈRES

1. [Structure du Projet](#structure-du-projet)
2. [Racine du Projet (Root)](#racine-du-projet-root)
3. [Backend - Configuration](#backend---configuration)
4. [Backend - Middleware d'Authentification](#backend---middleware-dauthentification)
5. [Backend - Routes](#backend---routes)
6. [Frontend - Point d'Entrée](#frontend---point-dentrée)
7. [Frontend - Application Principale](#frontend---application-principale)
8. [Frontend - Contexte Utilisateur](#frontend---contexte-utilisateur)
9. [Frontend - API Client](#frontend---api-client)
10. [Frontend - Composants](#frontend---composants)

---

## STRUCTURE DU PROJET

```
CampusGuide/
├── package.json              ← Configuration racine
├── .env.example              ← Variables d'environnement (exemple)
├── .gitignore               ← Fichiers à ignorer par Git
├── backend/                 ← API Express (Port 3001)
│   ├── package.json
│   ├── src/
│   │   ├── server.js        ← Point d'entrée du serveur
│   │   ├── config/
│   │   │   └── database.js  ← Connexion MySQL
│   │   ├── middleware/
│   │   │   └── auth.js      ← Gestion des tokens JWT
│   │   ├── routes/
│   │   │   ├── utilisateurs.js
│   │   │   ├── mentors.js
│   │   │   ├── clubs.js
│   │   │   ├── notifications.js
│   │   │   └── evenements.js
│   │   └── ...
│   └── scripts/
├── frontend/                ← Application React (Port 5173)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx         ← Point d'entrée React
│       ├── App.jsx          ← Composant racine avec routing
│       ├── index.css        ← Styles CSS
│       ├── api/
│       │   └── index.js     ← Fonctions API client
│       ├── contexte/
│       │   └── ContexteUtilisateur.jsx ← Global state (utilisateur)
│       ├── components/
│       │   ├── Navigation.jsx
│       │   └── AlertePersonnalisee.jsx
│       └── pages/
│           ├── Login.jsx
│           ├── Accueil.jsx
│           ├── Mentors.jsx
│           ├── Clubs.jsx
│           ├── Calendrier.jsx
│           └── ...
└── node_modules/            ← Dépendances (à ignorer)
```

---

## RACINE DU PROJET (ROOT)

### 📄 `package.json` - Configuration globale du projet

```json
{
  "name": "campusguide-fullstack",
  // Le nom du projet, identifier unique
  
  "version": "1.0.0",
  // Version sémantique: MAJEUR.MINEUR.PATCH
  // 1 = grande version, 0 = nouvelle fonctionnalité, 0 = correction
  
  "description": "Projet CampusGuide - Frontend React et Backend Node.js/MySQL",
  // Description du projet pour npm
  
  "scripts": {
    // Commandes personnalisées pour lancer le projet
    
    "install-all": "npm install && cd backend && npm install && cd ../frontend && npm install",
    // Installe TOUTES les dépendances (racine + backend + frontend)
    // Cette commande s'exécute une seule fois au premier clone du projet
    
    "backend": "cd backend && npm run dev",
    // Lance le serveur backend (dossier backend)
    
    "frontend": "cd frontend && npm run dev",
    // Lance l'application React frontend (dossier frontend)
    
    "start": "npx concurrently \"npm run backend\" \"npm run frontend\""
    // Lance SIMULTANÉMENT le backend et le frontend
    // npx concurrently = package pour lancer plusieurs processus en parallèle
  },
  
  "devDependencies": {
    // Dépendances uniquement pour le développement (pas nécessaires en production)
    
    "concurrently": "^8.2.2"
    // Package permettant de lancer plusieurs commandes en même temps
    // Utile pour développer le frontend et backend simultanément
  }
}
```

**Comment utiliser:**
```bash
npm install-all        # Installation initiale
npm start              # Lance backend + frontend en même temps
npm run backend        # Lance uniquement le serveur
npm run frontend       # Lance uniquement le client React
```

---

## BACKEND - CONFIGURATION

### 📄 `backend/src/server.js` - Point d'entrée du serveur Express

```javascript
// ============ CHARGEMENT DES VARIABLES D'ENVIRONNEMENT ============
require('dotenv').config();
// Charge le fichier .env dans process.env
// Permet d'utiliser: process.env.PORT, process.env.DB_HOST, etc.
// Les données sensibles (mots de passe) ne sont pas dans le code

// ============ IMPORTATION DES DÉPENDANCES ============
const express = require('express');
// Framework Node.js pour créer une API HTTP/REST

const cors = require('cors');
// Middleware qui permet les requêtes depuis le frontend (port 5173)
// SANS CORS: le navigateur bloquerait les requêtes cross-domain

// ============ INITIALISATION DE L'APPLICATION EXPRESS ============
const app = express();
// Crée une nouvelle application Express

const PORT = process.env.PORT || 3001;
// Utilise le port défini dans .env, sinon port 3001 par défaut
// process.env.PORT = variable d'environnement
// || 3001 = valeur par défaut si non définie

// ============ CONFIGURATION DE CORS ============
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  // FRONTEND_URL = l'adresse du frontend qui peut faire des requêtes
  // Sans ce contrôle, n'importe quel site pourrait accéder à l'API

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // Les méthodes HTTP autorisées:
  //   - GET: récupérer des données
  //   - POST: créer des données
  //   - PUT: modifier des données
  //   - DELETE: supprimer des données
  //   - OPTIONS: requêtes préalables du navigateur

  allowedHeaders: ['Content-Type', 'Authorization'],
  // En-têtes HTTP autorisés:
  //   - Content-Type: type de données (JSON, XML, etc.)
  //   - Authorization: pour envoyer les tokens JWT
}));

// ============ MIDDLEWARES DE PARSING ============
app.use(express.json({ limit: '20mb' }));
// Parse les requêtes JSON automatiquement
// { limit: '20mb' } = taille maximale du fichier (images, etc.)

app.use(express.urlencoded({ extended: true, limit: '20mb' }));
// Parse les formulaires HTML (enctype="application/x-www-form-urlencoded")
// extended: true = permet les données imbriquées

// ============ INITIALISATION DE LA BASE DE DONNÉES ============
require('./config/database');
// Charge la connexion MySQL
// Si la connexion échoue, cela s'affiche dans la console

// ============ IMPORTATION DES ROUTES ============
// Chaque route gère une ressource spécifique de l'API

const mentorsRouter       = require('./routes/mentors');
// Route pour les mentors

const clubsRouter         = require('./routes/clubs');
// Route pour les clubs

const utilisateursRouter  = require('./routes/utilisateurs');
// Route pour les authentifications et profils utilisateur

const notificationsRouter = require('./routes/notifications');
// Route pour les notifications

const evenementsRouter    = require('./routes/evenements');
// Route pour les événements du campus

// ============ ENREGISTREMENT DES ROUTES ============
app.use('/api/mentors',       mentorsRouter);
// Tous les chemins /api/mentors/... utilisent mentorsRouter

app.use('/api/clubs',         clubsRouter);
// Tous les chemins /api/clubs/... utilisent clubsRouter

app.use('/api/utilisateurs',  utilisateursRouter);
// Tous les chemins /api/utilisateurs/... utilisent utilisateursRouter

app.use('/api/notifications', notificationsRouter);
// Tous les chemins /api/notifications/... utilisent notificationsRouter

app.use('/api/evenements',    evenementsRouter);
// Tous les chemins /api/evenements/... utilisent evenementsRouter

// ============ ROUTE RACINE DE L'API (INFO) ============
app.get('/', (req, res) => {
  // GET http://localhost:3001/
  // Envoie les infos du serveur (version, technologies utilisées)

  res.json({
    // res.json() = envoie une réponse JSON au client

    message: 'CampusGuide API — Serveur operationnel',
    // Message de confirmation que le serveur fonctionne

    version: '2.0.0',
    // Numéro de version de l'API

    stack: 'Node.js + Express + MySQL + JWT',
    // Technologies utilisées
  });
});

// ============ ROUTE POUR LES CHEMINS NON TROUVÉS (404) ============
app.use((req, res) => {
  // Ce middleware s'exécute si AUCUN autre middleware n'a répondu
  // C'est le dernier middleware avant les erreurs

  res.status(404).json({ erreur: 'Route non trouvée' });
  // res.status(404) = code HTTP "Not Found"
  // Retourne un message JSON indiquant que la route n'existe pas
});

// ============ MIDDLEWARE DE GESTION DES ERREURS ============
app.use((err, req, res, next) => {
  // Ce middleware a 4 paramètres = middleware d'erreur
  // S'exécute quand un erreur est lancée dans les autres middlewares

  console.error('Erreur serveur:', err.message);
  // Affiche l'erreur dans la console du serveur (logs)

  res.status(500).json({ erreur: 'Erreur interne du serveur' });
  // res.status(500) = code HTTP "Internal Server Error"
  // Retourne un message d'erreur générique au client (pour la sécurité)
});

// ============ DÉMARRAGE DU SERVEUR ============
app.listen(PORT, () => {
  // Écoute les connexions sur le port défini
  // Quand une connexion arrive, le callback s'exécute

  console.log(`CampusGuide API demarree sur http://localhost:${PORT}`);
  // Affiche l'URL où accéder à l'API

  console.log(`Base de donnees: ${process.env.DB_NAME || 'campusguide'}`);
  // Affiche le nom de la base de données utilisée
});
```

---

### 📄 `backend/src/config/database.js` - Connexion à MySQL

```javascript
// ============ IMPORTATION DE MYSQL2/PROMISE ============
const mysql = require('mysql2/promise');
// mysql2/promise = version asynchrone de mysql2
// /promise = utilise les Promises au lieu des callbacks

// ============ CHARGEMENT DES VARIABLES D'ENVIRONNEMENT ============
require('dotenv').config();
// Charge le fichier .env (DB_HOST, DB_USER, DB_PASSWORD, etc.)

// ============ CRÉATION DE LA POOL DE CONNEXIONS ============
const pool = mysql.createPool({
  // createPool() = crée un groupe de connexions prêtes à l'emploi
  // Au lieu de créer une connexion par requête (lent)
  // On réutilise les connexions existantes (rapide)

  host:     process.env.DB_HOST     || 'localhost',
  // Adresse du serveur MySQL (localhost = ordinateur local)

  port:     parseInt(process.env.DB_PORT) || 3306,
  // Port MySQL (par défaut 3306)
  // parseInt() = convertit la chaîne en nombre

  user:     process.env.DB_USER     || 'root',
  // Utilisateur MySQL (par défaut 'root')

  password: process.env.DB_PASSWORD || '',
  // Mot de passe MySQL (vide par défaut)

  database: process.env.DB_NAME     || 'campusguide',
  // Nom de la base de données à utiliser

  waitForConnections: true,
  // Attend une connexion disponible (file d'attente)

  connectionLimit:    10,
  // Maximum 10 connexions simultanées
  // Si plus de 10 requêtes = on attend qu'une se libère

  queueLimit:         0,
  // 0 = file d'attente infinie
  // Si on atteint connectionLimit, les requêtes attendent

  charset:            'utf8mb4',
  // Encodage des caractères (supporte les emojis)
});

// ============ TEST DE CONNEXION À MYSQL ============
pool.getConnection()
  // Récupère une connexion du pool pour tester

  .then(conn => {
    // .then() = s'exécute si la connexion réussit

    console.log(' MySQL connecté avec succès');
    // Affiche le message de succès

    conn.release();
    // Libère la connexion (la remet dans le pool)
  })

  .catch(err => {
    // .catch() = s'exécute si la connexion échoue

    console.error(' Erreur MySQL:', err.message);
    // Affiche le message d'erreur

    console.warn('  Le serveur continue mais les données ne seront pas persistées.');
    // Avertissement: le serveur démarre MÊME SANS MySQL
    // (données perdues au redémarrage)

    console.warn('   → Vérifiez vos variables dans .env et que MySQL est démarré.');
    // Instructions pour corriger le problème
  });

// ============ EXPORT DE LA POOL ============
module.exports = pool;
// Exporte la pool pour l'utiliser dans les routes
// Autres fichiers: const pool = require('./config/database');
```

---

## BACKEND - MIDDLEWARE D'AUTHENTIFICATION

### 📄 `backend/src/middleware/auth.js` - Gestion des tokens JWT

```javascript
// ============ IMPORTATION DE JSONWEBTOKEN ============
const jwt = require('jsonwebtoken');
// jwt = créer, signer et vérifier des tokens (secure tokens)

// ============ CHARGEMENT DES VARIABLES D'ENVIRONNEMENT ============
require('dotenv').config();

// ============ CLÉ SECRÈTE POUR SIGNER LES TOKENS ============
const SECRET = process.env.JWT_SECRET || 'campusguide_secret';
// Clé secrète pour encoder/décoder les tokens JWT
// Si JWT_SECRET n'existe pas = utilise la clé par défaut (DANGER en production!)
// Cette clé doit ABSOLUMENT être dans .env et secrète

// ============ MIDDLEWARE D'AUTHENTIFICATION OBLIGATOIRE ============
const authentifier = (req, res, next) => {
  // Middleware qui vérifie que l'utilisateur a un token valide
  // Utilisation: app.use(authentifier) ou app.get('/route', authentifier, handler)

  const authHeader = req.headers['authorization'];
  // Récupère l'en-tête Authorization: "Bearer TOKEN_ICI"
  // format: "Bearer eyJhbGc..."

  const token = authHeader && authHeader.split(' ')[1];
  // authHeader && = vérifie que authHeader existe
  // .split(' ')[1] = prend la deuxième partie après l'espace
  // Résultat: "eyJhbGc..." (le token sans "Bearer ")

  if (!token) {
    // Si aucun token fourni
    return res.status(401).json({
      // status(401) = "Unauthorized" (non authentifié)
      success: false,
      erreur: 'Token manquant — authentification requise'
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    // jwt.verify() = vérifie que le token est valide et signé avec SECRET
    // Si valide = retourne les données du token décrypté
    // Si invalide = lance une erreur

    req.utilisateur = decoded;
    // Stocke l'utilisateur dans la requête
    // Le decoded contient: { id, email, role, iat, exp }
    // Les autres middlewares peuvent accéder via req.utilisateur

    next();
    // Laisse la requête continuer vers le prochain middleware/handler
  } catch (err) {
    // Si jwt.verify() lance une erreur (token invalide, expiré, etc.)
    return res.status(403).json({
      // status(403) = "Forbidden" (authentifié mais accès refusé)
      success: false,
      erreur: 'Token invalide ou expiré'
    });
  }
};

// ============ MIDDLEWARE D'AUTHENTIFICATION OPTIONNELLE ============
const authentifierOptionnel = (req, res, next) => {
  // Middleware pour les routes où l'authentification est OPTIONNELLE
  // Exemple: GET /mentors (public) mais avec info spéciale si connecté

  const authHeader = req.headers['authorization'];
  // Récupère l'en-tête Authorization s'il existe

  const token = authHeader && authHeader.split(' ')[1];
  // Extrait le token

  if (token) {
    // Si un token est fourni
    try {
      req.utilisateur = jwt.verify(token, SECRET);
      // Vérifie et décode le token
      // Si valide = stocke dans req.utilisateur
    } catch {
      // Si le token est invalide
      // On ignore l'erreur (catch vide)
      // req.utilisateur reste undefined
    }
  }
  // Dans tous les cas, on continue (next() est appelé ci-dessous)

  next();
  // La requête continue même si pas authentifié
};

// ============ FONCTION POUR GÉNÉRER UN TOKEN ============
const genererToken = (utilisateur) => {
  // Crée un nouveau token JWT pour l'utilisateur
  // Utilisée lors de la connexion/inscription

  return jwt.sign(
    // jwt.sign() = crée un token signé

    {
      // Données à encoder dans le token (payload)
      // Ces données seront dans le token (lisibles mais pas modifiables)

      id: utilisateur.id,
      // ID unique de l'utilisateur

      email: utilisateur.email,
      // Email de l'utilisateur

      role: utilisateur.role
      // Rôle de l'utilisateur (admin, etudiant, mentor, etc.)
    },

    SECRET,
    // Clé secrète pour signer le token
    // Seul le serveur connaît cette clé

    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      // Durée de validité du token
      // '7d' = 7 jours
      // Après 7 jours: l'utilisateur doit se reconnecter
    }
  );
};

// ============ EXPORT DES MIDDLEWARES ET FONCTIONS ============
module.exports = {
  authentifier,
  // Middleware obligatoire (bloque si pas authentifié)

  authentifierOptionnel,
  // Middleware optionnel (continue même sans authentification)

  genererToken
  // Fonction pour créer des tokens (lors de la connexion)
};
```

---

## BACKEND - ROUTES

### 📄 `backend/src/routes/utilisateurs.js` - Authentification et Profil

```javascript
// ============ IMPORTATIONS ============
const express = require('express');
// Framework pour créer les routes

const router = express.Router();
// Crée un nouveau routeur (sous-ensemble de routes)

const bcrypt = require('bcryptjs');
// Hashe les mots de passe (sécurité)

const pool = require('../config/database');
// Pool de connexions MySQL

const { authentifier, genererToken } = require('../middleware/auth');
// Middlewares et fonction d'authentification

const { v4: uuidv4 } = require('uuid');
// Génère des ID uniques au format UUID

// ============ ROUTE POST: /api/utilisateurs/connexion ============
router.post('/connexion', async (req, res) => {
  // POST = créer quelque chose (dans ce cas: une session/token)
  // async = cette fonction est asynchrone (attends les requêtes SQL)

  const { email, motDePasse } = req.body;
  // Récupère l'email et le mot de passe du corps de la requête
  // Envoyé par le frontend au format JSON

  if (!email || !motDePasse) {
    // Vérifie que les deux champs sont fournis
    return res.status(400).json({
      // status(400) = "Bad Request" (données manquantes/invalides)
      success: false,
      erreur: 'Email et mot de passe requis'
    });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
    // Requête SQL: SELECT * FROM utilisateurs WHERE email = ?
    // ? = placeholder (prévient les injections SQL)
    // [email] = valeur à insérer à la place du ?
    // await = attend la réponse de la base de données
    // [rows] = destructuration (rows est le premier élément du résultat)

    if (rows.length === 0) {
      // Si aucun utilisateur avec cet email
      return res.status(401).json({
        // status(401) = "Unauthorized" (identifiants incorrects)
        success: false,
        erreur: 'Email ou mot de passe incorrect'
      });
    }

    const utilisateur = rows[0];
    // Récupère le premier (unique) utilisateur trouvé

    let mdpValide;
    // Variable pour stocker le résultat de la vérification du mot de passe

    if (utilisateur.mot_de_passe.startsWith('$2') && utilisateur.mot_de_passe.length > 50) {
      // Vérifie si le mot de passe est hashé (commence par '$2', longueur > 50)
      // Format bcrypt: $2a$10$...

      mdpValide = await bcrypt.compare(motDePasse, utilisateur.mot_de_passe);
      // bcrypt.compare() = compare le mot de passe en clair avec le hash
      // Retourne true ou false
    } else {
      // Si le mot de passe n'est pas hashé (ancien format)
      mdpValide = motDePasse === utilisateur.mot_de_passe;
      // Comparaison directe (DANGER: pas sécurisé!)
      // À faire: re-hasher tous les anciens mots de passe
    }

    if (!mdpValide) {
      // Si le mot de passe est incorrect
      return res.status(401).json({
        success: false,
        erreur: 'Email ou mot de passe incorrect'
      });
    }

    const token = genererToken(utilisateur);
    // Crée un nouveau token JWT pour l'utilisateur

    const { mot_de_passe, ...utilisateurSansMdp } = utilisateur;
    // Destructuration: supprime mot_de_passe de l'objet
    // ...utilisateurSansMdp = le reste des propriétés

    res.json({
      // Envoie la réponse au client
      success: true,
      message: 'Connexion réussie',
      utilisateur: utilisateurSansMdp,
      // Les données de l'utilisateur (SANS le mot de passe)
      token
      // Le token JWT pour les futures requêtes
    });
  } catch (err) {
    // Si une erreur SQL ou autre survient
    console.error('Connexion:', err.message);
    // Affiche l'erreur dans les logs du serveur

    res.status(500).json({
      // status(500) = "Internal Server Error"
      success: false,
      erreur: 'Erreur serveur lors de la connexion'
    });
  }
});

// ============ ROUTE GET: /api/utilisateurs/moi ============
router.get('/moi', authentifier, async (req, res) => {
  // GET = récupérer des données
  // authentifier = middleware (vérifie le token)
  // /moi = retourne l'utilisateur CONNECTÉ

  try {
    const [rows] = await pool.query(
      'SELECT id, nom, email, avatar, filiere, annee as promotion, role, created_at FROM utilisateurs WHERE id = ?',
      [req.utilisateur.id]
      // req.utilisateur.id vient du middleware authentifier
      // Il contient l'ID extrait du token JWT
    );

    if (rows.length === 0) {
      // L'utilisateur n'existe pas (très rare, token valide mais user supprimé)
      return res.status(404).json({
        // status(404) = "Not Found"
        success: false,
        erreur: 'Utilisateur introuvable'
      });
    }

    res.json({
      // Envoie les données de l'utilisateur
      success: true,
      utilisateur: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      erreur: 'Erreur serveur'
    });
  }
});

// ============ ROUTE GET: /api/utilisateurs/:id ============
router.get('/:id', async (req, res) => {
  // GET = récupérer
  // :id = paramètre d'URL (exemple: /utilisateurs/123)
  // req.params.id = la valeur du paramètre (123)
  // PAS d'authentification = route publique

  try {
    const [rows] = await pool.query(
      'SELECT id, nom, email, avatar, filiere, annee, role, created_at FROM utilisateurs WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        erreur: 'Utilisateur introuvable'
      });
    }

    res.json({
      success: true,
      utilisateur: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      erreur: 'Erreur serveur'
    });
  }
});

// ============ ROUTE PUT: /api/utilisateurs/:id ============
router.put('/:id', authentifier, async (req, res) => {
  // PUT = modifier une ressource existante
  // authentifier = seul l'utilisateur connecté peut modifier SON profil

  if (req.utilisateur.id !== req.params.id && req.utilisateur.role !== 'admin') {
    // Vérifie que:
    // - L'utilisateur modifie SON PROPRE profil OU
    // - L'utilisateur est admin
    // Sinon: accès refusé

    return res.status(403).json({
      // status(403) = "Forbidden"
      success: false,
      erreur: 'Accès refusé'
    });
  }

  const { nom, filiere, promotion, avatar } = req.body;
  // Récupère les champs à modifier du corps de la requête

  try {
    await pool.query(
      `UPDATE utilisateurs SET 
        nom = COALESCE(?, nom), 
        filiere = COALESCE(?, filiere), 
        annee = COALESCE(?, annee), 
        avatar = COALESCE(?, avatar) 
       WHERE id = ?`,
      // COALESCE(?, valeur_actuelle) = si ? est NULL, garde l'ancienne valeur
      // Permet de modifier partiellement les données

      [nom, filiere, promotion, avatar, req.params.id]
    );

    const [rows] = await pool.query(
      'SELECT id, nom, email, avatar, filiere, annee as promotion, role FROM utilisateurs WHERE id = ?',
      [req.params.id]
    );
    // Récupère l'utilisateur MODIFIÉ pour l'envoyer au client

    res.json({
      success: true,
      utilisateur: rows[0]
      // Envoie les nouvelles données
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      erreur: 'Erreur serveur'
    });
  }
});

// ============ ROUTE PUT: /api/utilisateurs/:id/mot-de-passe ============
router.put('/:id/mot-de-passe', authentifier, async (req, res) => {
  // PUT = modifier le mot de passe
  // authentifier = seulement l'utilisateur peut changer SON mot de passe

  const { ancienMotDePasse, nouveauMotDePasse } = req.body;
  // Récupère les anciens et nouveaux mots de passe

  if (req.utilisateur.id !== req.params.id) {
    // Vérifie que l'utilisateur change SON mot de passe
    // Pas besoin de vérifier le rôle admin (admin ne peut pas changer d'autres MDP)

    return res.status(403).json({
      success: false,
      erreur: 'Accès refusé'
    });
  }

  try {
    const [rows] = await pool.query(
      'SELECT mot_de_passe FROM utilisateurs WHERE id = ?',
      [req.params.id]
    );
    // Récupère le mot de passe ACTUEL (hashé) de la base de données

    const utilisateur = rows[0];

    const mdpValide = await bcrypt.compare(ancienMotDePasse, utilisateur.mot_de_passe);
    // Vérifie que l'ancien mot de passe fourni correspond au hash en BD

    if (!mdpValide) {
      // L'ancien mot de passe est incorrect
      return res.status(401).json({
        success: false,
        erreur: 'Ancien mot de passe incorrect'
      });
    }

    // [SUITE DANS LA PROCHAINE PARTIE...]
    // Le reste du code: hasher le nouveau MDP et l'enregistrer en BD
  } catch (err) {
    res.status(500).json({
      success: false,
      erreur: 'Erreur serveur'
    });
  }
});

// ============ EXPORT DU ROUTEUR ============
module.exports = router;
// Exporte le routeur pour l'utiliser dans server.js
```

---

### 📄 `backend/src/routes/mentors.js` - Gestion des Mentors

```javascript
// ============ COMMENTAIRE EXPLICATIF ============
// =============================================
//  Route API : /api/mentors — MySQL
// =============================================

// ============ IMPORTATIONS ============
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authentifier } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// ============ ROUTE GET: /api/mentors/mes-profils ============
router.get('/mes-profils', authentifier, async (req, res) => {
  // GET = récupérer
  // authentifier = route protégée (utilisateur connecté seulement)
  // /mes-profils = retourne les profils de MENTOR de l'utilisateur connecté

  try {
    const [rows] = await pool.query(
      'SELECT * FROM mentors WHERE utilisateur_id = ? ORDER BY created_at DESC',
      [req.utilisateur.id]
      // WHERE utilisateur_id = ? = filtre par l'ID de l'utilisateur connecté
      // ORDER BY created_at DESC = les plus récents en premier
    );

    res.json({
      success: true,
      mentors: rows.map(normaliserMentor)
      // rows.map(normaliserMentor) = transforme chaque mentor avec la fonction normaliserMentor
      // (fonction définie ailleurs dans le fichier)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      erreur: 'Erreur serveur'
    });
  }
});

// ============ ROUTE GET: /api/mentors ============
router.get('/', async (req, res) => {
  // GET = récupérer
  // PAS d'authentifier = route publique (tout le monde peut voir les mentors)

  try {
    let sql = "SELECT * FROM mentors WHERE status = 'approuve'";
    // Requête SQL de base: récupère tous les mentors APPROUVÉS
    // Les mentors en attente d'approbation ne sont pas affichés

    const params = [];
    // Tableau des paramètres pour les placeholders (?)

    if (req.query.tous === 'true') {
      // req.query.tous = paramètre d'URL: ?tous=true
      // Si les params contiennent tous=true = admin qui regarde TOUS les mentors

      sql = 'SELECT * FROM mentors WHERE 1=1';
      // WHERE 1=1 = condition toujours vraie (permet d'ajouter d'autres AND)
    }

    // ============ FILTRES OPTIONNELS ============

    if (req.query.filiere && req.query.filiere !== 'tous') {
      // ?filiere=Informatique = filtre par filière
      sql += ' AND filiere = ?';
      params.push(req.query.filiere);
    }

    if (req.query.disponible !== undefined) {
      // ?disponible=true = filtre les mentors disponibles
      // !== undefined = vérifie que le paramètre existe (même s'il est false)

      sql += ' AND disponible = ?';
      params.push(req.query.disponible === 'true' ? 1 : 0);
      // ? = true en JavaScript → 1 en MySQL (booléen)
    }

    if (req.query.recherche) {
      // ?recherche=Jean = recherche par nom ou spécialité
      sql += ' AND (nom LIKE ? OR specialite LIKE ?)';
      const terme = `%${req.query.recherche}%`;
      // % = wildcard SQL (recherche parmi le texte)
      // Exemple: %Jean% trouve "Jean", "De Jean", "Jean-Marie", etc.

      params.push(terme, terme);
      // Ajoute le terme deux fois (pour nom ET specialite)
    }

    sql += ' ORDER BY created_at DESC';
    // Les mentors les plus récents apparaissent en premier

    const [rows] = await pool.query(sql, params);
    // Exécute la requête avec les filtres appliqués

    // ============ NORMALISATION DES MENTORS ============
    const mentors = rows.map(row => {
      // .map() = transforme chaque ligne en objet mentor
      // normaliserMentor() fait la même chose en version réutilisable

      const mentor = {
        id: row.id,
        nom: row.nom,
        filiere: row.filiere,
        annee: row.annee,
        specialite: row.specialite,
        bio: row.bio,
        photo: row.photo,
        // [SUITE: téléphone, disponible, status, etc.]
      };
      return mentor;
    });

    res.json({
      success: true,
      total: mentors.length,
      // total = nombre de mentors retournés
      mentors
    });
  } catch (err) {
    console.error('GET /mentors:', err.message);
    res.status(500).json({
      success: false,
      erreur: 'Erreur serveur'
    });
  }
});

// [ROUTE GET/:id, POST, PUT, DELETE... — structures similaires]
```

---

### 📄 `backend/src/routes/clubs.js` - Gestion des Clubs

```javascript
// ============ IMPORTATIONS ============
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// ============ ROUTE GET: /api/clubs ============
router.get('/', async (req, res) => {
  try {
    let sql = 'SELECT * FROM clubs WHERE 1=1';
    // WHERE 1=1 = condition neutre (toujours vraie)

    const params = [];

    if (req.query.categorie && req.query.categorie !== 'tous') {
      // ?categorie=Sport = filtre par catégorie
      sql += ' AND categorie = ?';
      params.push(req.query.categorie);
    }

    if (req.query.recherche) {
      // ?recherche=Tennis = recherche par nom ou description
      sql += ' AND (nom LIKE ? OR description LIKE ?)';
      const t = `%${req.query.recherche}%`;
      params.push(t, t);
    }

    sql += ' ORDER BY membres DESC';
    // Trie par nombre de membres décroissant (clubs populaires en premier)

    const [rows] = await pool.query(sql, params);

    const clubs = rows.map(normaliserClub);
    // Transforme chaque club avec la fonction normaliserClub

    res.json({
      success: true,
      total: clubs.length,
      clubs
    });
  } catch (err) {
    console.error('GET /clubs:', err.message);
    res.status(500).json({
      success: false,
      erreur: 'Erreur serveur'
    });
  }
});

// ============ ROUTE GET: /api/clubs/:id ============
router.get('/:id', async (req, res) => {
  // :id = paramètre d'URL
  // Exemple: /api/clubs/42 → req.params.id = "42"

  try {
    const [rows] = await pool.query(
      'SELECT * FROM clubs WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      // Club non trouvé
      return res.status(404).json({
        success: false,
        erreur: 'Club introuvable'
      });
    }

    res.json({
      success: true,
      club: normaliserClub(rows[0])
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      erreur: 'Erreur serveur'
    });
  }
});

// ============ ROUTE POST: /api/clubs ============
router.post('/', async (req, res) => {
  // POST = créer une nouvelle ressource
  // Exemple du corps: { "nom": "Tennis", "categorie": "Sport" }

  const { nom, description, categorie, categorieNom, icone, lien, competences } = req.body;
  // Destructuration: récupère les champs du corps de la requête

  if (!nom || !categorie) {
    // nom et categorie OBLIGATOIRES
    return res.status(400).json({
      success: false,
      erreur: 'Nom et catégorie obligatoires'
    });
  }

  try {
    await pool.query(
      'INSERT INTO clubs (nom, description, categorie, categorie_nom, icone, lien, competences) VALUES (?, ?, ?, ?, ?, ?, ?)',
      // INSERT = ajouter une nouvelle ligne
      // VALUES (?, ?, ...) = les placeholders ? seront remplacés par les valeurs

      [
        nom,
        description || null,
        // description || null = si vide, mettre NULL en BD
        // (NULL = absence de valeur, pas une chaîne vide)

        categorie,
        categorieNom || categorie,
        // Si categorieNom vide, utiliser categorie

        icone || 'fa-users',
        // Icône par défaut: fontawesome icon 'fa-users'

        lien || null,
        // Lien externe optionnel

        competences ? JSON.stringify(competences) : null
        // competences est un array → JSON.stringify() le convertit en chaîne
        // NULL si competences vide
      ]
    );

    const [rows] = await pool.query(
      'SELECT * FROM clubs WHERE nom = ? ORDER BY created_at DESC LIMIT 1',
      [nom]
      // Récupère le club CRÉÉ pour l'envoyer au client (avec l'ID auto-généré)
    );

    res.status(201).json({
      // status(201) = "Created" (ressource créée avec succès)
      success: true,
      club: normaliserClub(rows[0])
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      erreur: 'Erreur serveur'
    });
  }
});

// ============ ROUTE PUT: /api/clubs/:id ============
router.put('/:id', async (req, res) => {
  // PUT = modifier une ressource existante
  // :id = l'ID du club à modifier

  const { nom, description, categorie, categorieNom, icone, lien, competences } = req.body;

  try {
    await pool.query(
      `UPDATE clubs SET 
         nom=COALESCE(?,nom), 
         description=COALESCE(?,description),
         categorie=COALESCE(?,categorie), 
         categorie_nom=COALESCE(?,categorie_nom),
         icone=COALESCE(?,icone), 
         lien=COALESCE(?,lien), 
         competences=COALESCE(?,competences) 
       WHERE id=?`,
      // UPDATE = modifier des lignes
      // COALESCE(?, valeur_actuelle) = si ? est NULL, garder la valeur actuelle
      // WHERE id=? = modifier SEULEMENT le club avec cet ID

      [
        nom, description, categorie, categorieNom, 
        icone, lien, 
        competences ? JSON.stringify(competences) : null, 
        req.params.id
      ]
    );

    const [rows] = await pool.query(
      'SELECT * FROM clubs WHERE id = ?',
      [req.params.id]
    );
    // Récupère le club MODIFIÉ

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        erreur: 'Club introuvable'
      });
    }

    res.json({
      success: true,
      club: normaliserClub(rows[0])
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      erreur: 'Erreur serveur'
    });
  }
});

// ============ ROUTE DELETE: /api/clubs/:id ============
router.delete('/:id', async (req, res) => {
  // DELETE = supprimer une ressource
  // :id = l'ID du club à supprimer

  try {
    const [result] = await pool.query(
      'DELETE FROM clubs WHERE id = ?',
      [req.params.id]
      // DELETE = supprime la ligne
      // affectedRows = nombre de lignes supprimées (0 ou 1)
    );

    if (result.affectedRows === 0) {
      // Aucune ligne supprimée = le club n'existait pas
      return res.status(404).json({
        success: false,
        erreur: 'Club introuvable'
      });
    }

    res.json({
      success: true,
      message: 'Club supprimé'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      erreur: 'Erreur serveur'
    });
  }
});

// [ROUTES POUR LES AUTRES FONCTIONNALITÉS: inscrire, se désinscrire, etc...]

module.exports = router;
```

---

### 📄 `backend/src/routes/notifications.js` & `evenements.js`

*Les routes notifications.js et evenements.js suivent les mêmes patterns CRUD (Create, Read, Update, Delete). Les explications ci-dessus couvrent les structures principales.*

---

## FRONTEND - POINT D'ENTRÉE

### 📄 `frontend/src/main.jsx` - Point d'entrée React

```javascript
import React from 'react';
// Importe la librairie React (composants, hooks, etc.)

import ReactDOM from 'react-dom/client';
// ReactDOM = permet de "monter" React dans le HTML

import App from './App';
// Importe le composant racine de l'application

import './index.css';
// Importe les styles CSS globaux

// ============ MONTAGE DE L'APPLICATION ============
ReactDOM.createRoot(document.getElementById('root'))
// ReactDOM.createRoot() = crée une racine React
// document.getElementById('root') = récupère l'élément <div id="root"></div> du HTML
// C'est dans cet élément que tous les composants React seront rendus

  .render(
    // .render() = affiche le composant

    <React.StrictMode>
      {/* React.StrictMode = mode de développement strict */}
      {/* Affiche des avertissements pour les pratiques recommandées */}
      {/* À ignorer en production */}

      <App />
      {/* App = le composant racine de l'application */}
      {/* Tous les autres composants sont des enfants de App */}
    </React.StrictMode>
  );
```

**Fichier HTML correspondant (frontend/index.html):**
```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CampusGuide</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- React montrera l'application ici -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## FRONTEND - APPLICATION PRINCIPALE

### 📄 `frontend/src/App.jsx` - Routage et Structure

```javascript
import React, { useContext } from 'react';
// useContext = hook pour accéder au contexte global

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// React Router = gestion des routes (pages) de l'application
// BrowserRouter = active le routing côté client
// Routes = conteneur pour les routes
// Route = définit une route
// Navigate = redirige vers une autre route

import { FournisseurUtilisateur, ContexteUtilisateur } from './contexte/ContexteUtilisateur';
// FournisseurUtilisateur = Provider qui met l'utilisateur à disposition
// ContexteUtilisateur = contexte pour accéder aux données utilisateur

import Navigation from './components/Navigation';
// Composant Navigation (barre en haut)

// ============ IMPORTATION DE TOUTES LES PAGES ============
import Accueil from './pages/Accueil';
import Mentors from './pages/Mentors';
import Clubs from './pages/Clubs';
import Campus from './pages/Campus';
import Orientation from './pages/Orientation';
import Calendrier from './pages/Calendrier';
import Guide from './pages/Guide';
import Profil from './pages/Profil';
import Parametres from './pages/Parametres';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import DevenirMentor from './pages/DevenirMentor';
import ProfilMentor from './pages/ProfilMentor';
import AdminDashboard from './pages/AdminDashboard';

// ============ COMPOSANT ROUTE PROTÉGÉE ============
const RouteProtegee = ({ children }) => {
  // Composant qui protège les routes (nécessite d'être connecté)
  // children = le composant à afficher si l'utilisateur est connecté

  const { utilisateur, pret } = useContext(ContexteUtilisateur);
  // utilisateur = données de l'utilisateur connecté
  // pret = booléen indiquant si l'initialisation est terminée

  if (!pret) {
    // Si l'app n'est pas prête (vérifie encore le localStorage)
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        {/* Affiche un écran de chargement (spinner) */}
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!utilisateur.id) {
    // Si l'utilisateur n'a pas d'ID = pas connecté
    return <Navigate to="/login" replace />;
    // Redirige vers la page de connexion
    // replace = remplace l'historique (on ne peut pas revenir en arrière)
  }

  return children;
  // L'utilisateur est connecté = affiche le composant enfant
};

// ============ COMPOSANT DE CONTENU PRINCIPAL ============
const ContenuApp = () => {
  // Composant qui contient le routage et la Navigation

  return (
    <Router>
      {/* Active le routing dans l'application */}

      <div className="min-h-screen bg-bg">
        {/* Div principale (hauteur minimale = écran complet) */}

        <Navigation />
        {/* Navigation statique (visible sur toutes les pages) */}

        <main className="pt-0">
          {/* Zone de contenu principal */}

          <Routes>
            {/* Définit toutes les routes de l'application */}

            {/* ROUTE PUBLIC */}
            <Route path="/login" element={<Login />} />
            {/* /login = page de connexion (accessible sans authentification) */}

            {/* ROUTES PROTÉGÉES */}
            <Route path="/" element={<RouteProtegee><Accueil /></RouteProtegee>} />
            {/* / = accueil (page d'accueil) - PROTÉGÉE */}

            <Route path="/accueil" element={<RouteProtegee><Accueil /></RouteProtegee>} />
            {/* /accueil = alias pour l'accueil - PROTÉGÉE */}

            <Route path="/mentors" element={<RouteProtegee><Mentors /></RouteProtegee>} />
            {/* /mentors = page des mentors - PROTÉGÉE */}

            <Route path="/clubs" element={<RouteProtegee><Clubs /></RouteProtegee>} />
            {/* /clubs = page des clubs - PROTÉGÉE */}

            <Route path="/campus" element={<RouteProtegee><Campus /></RouteProtegee>} />
            {/* /campus = plan du campus - PROTÉGÉE */}

            <Route path="/orientation" element={<RouteProtegee><Orientation /></RouteProtegee>} />
            {/* /orientation = guide d'orientation - PROTÉGÉE */}

            <Route path="/calendrier" element={<RouteProtegee><Calendrier /></RouteProtegee>} />
            {/* /calendrier = calendrier des événements - PROTÉGÉE */}

            <Route path="/guide" element={<RouteProtegee><Guide /></RouteProtegee>} />
            {/* /guide = guide de l'université - PROTÉGÉE */}

            <Route path="/profil" element={<RouteProtegee><Profil /></RouteProtegee>} />
            {/* /profil = mon profil utilisateur - PROTÉGÉE */}

            <Route path="/parametres" element={<RouteProtegee><Parametres /></RouteProtegee>} />
            {/* /parametres = paramètres du compte - PROTÉGÉE */}

            <Route path="/notifications" element={<RouteProtegee><Notifications /></RouteProtegee>} />
            {/* /notifications = mes notifications - PROTÉGÉE */}

            <Route path="/devenir-mentor" element={<RouteProtegee><DevenirMentor /></RouteProtegee>} />
            {/* /devenir-mentor = formulaire pour devenir mentor - PROTÉGÉE */}

            <Route path="/profil-mentor" element={<RouteProtegee><ProfilMentor /></RouteProtegee>} />
            {/* /profil-mentor = mon profil de mentor (si mentor) - PROTÉGÉE */}

            <Route path="/admin" element={<RouteProtegee><AdminDashboard /></RouteProtegee>} />
            {/* /admin = dashboard administrateur (admin only) - PROTÉGÉE */}
          </Routes>
        </main>

        <footer className="py-10 text-center text-slate-400 text-sm border-t border-slate-200 mt-20">
          {/* Footer au bas de chaque page */}
          <p> 2024 CampusGuide - Université Nouveaux Horizons</p>
        </footer>
      </div>
    </Router>
  );
};

// ============ COMPOSANT APP PRINCIPAL ============
const App = () => {
  // Composant racine de l'application
  // Wrappé par le FournisseurUtilisateur pour donner accès au contexte

  return (
    <FournisseurUtilisateur>
      {/* FournisseurUtilisateur = Provider qui fournit le contexte utilisateur */}
      {/* Tous les composants enfants peuvent accéder à ContexteUtilisateur */}

      <ContenuApp />
      {/* Le composant de contenu avec le routage */}
    </FournisseurUtilisateur>
  );
};

export default App;
// Exporte App pour l'utiliser dans main.jsx
```

---

## FRONTEND - CONTEXTE UTILISATEUR

### 📄 `frontend/src/contexte/ContexteUtilisateur.jsx` - État Global

```javascript
import React, { createContext, useState, useEffect } from 'react';
// createContext = crée un contexte React
// useState = hook pour gérer l'état local
// useEffect = hook pour les effets (chargement initial, etc.)

import { apiNotifications } from '../api';
// API pour récupérer les notifications

// ============ CRÉATION DU CONTEXTE ============
export const ContexteUtilisateur = createContext();
// Crée un contexte React
// Les composants peuvent l'importer pour accéder aux données

// ============ CLÉS DE STOCKAGE LOCAL ============
const cleNotifsUser = (userId) => `campus_notifications_${userId}`;
// Fonction helper pour générer la clé localStorage
// Exemple: "campus_notifications_5" pour l'utilisateur ID 5
// Permet de stocker les notifications de chaque utilisateur séparément

const clePhotoUser  = (userId) => `campus_photo_${userId}`;
// Fonction helper pour la clé de la photo de profil

// ============ COMPOSANT FOURNISSEUR (PROVIDER) ============
export const FournisseurUtilisateur = ({ children }) => {
  // Provider = composant qui fournit le contexte à ses enfants
  // children = les composants enfants (toute l'app)

  // ============ ÉTATS DE L'APPLICATION ============
  
  const [utilisateur, setUtilisateur] = useState({
    // État global de l'utilisateur connecté
    // Initialisé avec des valeurs vides

    id: '',
    // ID unique de l'utilisateur

    prenom: '',
    // Prénom

    nom: '',
    // Nom de famille

    email: '',
    // Email

    role: 'etudiant'
    // Rôle: 'etudiant', 'mentor', 'admin', etc.
  });

  const [photoProfil, setPhotoProfil] = useState(null);
  // Photo de profil de l'utilisateur (URL ou base64)

  const [notifications, setNotifications] = useState([]);
  // Liste des notifications de l'utilisateur

  const [pret, setPret] = useState(false);
  // Booléen: vrai quand l'initialisation est terminée
  // Évite de faire un redirect vers /login avant d'avoir vérifié le localStorage

  // ============ EFFET: INITIALISATION AU MONTAGE ============
  useEffect(() => {
    // Ce code s'exécute UNE FOIS quand le composant est monté

    const userSauvegarde = localStorage.getItem('campus_user');
    // Récupère l'utilisateur du localStorage
    // localStorage = stockage persistent du navigateur (survit aux rafraîchissements)

    if (userSauvegarde) {
      // Si un utilisateur a été trouvé en localStorage

      const user = JSON.parse(userSauvegarde);
      // JSON.parse() = convertit la chaîne JSON en objet JavaScript

      setUtilisateur(user);
      // Met à jour l'état avec les données sauvegardées

      const notifsSauvegardees = localStorage.getItem(cleNotifsUser(user.id));
      // Récupère les notifications sauvegardées pour cet utilisateur

      if (notifsSauvegardees) {
        setNotifications(JSON.parse(notifsSauvegardees));
        // Restaure les notifications
      }

      const photoSauvegardee = localStorage.getItem(clePhotoUser(user.id));
      // Récupère la photo de profil

      if (photoSauvegardee) {
        setPhotoProfil(photoSauvegardee);
        // Restaure la photo
      }
    }

    setPret(true);
    // Marque l'initialisation comme terminée
  }, []);
  // [] = dépendances vides = cet effet s'exécute une seule fois

  // ============ EFFET: SYNCHRONISATION DES NOTIFICATIONS ============
  useEffect(() => {
    // Ce code s'exécute chaque fois que utilisateur change

    if (!utilisateur.id || utilisateur.role === 'admin') return;
    // Si pas connecté OU admin = ne pas charger les notifications du serveur
    // (les admins n'ont pas besoin de notifications)

    const chargerNotifsServeur = async () => {
      // Fonction asynchrone pour charger les notifications du serveur

      try {
        const data = await apiNotifications.getAll();
        // Récupère toutes les notifications de l'API

        setNotifications(prev => {
          // Met à jour les notifications

          const IDsExistants = new Set(prev.map(n => n.id));
          // Crée un ensemble des IDs existants (pour ne pas dupliquer)

          const nouvelles = data.notifications.filter(n => !IDsExistants.has(n.id));
          // Filtre les notifications du serveur qui ne sont pas déjà locales

          const maj = [...nouvelles, ...prev];
          // Fusionne: nouvelles notifications + anciennes

          localStorage.setItem(cleNotifsUser(utilisateur.id), JSON.stringify(maj));
          // Sauvegarde dans localStorage

          return maj;
          // Retourne le nouveau tableau pour setState
        });
      } catch (err) {
        console.error('Erreur synchro notifications:', err);
        // Affiche l'erreur dans la console en cas de problème
      }
    };

    chargerNotifsServeur();
    // Appelle la fonction

  }, [utilisateur.id]);
  // [utilisateur.id] = exécute chaque fois que utilisateur.id change
  // Exemple: quand on se connecte ou se déconnecte

  // ============ VALEUR DU CONTEXTE ============
  const value = {
    // L'objet que les composants enfants recevront
    // Accessible via useContext(ContexteUtilisateur)

    utilisateur,
    setUtilisateur,
    // Les données et la fonction pour modifier l'utilisateur

    photoProfil,
    setPhotoProfil,
    // La photo et sa fonction de mise à jour

    notifications,
    setNotifications,
    // Les notifications et leur fonction de mise à jour

    pret,
    // Booléen: initialisation terminée?
  };

  // ============ RETOUR DU PROVIDER ============
  return (
    <ContexteUtilisateur.Provider value={value}>
      {/* Fournit le contexte à tous les enfants */}
      {children}
      {/* Les composants enfants (toute l'application) */}
    </ContexteUtilisateur.Provider>
  );
};
```

---

## FRONTEND - API CLIENT

### 📄 `frontend/src/api/index.js` - Client HTTP

```javascript
// ============ URL DE BASE DE L'API ============
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// import.meta.env = variables d'environnement Vite
// VITE_API_URL = variable définie dans .env
// || 'http://localhost:3001/api' = URL par défaut si non définie

// ============ FONCTION POUR RÉCUPÉRER LE TOKEN ============
function getToken() {
  // Récupère le token JWT du localStorage

  return localStorage.getItem('campus_token');
  // localStorage.getItem() = récupère une clé du localStorage
  // 'campus_token' = clé du token sauvegardé lors de la connexion
}

// ============ FONCTION GÉNÉRIQUE DE REQUÊTE ============
async function requete(endpoint, options = {}) {
  // Fonction utilitaire pour faire des requêtes HTTP
  // endpoint = chemin de l'API (ex: '/utilisateurs/connexion')
  // options = options fetch (method, headers, body, etc.)

  const token = getToken();
  // Récupère le token JWT

  const headers = {
    // En-têtes HTTP par défaut
    'Content-Type': 'application/json',
    // Indique que nous envoyons du JSON

    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    // Si token existe: ajoute l'en-tête Authorization
    // Format: "Bearer TOKEN_ICI"
    // ...options.headers fusionne les en-têtes personnalisés

    ...options.headers,
    // Fusionne les en-têtes supplémentaires du paramètre options
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      // fetch() = fonction native pour faire des requêtes HTTP
      // `${BASE_URL}${endpoint}` = URL complète
      // Exemple: 'http://localhost:3001/api' + '/utilisateurs/connexion'
      //          = 'http://localhost:3001/api/utilisateurs/connexion'

      ...options,
      // Fusionne les options du paramètre (method, body, etc.)

      headers,
      // Utilise les en-têtes configurés ci-dessus
    });

    const data = await response.json();
    // Convertit la réponse en JSON

    if (response.status === 403) {
      // Status 403 = token invalide/expiré
      // L'utilisateur doit se reconnecter

      localStorage.removeItem('campus_token');
      // Supprime le token expiré

      localStorage.removeItem('campus_user_id');
      // Supprime l'ID utilisateur

      window.location.href = '/login';
      // Redirige vers la page de connexion (rechargement complet de la page)

      throw new Error('Session expirée — reconnectez-vous');
      // Lance une erreur
    }

    if (!response.ok) {
      // Si le status HTTP indique une erreur (4xx, 5xx)
      // response.ok = true seulement si status 200-299

      throw new Error(data.erreur || `Erreur ${response.status}`);
      // Lance une erreur avec le message du serveur (ou un par défaut)
    }

    return data;
    // Retourne les données si succès
  } catch (error) {
    // Si fetch échoue (erreur réseau) ou autre erreur

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Erreur réseau: serveur inaccessible

      throw new Error('Serveur inaccessible — vérifiez que le backend est démarré');
      // Message d'erreur clair pour l'utilisateur
    }

    throw error;
    // Re-lance l'erreur
  }
}

// ============ API POUR LES UTILISATEURS ============
export const apiUtilisateurs = {
  // Objet contenant toutes les fonctions pour l'API utilisateurs

  getIdConnecte: () => localStorage.getItem('campus_user_id'),
  // Récupère l'ID de l'utilisateur connecté du localStorage

  estConnecte: () => !!localStorage.getItem('campus_token'),
  // Retourne true si un token existe = utilisateur connecté
  // !!token = convertit en booléen

  connexion: async (email, motDePasse) => {
    // POST /utilisateurs/connexion
    // Connecte l'utilisateur et retourne un token

    const data = await requete('/utilisateurs/connexion', {
      method: 'POST',
      // Method POST = créer une ressource (session)

      body: JSON.stringify({ email, motDePasse }),
      // Envoie l'email et le mot de passe en JSON
      // JSON.stringify() = convertit l'objet en chaîne JSON
    });

    // La réponse contient: { utilisateur, token }
    return data;
  },

  // [AUTRES MÉTHODES: getMoi(), get(), update(), etc. - même structure]
};

// ============ API POUR LES MENTORS ============
export const apiMentors = {
  // Objet contenant toutes les fonctions pour l'API mentors

  getAll: async (filtres = {}) => {
    // GET /mentors
    // Récupère la liste de tous les mentors

    let url = '/mentors?';
    // Commence l'URL

    if (filtres.filiere) url += `filiere=${filtres.filiere}&`;
    // Ajoute le filtre de filière

    if (filtres.disponible !== undefined) url += `disponible=${filtres.disponible}&`;
    // Ajoute le filtre de disponibilité

    if (filtres.recherche) url += `recherche=${filtres.recherche}&`;
    // Ajoute la recherche

    return await requete(url);
    // Fait la requête
  },

  // [AUTRES MÉTHODES: getById(), create(), update(), delete(), etc.]
};

// ============ API POUR LES CLUBS ============
export const apiClubs = {
  // Objet contenant toutes les fonctions pour l'API clubs

  getAll: async (filtres = {}) => {
    // GET /clubs
    // Similaire à apiMentors

    let url = '/clubs?';

    if (filtres.categorie) url += `categorie=${filtres.categorie}&`;
    if (filtres.recherche) url += `recherche=${filtres.recherche}&`;

    return await requete(url);
  },

  // [AUTRES MÉTHODES...]
};

// ============ API POUR LES NOTIFICATIONS ============
export const apiNotifications = {
  // Objet contenant toutes les fonctions pour l'API notifications

  getAll: async () => {
    // GET /notifications/:userId
    // Récupère toutes les notifications de l'utilisateur connecté

    const userId = apiUtilisateurs.getIdConnecte();
    // Récupère l'ID de l'utilisateur

    return await requete(`/notifications/${userId}`);
    // Fait la requête
  },

  // [AUTRES MÉTHODES: markAsRead(), create(), delete(), etc.]
};

// ============ API POUR LES ÉVÉNEMENTS ============
export const apiEvenements = {
  // Objet contenant toutes les fonctions pour l'API événements

  // [STRUCTURE SIMILAIRE À apiClubs ET apiMentors]
};
```

---

## FRONTEND - COMPOSANTS

### 📄 `frontend/src/components/Navigation.jsx` - Barre de Navigation

```javascript
import React, { useState, useContext } from 'react';
// useState = hook pour l'état local (menuOuvert)
// useContext = hook pour accéder au contexte global

import { Link, useLocation } from 'react-router-dom';
// Link = composant pour naviguer entre les pages
// useLocation = hook pour connaître la route actuelle

import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
// Accès aux données utilisateur

const Navigation = () => {
  const [menuOuvert, setMenuOuvert] = useState(false);
  // État local: le menu mobile est-il ouvert?
  // setMenuOuvert = fonction pour modifier l'état

  const { utilisateur, photoProfil, notifications, mettreAJourUtilisateur } = useContext(ContexteUtilisateur);
  // Récupère les données du contexte global

  const emplacement = useLocation();
  // Récupère la route actuelle (/mentors, /clubs, etc.)

  if (emplacement.pathname === '/login') return null;
  // Si on est sur /login, ne pas afficher la Navigation

  const nbNonLues = notifications?.filter(n => !n.lue).length || 0;
  // Compte le nombre de notifications non lues
  // ?. = optional chaining (si notifications est null/undefined, retourne undefined)
  // || 0 = si undefined, utilise 0

  const estActif = (chemin) => emplacement.pathname === chemin;
  // Fonction helper: vérifie si la route actuelle = chemin fourni
  // Retourne true ou false

  const NavLink = ({ to, icon, label }) => (
    // Composant réutilisable pour les liens de navigation desktop

    <Link 
      to={to} 
      // to = route vers laquelle naviguer (React Router)

      className={`no-underline text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 
        ${estActif(to) ? 'bg-blue-50 text-primary' : 'text-slate-500 hover:bg-blue-50 hover:text-primary'}`}
      // Classes CSS Tailwind:
      // estActif(to) = si route active: fond bleu + texte bleu
      // sinon: texte gris + fond au survol
    >
      <i className={`fa-solid ${icon}`}></i>
      {/* Icône FontAwesome */}

      <span>{label}</span>
      {/* Texte du lien */}
    </Link>
  );

  const MobileNavLink = ({ to, icon, label, badge = false }) => (
    // Composant réutilisable pour les liens de navigation mobile

    <Link 
      to={to} 
      onClick={() => setMenuOuvert(false)}
      // Au clic: ferme le menu mobile

      className={`no-underline text-sm font-medium flex items-center justify-between px-4 py-3 rounded-xl transition-all 
        ${estActif(to) ? 'bg-blue-50 text-primary' : 'text-slate-500 hover:bg-blue-50 hover:text-primary'}`}
    >
      <div className="flex items-center gap-3">
        <i className={`fa-solid ${icon}`}></i>
        {label}
      </div>
      {badge && <span className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(58,176,255,0.6)]"></span>}
      {/* badge = petit point coloré (ex: notification non lue) */}
    </Link>
  );

  return (
    <header className="fixed w-full flex justify-between items-center px-6 md:px-10 py-4 bg-white/30 backdrop-blur-md border-b border-slate-200 z-1000 transition-all duration-300">
      {/* En-tête sticky au haut de la page */}
      {/* bg-white/30 = fond blanc 30% opaque */}
      {/* backdrop-blur-md = effet flou derrière (vidé glass) */}

      {/* LOGO ET TITRE */}
      <Link to="/" className="flex items-center gap-3 cursor-pointer no-underline">
        <div className="flex items-center justify-center bg-primary text-white text-lg rounded-[10px] w-10 h-10">
          <i className="fa-solid fa-graduation-cap"></i>
          {/* Logo: icône de graduation */}
        </div>
        <div className="text-slate-600 leading-tight text-[10px]">
          <h1 className="text-base font-bold text-slate-800">
            Campus<span className="text-primary">Guide</span>
            {/* Campus en noir, Guide en bleu */}
          </h1>
          <p className="text-xs">Université Nouveaux Horizons</p>
        </div>
      </Link>

      {/* MENU DESKTOP (caché en mobile) */}
      <nav className="hidden lg:flex items-center gap-1">
        {/* hidden lg:flex = caché en mobile, visible en desktop large */}

        <NavLink to="/" icon="fa-house" label="Accueil" />
        <NavLink to="/mentors" icon="fa-people-arrows" label="Mentorat" />
        <NavLink to="/clubs" icon="fa-users" label="Clubs" />

        {utilisateur.role === 'admin' ? (
          // Si admin: afficher le dashboard admin
          <>
            <NavLink to="/admin" icon="fa-gauge-high" label="Dashboard" />
          </>
        ) : (
          // Sinon: afficher les liens étudiants normaux
          <>
            <NavLink to="/campus" icon="fa-map-marked-alt" label="Campus" />
            <NavLink to="/orientation" icon="fa-compass" label="Orientation" />
            <NavLink to="/calendrier" icon="fa-calendar-alt" label="Calendrier" />
            <NavLink to="/guide" icon="fa-book-open-reader" label="Guide" />
          </>
        )}
      </nav>

      {/* ICÔNES À DROITE */}
      <div className="flex items-center gap-4">
        {/* NOTIFICATIONS */}
        <div className="relative flex items-center gap-2.5 cursor-pointer px-3 py-1.5 rounded-lg transition-all duration-200 border border-transparent hover:bg-white hover:border-slate-200 group">
          <div className="relative">
            {/* ICÔNE DE CLOCHE */}
            <div>
              {/* [Contenu de la cloche de notification] */}
              {nbNonLues > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {/* Badge rouge avec le nombre de notifications non lues */}
                  {nbNonLues}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* MENU UTILISATEUR */}
        <div className="flex items-center gap-3">
          {photoProfil ? (
            <img src={photoProfil} alt="Profil" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-user text-slate-600"></i>
            </div>
          )}
          {/* Photo de profil ou icône par défaut */}

          <span className="hidden sm:inline text-sm font-medium text-slate-600">
            {utilisateur.prenom}
          </span>
          {/* Affiche le prénom en desktop seulement */}
        </div>

        {/* MENU MOBILE (icône hamburger) */}
        <button 
          className="lg:hidden text-slate-600 text-2xl"
          onClick={() => setMenuOuvert(!menuOuvert)}
          // Au clic: bascule l'état du menu
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      {/* MENU MOBILE DÉROULANT */}
      {menuOuvert && (
        // Si menu ouvert = affiche le menu mobile
        <div className="fixed top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg rounded-b-2xl p-4 flex flex-col gap-2 z-999">
          {/* Menu déroulant au-dessous de la Navigation */}

          <MobileNavLink to="/" icon="fa-house" label="Accueil" />
          <MobileNavLink to="/mentors" icon="fa-people-arrows" label="Mentorat" />
          {/* [AUTRES LIENS...] */}
          
          <div className="my-2 border-t border-slate-100"></div>
          {/* Séparateur */}

          <MobileNavLink to="/profil" icon="fa-user" label="Mon Profil" />
          <MobileNavLink to="/parametres" icon="fa-cog" label="Paramètres" />
        </div>
      )}
    </header>
  );
};

export default Navigation;
```

---

## 📊 RÉSUMÉ DES FLUX DE DONNÉES

### Flux d'Authentification:
1. **Frontend (Login)** → POST `/utilisateurs/connexion` (email, MDP)
2. **Backend** → Vérifie email + MDP, génère token JWT
3. **Frontend** → Reçoit token, le stocke dans localStorage
4. **Futures requêtes** → Envoient `Authorization: Bearer TOKEN`

### Flux de Navigation:
1. **Frontend** → Utilisateur clique sur `/mentors`
2. **React Router** → Change la route
3. **RouteProtegee** → Vérifie que l'utilisateur est connecté
4. **Composant Mentors** → Se monte et appelle `apiMentors.getAll()`
5. **API Client** → Fait une requête GET avec token
6. **Backend** → Retourne les mentors en JSON
7. **Frontend** → Affiche les mentors

### Flux du Contexte Global:
1. **FournisseurUtilisateur** → Wrappé autour de l'App
2. **Composants enfants** → useContext(ContexteUtilisateur)
3. **Données disponibles** → utilisateur, notifications, photoProfil, etc.
4. **Modification** → setUtilisateur(), setNotifications(), etc.
5. **Sauvegarde** → localStorage.setItem() pour persister

---

## 🔐 SÉCURITÉ

### Points clés:
- **JWT Tokens**: Authentification stateless (pas de sessions)
- **CORS**: Contrôle les origines autorisées
- **Middleware `authentifier`**: Vérifie les tokens avant d'accéder aux routes
- **Password Hashing**: bcryptjs hashe les mots de passe
- **localStorage**: Stocke le token (attention aux XSS)
- **RouteProtegee**: Redirige les non-connectés vers /login

---

## 📦 DÉPLOIEMENT

### Variables d'environnement requises:

**`.env` (Backend):**
```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votreMotDePasse
DB_NAME=campusguide
JWT_SECRET=votre_cle_secrete_tres_longue
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

**`.env` (Frontend - `frontend/.env`):**
```env
VITE_API_URL=http://localhost:3001/api
```

---

## 🚀 COMMANDES DE DÉMARRAGE

```bash
# Installation initiale
npm install-all

# Démarrer tout (backend + frontend)
npm start

# Ou séparément:
npm run backend    # Terminal 1
npm run frontend   # Terminal 2
```

---

**Fin de la documentation - Projet CampusGuide v2.0.0**

Créée le: 2024
Stack: Node.js + Express + React + MySQL + JWT
Author: Votre Équipe Développement

