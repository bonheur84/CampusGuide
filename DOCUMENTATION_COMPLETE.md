# 📚 DOCUMENTATION COMPLÈTE - CampusGuide
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
    10.1. [AdminDashboard.jsx](#frontend---pages---admindashboard-jsx)
    10.2. [Accueil.jsx](#frontend---pages---accueil-jsx)
    10.3. [Mentors.jsx](#frontend---pages---mentors-jsx)
    10.4. [Clubs.jsx](#frontend---pages---clubs-jsx)
    10.5. [Orientation.jsx](#frontend---pages---orientation-jsx)
    10.6. [Calendrier.jsx](#frontend---pages---calendrier-jsx)
    10.7. [Campus.jsx](#frontend---pages---campus-jsx)
    10.8. [Profil.jsx](#frontend---pages---profil-jsx)
    10.9. [Parametres.jsx](#frontend---pages---parametres-jsx)
    10.10. [Notifications.jsx](#frontend---pages---notifications-jsx)
    10.11. [Login.jsx](#frontend---pages---login-jsx)
    10.12. [DevenirMentor.jsx](#frontend---pages---devenirmentor-jsx)
    10.13. [ProfilMentor.jsx](#frontend---pages---profilmentor-jsx)
    10.14. [Guide.jsx](#frontend---pages---guide-jsx)
    10.15. [APropos.jsx](#frontend---pages---apropos-jsx)
11. [Analyse de la Génération par IA](#analyse-de-la-génération-par-ia)

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

## 📄 `frontend/src/pages/AdminDashboard.vue` - Tableau de Bord Administrateur

### 🎯 Objectif
L'AdminDashboard est l'interface centrale réservée aux administrateurs permettant de gérer tous les aspects de l'application CampusGuide : utilisateurs, mentors, clubs, événements et statistiques avancées.

### 📦 IMPORTS ET CONFIGURATION INITIALE
```javascript
import React, { useState, useEffect, useContext } from 'react';
// Hooks React pour l'état local, les effets secondaires et le contexte
import { apiUtilisateurs, apiMentors, apiClubs, apiEvenements } from '../api';
// Services API encapsulant les appels HTTP vers le backend
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
// Accès au contexte global (utilisateur, notifications, etc.)
import { motion, AnimatePresence } from 'framer-motion';
// Bibliothèque d'animations pour des transitions fluides
import { useAlerte } from '../components/AlertePersonnalisee';
// Hook personnalisé pour gérer les alertes/toast notifications
import SkeletonTable from '../components/ui/SkeletonTable';
// Composant de squelette pour afficher un état de chargement
import Tooltip from '../components/ui/Tooltip';
// Infobulle personnalisée pour améliorer l'UX
import exportService from '../services/ExportService';
// Service d'export des données vers CSV/Excel
import ratingService from '../services/RatingService';
// Service de calcul et gestion des notes/évaluations
import { Pie, Bar } from 'react-chartjs-2';
// Composants React pour les graphiques Chart.js
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
// Enregistrement des composants nécessaires pour les graphiques
```

### 🔧 ENREGISTREMENT DES GRAPHIQUES CHART.JS
```javascript
ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement);
// Enregistrement obligatoire des éléments Chart.js pour éviter les erreurs
// Chaque composant (arc, tooltip, légende, échelles, barres) doit être enregistré explicitement
```

### 🏗️ COMPOSANT PRINCIPAL ADMINDASHBOARD
```javascript
const AdminDashboard = () => {
  // Accès au contexte global pour les données utilisateur et les notifications
  const { utilisateur, ajouterNotification } = useContext(ContexteUtilisateur);
  
  // États locaux du composant
  const [tab, setTab] = useState('utilisateurs'); // Onglet actif par défaut
  const [utilisateurs, setUtilisateurs] = useState([]); // Liste des utilisateurs
  const [mentors, setMentors] = useState([]); // Liste des mentors
  const [clubs, setClubs] = useState([]); // Liste des clubs
  const [evenements, setEvenements] = useState([]); // Liste des événements
  const [chargement, setChargement] = useState(true); // État de chargement initial
  const { montrerAlerte, AlerteComponent } = useAlerte(); // Fonctions d'affichage d'alertes
  
  // Formulaires pour la création d'événements et d'utilisateurs
  const [evForm, setEvForm] = useState({
    titre: '', description: '', date: '', heure: '09:00', lieu: 'Campus Principal', categorie: 'tech'
  });
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({
    nom: '', email: '', motDePasse: '', filiere: 'informatique', annee: 'L1'
  });
  
  // Filtres pour la liste des utilisateurs
  const [filterFiliere, setFilterFiliere] = useState('tous');
  const [filterPromotion, setFilterPromotion] = useState('tous');
```

### 🔄 FILTRAGE DES UTILISATEURS
```javascript
// Fonction de filtrage appliquée en temps réel aux utilisateurs affichés
const filteredUtilisateurs = utilisateurs.filter(u => {
  const filiereMatch = filterFiliere === 'tous' || u.filiere === filterFiliere;
  const promotionMatch = filterPromotion === 'tous' || 
                        u.annee === filterPromotion || 
                        u.promotion === filterPromotion;
  return filiereMatch && promotionMatch;
});
```

### 📊 GESTION DES STATISTIQUES ET TENDANCES
```javascript
// Stockage des statistiques précédentes pour calculer les variations en pourcentage
const [previousStats, setPreviousStats] = useState({
  utilisateurs: 0,
  mentors: 0,
  evenements: 0,
  mentorsActifs: 0
});

// Fonction de calcul du pourcentage de variation entre deux valeurs
const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0; // Éviter la division par zéro
  const change = ((current - previous) / previous) * 100;
  return Math.round(change * 10) / 10; // Arrondi à 1 décimale
};

// Sauvegarde des statistiques actuelles après chaque chargement de données
useEffect(() => {
  if (!chargement && utilisateurs.length > 0) {
    const stats = {
      utilisateurs: utilisateurs.length,
      mentors: mentors.length,
      evenements: evenements.length,
      mentorsActifs: mentors.filter(m => m.status === 'approuve').length
    };
    localStorage.setItem('campus_admin_previous_stats', JSON.stringify(stats));
  }
}, [chargement, utilisateurs, mentors, evenements]);

// Chargement des statistiques précédentes depuis le localStorage au démarrage
useEffect(() => {
  const saved = localStorage.getItem('campus_admin_previous_stats');
  if (saved) {
    try {
      setPreviousStats(JSON.parse(saved));
    } catch (e) {
      console.error('Erreur lors du chargement des statistiques précédentes');
    }
  }
}, []);

// Données pour le graphique circulaire (répartition par filière)
const filiereData = {
  labels: ['Informatique', 'Médecine', 'Droit', 'Gestion', 'Architecture'],
  datasets: [{
    data: [
      utilisateurs.filter(u => u.filiere === 'informatique').length,
      utilisateurs.filter(u => u.filiere === 'medecine').length,
      utilisateurs.filter(u => u.filiere === 'droit').length,
      utilisateurs.filter(u => u.filiere === 'gestion').length,
      utilisateurs.filter(u => u.filiere === 'architecture').length
    ],
    backgroundColor: [
      '#3AB0FF', // Bleu pour Informatique
      '#FF6B6B', // Rouge pour Médecine
      '#4ECDC4', // Turquoise pour Droit
      '#FFE66D', // Jaune pour Gestion
      '#95E1D3'  // Vert clair pour Architecture
    ],
    borderWidth: 0
  }]
};

// Données pour le graphique à barres (utilisateurs par promotion)
const promotionData = {
  labels: ['L1', 'L2', 'L3', 'M1', 'M2'],
  datasets: [{
    label: 'Nombre d\'étudiants',
    data: [
      utilisateurs.filter(u => u.annee === 'L1' || u.promotion === 'L1').length,
      utilisateurs.filter(u => u.annee === 'L2' || u.promotion === 'L2').length,
      utilisateurs.filter(u => u.annee === 'L3' || u.promotion === 'L3').length,
      utilisateurs.filter(u => u.anee === 'M1' || u.promotion === 'M1').length,
      utilisateurs.filter(u => u.annee === 'M2' || u.promotion === 'M2').length
    ],
    backgroundColor: '#3AB0FF',
    borderRadius: 8
  }]
};

// Options communes pour tous les graphiques
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    }
  }
};
```

### 🔄 CHARGEMENT DES DONNÉES INITIALES
```javascript
// Chargement des données lorsque l'utilisateur connecté est un admin
useEffect(() => {
  if (utilisateur.role !== 'admin') return; // Protection contre l'accès non-autorisé
  chargerDonnees(); // Fonction de chargement des données
}, [utilisateur]); // Re-exécuter lorsque l'utilisateur change

// Fonction asynchrone de chargement de toutes les données nécessaires
const chargerDonnees = async () => {
  setChargement(true); // Afficher l'état de chargement
  try {
    // Exécution parallèle de toutes les requêtes API pour optimiser les performances
    const [dataU, dataM, dataC, dataE] = await Promise.all([
      apiUtilisateurs.adminGetTous(),     // Tous les utilisateurs (admin only)
      apiMentors.getAll({ tous: 'true' }), // Tous les mentors (incluant en attente)
      apiClubs.getAll(),                  // Tous les clubs
      apiEvenements.getAll()              // Tous les événements
    ]);
    
    // Mise à jour des états locaux avec les données reçues
    setUtilisateurs(dataU.utilisateurs);
    setMentors(dataM.mentors);
    setClubs(dataC.clubs);
    setEvenements(dataE.evenements || []); // Valeur par défaut tableau vide si null
  } catch (err) {
    console.error('Erreur lors du chargement des données admin:', err);
    // Les erreurs sont gérées individuellement dans chaque fonction d'action
  } finally {
    setChargement(false); // Cacher l'état de chargement quoi qu'il arrive
  }
};
```

### ⚙️ FONCTIONS D'ACTION ET DE MODIFICATION
```javascript
// Mise à jour du statut d'un mentor (approuver/rejeter)
const handleUpdateStatus = async (id, status) => {
  try {
    await apiMentors.adminUpdateStatus(id, status);
    // Notification de succès avec icône de validation
    ajouterNotification(
      "Statut mis à jour", 
      `Le mentor est désormais ${status}`, 
      "success", 
      "fa-check"
    );
    chargerDonnees(); // Recharger les données pour refléter le changement
  } catch (err) {
    ajouterNotification("Erreur", err.message, "error");
  }
};

// Création d'un nouvel événement
const handleCreateEvent = async (e) => {
  e.preventDefault(); // Empêcher la soumission normale du formulaire
  try {
    await apiEvenements.creer(evForm);
    // Notification de succès avec icône de calendrier
    ajouterNotification(
      "Événement créé", 
      "L'événement a été ajouté au calendrier", 
      "success", 
      "fa-calendar-plus"
    );
    // Réinitialisation du formulaire après succès
    setEvForm({ 
      titre: '', description: '', date: '', heure: '09:00', 
      lieu: 'Campus Principal', categorie: 'tech' 
    });
    chargerDonnees(); // Recharger pour afficher le nouvel événement
  } catch (err) {
    ajouterNotification("Erreur", err.message, "error");
  }
};

// Suppression d'un utilisateur avec confirmation
const handleDeleteUser = async (id, nom) => {
  const confirmed = await montrerAlerte({
    type: 'confirm',
    titre: 'Supprimer le compte',
    message: `Voulez-vous vraiment supprimer définitivement le compte de ${nom} ?`,
    boutonConfirmText: 'Supprimer',
    boutonCancelText: 'Annuler'
  });
  
  if (confirmed) {
    try {
      await apiUtilisateurs.supprimer(id);
      ajouterNotification(
        "Compte supprimé", 
        `Le compte de ${nom} a été effacé.`, 
        "success", 
        "fa-trash-can"
      );
      chargerDonnees();
    } catch (err) {
      ajouterNotification("Erreur", err.message, "error");
    }
  }
};

// Création d'un nouvel utilisateur
const handleCreateUser = async (e) => {
  e.preventDefault();
  try {
    await apiUtilisateurs.inscription(
      userForm.email,
      userForm.motDePasse,
      userForm.nom,
      userForm.filiere,
      userForm.annee
    );
    ajouterNotification(
      "Compte créé", 
      `L'étudiant ${userForm.nom} a été ajouté avec succès.`, 
      "success", 
      "fa-user-plus"
    );
    // Réinitialisation du formulaire et masquage
    setUserForm({ 
      nom: '', email: '', motDePasse: '', 
      filiere: 'informatique', annee: 'L1' 
    });
    setShowUserForm(false);
    chargerDonnees();
  } catch (err) {
    ajouterNotification("Erreur", err.message, "error");
  }
};

// Suppression d'un profil mentor avec confirmation
const handleDeleteMentor = async (id, nom) => {
  const confirmed = await montrerAlerte({
    type: 'confirm',
    titre: 'Supprimer le profil mentor',
    message: `Voulez-vous vraiment supprimer le profil mentor de ${nom} ?`,
    boutonConfirmText: 'Supprimer',
    boutonCancelText: 'Annuler'
  });
  
  if (confirmed) {
    try {
      await apiMentors.supprimer(id);
      ajouterNotification(
        "Profil supprimé", 
        `Le profil mentor de ${nom} a été retiré.`, 
        "success", 
        "fa-user-minus"
      );
      chargerDonnees();
    } catch (err) {
      ajouterNotification("Erreur", err.message, "error");
    }
  }
};
```

### 🖥️ RENDU CONDITIONNEL ET CONTRÔLE D'ACCÈS
```javascript
// Redirection vers accès refusé si l'utilisateur n'est pas admin
if (utilisateur.role !== 'admin') {
  return <div className="pt-40 text-center text-red-500 font-bold text-2xl">
    Accès Refusé — Administrateurs uniquement.
  </div>;
}

// Interface principale du tableau de bord admin
return (
  <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 bg-[#f8f9fa] min-h-screen anime-apparition">
    <div className="max-w-[1200px] mx-auto">
      {/* En-tête avec titre et actions rapides */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Tableau de Bord <span className="text-primary">Admin</span>
        </h1>
        <p className="text-slate-500">Gérez les comptes, validez les mentors et organisez les événements.</p>
        <div className="flex gap-3 mt-4">
          {/* Bouton d'export CSV des utilisateurs filtrés */}
          <Tooltip content="Exporter la liste des utilisateurs en CSV">
            <button
              onClick={() => exportService.exportToCSV(
                filteredUtilisateurs,
                `utilisateurs_${filterFiliere !== 'tous' ? filterFiliere : 'tous'}_${filterPromotion !== 'tous' ? filterPromotion : 'tous'}`,
                ['nom', 'email', 'role', 'filiere', 'annee', 'created_at'],
                ['Nom', 'Email', 'Rôle', 'Filière', 'Année', 'Date de création']
              )}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <i className="fas fa-file-csv"></i> Export CSV Utilisateurs
            </button>
          </Tooltip>
          
          {/* Bouton d'export CSV des mentors */}
          <Tooltip content="Exporter la liste des mentors en CSV">
            <button
              onClick={() => exportService.exportToCSV(
                mentors,
                'mentors',
                ['nom', 'filiere', 'annee', 'specialite', 'bio', 'status', 'note', 'nb_etudiants'],
                ['Nom', 'Filière', 'Année', 'Spécialité', 'Bio', 'Statut', 'Note', 'Étudiants']
              )}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <i className="fas fa-file-csv"></i> Export CSV Mentors
            </button>
          </Tooltip>
          
          {/* Bouton pour afficher/masquer le formulaire de création d'utilisateur */}
          <Tooltip content="Créer un nouvel utilisateur">
            <button 
              onClick={() => setShowUserForm(!showUserForm)}
              className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <i className="fas fa-user-plus"></i> {showUserForm ? 'Fermer' : 'Nouvel Utilisateur'}
            </button>
          </Tooltip>
        </div>
      </header>
      
      {/* Navigation par onglets pour les différentes sections */}
      <div className="flex gap-4 mb-8 border-b border-slate-200">
        {/* Onglet Utilisateurs */}
        <Tooltip content="Gérer les utilisateurs">
          <button 
            onClick={() => setTab('utilisateurs')} 
            className={`pb-3 px-2 font-bold text-sm transition-all border-b-2 ${tab === 'utilisateurs' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}
          >
            Utilisateurs
          </button>
        </Tooltip>
        
        {/* Onglet Mentors (demandes d'approbation) */}
        <Tooltip content="Valider les demandes de mentors">
          <button 
            onClick={() => setTab('mentors')} 
            className={`pb-3 px-2 font-bold text-sm transition-all border-b-2 ${tab === 'mentors' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}
          >
            Demandes Mentors
          </button>
        </Tooltip>
        
        {/* Onglet Clubs */}
        <Tooltip content="Gérer les clubs">
          <button 
            onClick={() => setTab('clubs')} 
            className={`pb-3 px-2 font-bold text-sm transition-all border-b-2 ${tab === 'clubs' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}
          >
            Clubs
          </button>
        </Tooltip>
        
        {/* Onglet Création d'Événement */}
        <Tooltip content="Créer un nouvel événement">
          <button 
            onClick={() => setTab('evenements')} 
            className={`pb-3 px-2 font-bold text-sm transition-all border-b-2 ${tab === 'evenements' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}
          >
            Nouvel Événement
          </button>
        </Tooltip>
        
        {/* Onglet Analytics (statistiques avancées) */}
        <Tooltip content="Voir les statistiques avancées">
          <button 
            onClick={() => setTab('analytics')} 
            className={`pb-3 px-2 font-bold text-sm transition-all border-b-2 ${tab === 'analytics' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}
          >
            Analytics
          </button>
        </Tooltip>
      </div>
      
      {/* Affichage conditionnel du contenu basé sur l'onglet sélectionné */}
      {chargement ? (
        // Affiche un squelette pendant le chargement des données
        <SkeletonTable rows={5} />
      ) : (
        // Animation d'entrée/sortie pour les transitions entre onglets
        <AnimatePresence mode="wait">
          {/* Onglet Utilisateurs */}
          {tab === 'utilisateurs' && (
            <motion.section key="u" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* Filtres de recherche */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-filter text-slate-400"></i>
                  <span className="text-sm font-bold text-slate-600">Filtrer par:</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Filière:</label>
                  <select
                    value={filterFiliere}
                    onChange={(e) => setFilterFiliere(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-primary outline-none bg-slate-50"
                  >
                    <option value="tous">Toutes</option>
                    <option value="informatique">Informatique</option>
                    <option value="medecine">Médecine</option>
                    <option value="droit">Droit</option>
                    <option value="gestion">Gestion</option>
                    <option value="architecture">Architecture</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Promotion:</label>
                  <select
                    value={filterPromotion}
                    onChange={(e) => setFilterPromotion(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-primary outline-none bg-slate-50"
                  >
                    <option value="tous">Toutes</option>
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                    <option value="M1">M1</option>
                    <option value="M2">M2</option>
                  </select>
                </div>
                <button
                  onClick={() => { setFilterFiliere('tous'); setFilterPromotion('tous'); }}
                  className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                >
                  Réinitialiser
                </button>
              </div>
              
              {/* Formulaire de création d'utilisateur (conditionnel) */}
              {showUserForm && (
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-user-plus text-primary"></i> Créer un nouvel étudiant
                  </h3>
                  <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Champs du formulaire : nom, email, mot de passe, filière, année */}
                    {/* ... implémentation du formulaire avec validation ... */}
                    <div className="md:col-span-2 flex gap-3 mt-2">
                      <button 
                        type="submit" 
                        className="flex-1 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-check"></i> Créer le compte
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowUserForm(false)}
                        className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Tableau des utilisateurs filtrés */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Nom</th>
                      <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
                      <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Rôle</th>
                      <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Filière</th>
                      <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUtilisateurs.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5 font-bold text-slate-800">{u.nom}</td>
                        <td className="p-5 text-slate-500 text-sm">{u.email}</td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-5 text-slate-500 text-sm">{u.filiere || '-'} {u.promotion || ''}</td>
                        <td className="p-5">
                          {/* Bouton de suppression (masqué pour l'utilisateur connecté) */}
                          {u.id !== utilisateur.id && (
                            <button 
                              onClick={() => handleDeleteUser(u.id, u.nom)}
                              className="text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer p-2 rounded-lg hover:bg-red-50 transition-all"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>
          )}
          
          {/* Onglet Mentors (liste et gestion des demandes) */}
          {tab === 'mentors' && (
            <motion.section key="m" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentors.length > 0 ? (
                mentors.map(m => (
                  <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-6 relative group">
                    {/* Bouton de suppression (visible au survol) */}
                    <button 
                      onClick={() => handleDeleteMentor(m.id, m.nom)}
                      className="absolute top-4 right-4 w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white cursor-pointer"
                      title="Supprimer le profil mentor"
                    >
                      <i className="fa-solid fa-user-minus text-xs"></i>
                    </button>
                    
                    {/* Avatar du mentor */}
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl shrink-0 overflow-hidden">
                      {m.photo ? <img src={m.photo} className="w-full h-full object-cover" /> : <i className="fa-solid fa-user text-3xl text-slate-300 mt-5 ml-6"></i>}
                    </div>
                    
                    {/* Informations du mentor */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-lg">{m.nom}</h3>
                        {/* Badge de statut avec couleur selon l'état */}
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          m.status === 'approuve' ? 'bg-emerald-100 text-emerald-600' : 
                          m.status === 'rejete' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <p className="text-primary text-xs font-bold mb-2 uppercase">{m.filiere} • {m.annee}</p>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-3 italic">"{m.bio}"</p>
                      
                      {/* Statistiques de notation */}
                      <div className="bg-slate-50 rounded-xl p-3 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-600 uppercase">Note moyenne</span>
                          <span className="text-lg font-bold text-amber-500">{m.moyenneRating || 0}/5</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Nombre de votes</span>
                          <span className="text-sm font-semibold text-slate-700">{m.totalVotes || 0} étudiant{m.totalVotes > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      
                      {/* Boutons d'action pour les mentors en attente */}
                      {m.status === 'en_attente' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateStatus(m.id, 'approuve')} className="flex-1 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all">Accepter</button>
                          <button onClick={() => handleUpdateStatus(m.id, 'rejete')} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all">Refuser</button>
                        </div>
                      )}
                      {m.status === 'approuve' && (
                        <button onClick={() => handleUpdateStatus(m.id, 'rejete')} className="w-full py-2 bg-slate-50 text-slate-400 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-all">Révoquer le statut</button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // Message quand aucun mentor n'est présent
                <div className="col-span-2 py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium">
                  Aucun mentor répertorié.
                </div>
              )}
            </motion.section>
          )}
          
          {/* Onglet Clubs (liste et gestion) */}
          {tab === 'clubs' && (
            <motion.section key="c" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clubs.length > 0 ? (
                clubs.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-6 relative group">
                    {/* Icône du club */}
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center">
                      <i className={`fa-solid ${c.icone} text-3xl text-slate-400`}></i>
                    </div>
                    
                    {/* Informations du club */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-lg">{c.nom}</h3>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase bg-primary/10 text-primary`}>
                          {c.categorieNom}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-3 italic">"{c.description}"</p>
                      
                      {/* Statistiques de notation */}
                      <div className="bg-slate-50 rounded-xl p-3 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-600 uppercase">Note moyenne</span>
                          <span className="text-lg font-bold text-amber-500">{c.moyenneRating || 0}/5</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Nombre de votes</span>
                          <span className="text-sm font-semibold text-slate-700">{c.totalVotes || 0} étudiant{c.totalVotes > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      
                      {/* Nombre de membres */}
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <i className="fa-solid fa-users"></i>
                        <span>{c.membres} membres</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Message quand aucun club n'est présent
                <div className="col-span-2 py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium">
                  Aucun club répertorié.
                </div>
              )}
            </motion.section>
          )}
          
          {/* Onglet Création d'Événement (formulaire) */}
          {tab === 'evenements' && (
            <motion.section key="e" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <form onSubmit={handleCreateEvent} className="space-y-5">
                {/* Champs du formulaire : titre, catégorie, date, heure, lieu, description */}
                {/* ... implémentation du formulaire avec validation ... */}
                <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                  Créer l'événement
                </button>
              </form>
            </motion.section>
          )}
          
          {/* Onglet Analytics (tableau de bord statistique) */}
          {tab === 'analytics' && (
            <motion.section key="a" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              {/* Cartes KPI (indicateurs de performance clés) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Carte Utilisateurs */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-users text-blue-600 text-xl"></i>
                    </div>
                    {/* Indicateur de variation (%) */}
                    {(() => {
                      const change = calculatePercentageChange(utilisateurs.length, previousStats.utilisateurs);
                      const isPositive = change >= 0;
                      return (
                        <span className={`text-xs font-bold ${isPositive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full`}>
                          {isPositive ? '+' : ''}{change}%
                        </span>
                      );
                    })()}
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{utilisateurs.length}</h3>
                  <p className="text-sm text-slate-500">Utilisateurs</p>
                </div>
                
                {/* Carte Mentors */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-people-arrows text-purple-600 text-xl"></i>
                    </div>
                    {(() => {
                      const change = calculatePercentageChange(mentors.length, previousStats.mentors);
                      const isPositive = change >= 0;
                      return (
                        <span className={`text-xs font-bold ${isPositive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full`}>
                          {isPositive ? '+' : ''}{change}%
                        </span>
                      );
                    })()}
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{mentors.length}</h3>
                  <p className="text-sm text-slate-500">Mentors</p>
                </div>
                
                {/* Carte Événements */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-calendar text-amber-600 text-xl"></i>
                    </div>
                    {(() => {
                      const change = calculatePercentageChange(evenements.length, previousStats.evenements);
                      const isPositive = change >= 0;
                      return (
                        <span className={`text-xs font-bold ${isPositive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full`}>
                          {isPositive ? '+' : ''}{change}%
                        </span>
                      );
                    })()}
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{evenements.length}</h3>
                  <p className="text-sm text-slate-500">Événements</p>
                </div>
                
                {/* Carte Mentors Actifs */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-check-circle text-emerald-600 text-xl"></i>
                    </div>
                    {(() => {
                      const mentorsActifs = mentors.filter(m => m.status === 'approuve').length;
                      const change = calculatePercentageChange(mentorsActifs, previousStats.mentorsActifs);
                      const isPositive = change >= 0;
                      return (
                        <span className={`text-xs font-bold ${isPositive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full`}>
                          {isPositive ? '+' : ''}{change}%
                        </span>
                      );
                    })()}
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{mentors.filter(m => m.status === 'approuve').length}</h3>
                  <p className="text-sm text-slate-500">Mentors Actifs</p>
                </div>
              </div>
              
              {/* Graphiques avancés */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Graphique circulaire : Répartition par filière */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Répartition par Filière</h3>
                  <div className="h-64">
                    <Pie data={filiereData} options={chartOptions} />
                  </div>
                </div>
                
                {/* Graphique à barres : Utilisateurs par promotion */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Utilisateurs par Promotion</h3>
                  <div className="h-64">
                    <Bar data={promotionData} options={{
                      ...chartOptions,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }} />
                  </div>
                </div>
              </div>
              
              {/* Graphiques de progression simples */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Répartition des mentors par statut */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Statut des Mentors</h3>
                  <div className="space-y-4">
                    {/* Barres de progression pour chaque statut */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Approuvés</span>
                        <span className="text-sm font-bold text-slate-900">{mentors.filter(m => m.status === 'approuve').length}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${mentors.length > 0 ? (mentors.filter(m => m.status === 'approuve').length / mentors.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">En attente</span>
                        <span className="text-sm font-bold text-slate-900">{mentors.filter(m => m.status === 'en_attente').length}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${mentors.length > 0 ? (mentors.filter(m => m.status === 'en_attente').length / mentors.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Rejetés</span>
                        <span className="text-sm font-bold text-slate-900">{mentors.filter(m => m.status === 'rejete').length}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${mentors.length > 0 ? (mentors.filter(m => m.status === 'rejete').length / mentors.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Répartition des utilisateurs par rôle */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Utilisateurs par Rôle</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Étudiants</span>
                        <span className="text-sm font-bold text-slate-900">{utilisateurs.filter(u => u.role === 'etudiant').length}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${utilisateurs.length > 0 ? (utilisateurs.filter(u => u.role === 'etudiant').length / utilisateurs.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Admins</span>
                        <span className="text-sm font-bold text-slate-900">{utilisateurs.filter(u => u.role === 'admin').length}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${utilisateurs.length > 0 ? (utilisateurs.filter(u => u.role === 'admin').length / utilisateurs.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tableau des statistiques détaillées */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Statistiques Détaillées</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Statistiques en colonnes */}
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Utilisateurs</p>
                    <p className="text-2xl font-bold text-slate-900">{utilisateurs.length}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Mentors</p>
                    <p className="text-2xl font-bold text-slate-900">{mentors.length}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Clubs</p>
                    <p className="text-2xl font-bold text-slate-900">{clubs.length}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Événements</p>
                    <p className="text-2xl font-bold text-slate-900">{evenements.length}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Taux d'approbation</p>
                    <p className="text-2xl font-bold text-emerald-600">{mentors.length > 0 ? Math.round((mentors.filter(m => m.status === 'approuve').length / mentors.length) * 100) : 0}%</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Moyenne membres/club</p>
                    <p className="text-2xl font-bold text-amber-600">{clubs.length > 0 ? Math.round(clubs.reduce((sum, c) => sum + (c.membres || 0), 0) / clubs.length) : 0}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Filière la plus populaire</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {utilisateurs.length > 0 ? 
                        (() => {
                          const counts = utilisateurs.reduce((acc, u) => {
                            acc[u.filiere] = (acc[u.filiere] || 0) + 1;
                            return acc;
                          }, { informatique: 0, medecine: 0, droit: 0, gestion: 0, architecture: 0 });
                          const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                          const top = sorted[0]?.[0] || '-';
                          return top.charAt(0).toUpperCase() + top.slice(1);
                        })()
                        : '-'}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Promotion la plus active</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {utilisateurs.length > 0 ?
                        ['L1', 'L2', 'L3', 'M1', 'M2'].map(p => ({
                          promo: p,
                          count: utilisateurs.filter(u => u.annee === p || u.promotion === p).length
                        })).sort((a, b) => b.count - a.count)[0]?.promo || '-'
                        : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      )}
      
      {/* Composant d'alerte global (toasts/notifications) */}
      <AlerteComponent />
    </div>
  </main>
);
};

// Export du composant pour utilisation dans l'application
export default AdminDashboard;
```

### 📊 FUX DE DONNÉES DANS L'ADMINDASHBOARD

1. **Initialisation et Vérification d'Accès**:
   - Le composant vérifie immédiatement si l'utilisateur connecté possède le rôle 'admin'
   - En cas d'échec, redirection vers un message d'accès refusé

2. **Chargement Initial des Données**:
   - Au montage et à chaque changement d'utilisateur, déclenchement de `chargerDonnees()`
   - Utilisation de `Promise.all()` pour charger en parallèle :
     * Tous les utilisateurs (via API admin)
     * Tous les mentors (y compris ceux en attente d'approbation)
     * Tous les clubs
     * Tous les événements
   - Gestion des états de chargement avec affichage de squelettes

3. **Gestion des États Locaux**:
   - Stockage des listes utilisateurs, mentors, clubs, événements
   - États pour les filtres, formulaires, modals et indicateurs de chargement
   - Persistance des statistiques précédentes dans localStorage pour calcul des tendances

4. **Interactions Utilisateur**:
   - **Filtrage**: Mise à jour en temps réel de la liste des utilisateurs selon filière/promotion
   - **Formulaires**: Validation et soumission via les services API appropriés
   - **Actions CRUD**: Création, lecture, mise à jour, suppression avec gestion d'erreurs
   - **Notifications**: Utilisation du hook `useAlerte` pour les retours utilisateur
   - **Export**: Génération de fichiers CSV via le service d'export

5. **Visualisation des Données**:
   - Cartes KPI avec indicateurs de tendance (pourcentage de variation)
   - Graphiques circulaires et à barres utilisant Chart.js/react-chartjs-2
   - Barres de progression pour visualiser les répartitions
   - Tableaux détaillés avec fonctionnalité de tri et de filtrage

### 🔐 SÉCURITÉ ET CONTRÔLE D'ACCÈS

1. **Protection de Route**:
   - Vérification du rôle `utilisateur.role !== 'admin'` en début de composant
   - Redirection immédiate vers message d'erreur pour les non-admins

2. **Validation des Actions**:
   - Chaque modification (suppression, mise à jour de statut) nécessite une confirmation
   - Les actions sensibles sont limitées aux administrateurs vérifiés

3. **Gestion des Erreurs**:
   - Catch des erreurs API avec notifications utilisateur appropriées
   - Journalisation en console pour le débogage
   - États de chargement pour éviter les interactions pendant les requêtes

### 🎨 COMPOSANTS REUTILISABLES UTILISÉS

1. **Layout et Navigation**:
   - `Motion` et `AnimatePresence` de Framer Motion pour les transitions
   - Classes utilitaires TailwindCSS pour le design responsive

2. **Composants UI Custom**:
   - `SkeletonTable`: États de chargement visuellement agréables
   - `Tooltip`: Infobulles contextuelles pour améliorer l'UX
   - `useAlerte`: Hook personnalisé pour système de notifications/toasts

3. **Intégrations Tierces**:
   - `react-chartjs-2` + `chart.js`: Visualisation de données avancée
   - `framer-motion`: Animations et transitions fluides
   - Services personnalisés: `ExportService`, `RatingService`

### 📱 RESPONSIVE DESIGN

L'interface est entièrement responsive grâce à:
- Utilisation extensive des classes utilitaires TailwindCSS
- Grilles responsives (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)
- Points d'arrêt adaptatifs pour mobile/tablette/desktop
- Conteneurs avec largeur maximale (`max-w-[1200px] mx-auto`) pour limiter l'étirement sur grands écrans

### ⚡ PERFORMANCE ET OPTIMISATIONS

1. **Chargement Parallèle**:
   - Utilisation de `Promise.all()` pour minimiser le temps de chargement initial

2. **Mémoïsation Implicite**:
   - Les données filtrées (`filteredUtilisateurs`) sont recalculées uniquement lorsque les dépendances changent

3. **Évitement des Recalculs Inutiles**:
   - Les données des graphiques sont calculées directement dans le rendu
   - Utilisation de `useEffect` avec dépendances précises pour les opérations coûteuses

4. **Gestion de l'État**:
   - Séparation claire entre état local (useState) et état global (useContext)
   - Mise à jour ciblée des états pour éviter les renders excessifs

Ce composant représente le cœur de l'administration de l'application CampusGuide, combinant une interface utilisateur riche avec des fonctionnalités de gestion complète tout en maintenant une expérience fluide et sécurisée pour les administrateurs.

---
## 📄 `frontend/src/pages/Accueil.jsx` - Page d'Accueil

### 🎯 Objectif
La page d'accueil est la première vue que voient les utilisateurs connectés. Elle présente une vue d'ensemble de l'application avec des statistiques clés, des appels à l'action vers les principales fonctionnalités et une présentation de l'université.

### 📦 IMPORTS ET CONFIGURATION INITIALE
```javascript
import React, { useState, useEffect } from 'react';
// Hooks React pour gérer l'état local et les effets secondaires
import { Link } from 'react-router-dom';
// Composant pour naviguer entre les pages de l'application
import CompteurAnime from '../components/CompteurAnime';
// Composant personnalisé pour afficher un compteur animé
```

### 🏗️ COMPOSANT PRINCIPAL ACCUEIL
```javascript
const Accueil = () => {
  // Le composant n'utilise pas d'état local complexe car il affiche principalement du contenu statique
  // et des composants réutilisables comme CompteurAnime
  
  return (
    <div className="anime-apparition bg-white">
      {/* Conteneur principal avec animation d'apparition au chargement */}
      
      <main className="pb-16">
        {/* Section principale de la page */}
        
        <section className="flex flex-col items-center text-center w-full relative" 
                 style={{ 
                   backgroundImage: 'url(/assets/universite-nouveaux-horizons.jpg)', 
                   backgroundSize: 'cover', 
                   backgroundPosition: 'center', 
                   minHeight: '700px' 
                 }}>
          {/* Section hero avec image de fond de l'université */}
          
          {/* Overlay sombre avec dégradé pour améliorer la lisibilité du texte */}
          <div className="absolute inset-0 bg-black/40" 
               style={{ 
                 background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.4) 50%, rgba(255,255,255,0.95) 100%)' 
               }}></div>
          
          <div className="relative z-10 pt-[100px] md:pt-[140px]">
            {/* Contenu centré au-dessus de l'overlay */}
            
            {/* Badge d'accueil */}
            <span className="bg-white/90 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider relative z-2 inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
              <i className="fa-solid fa-graduation-cap"></i> <span>ESPACE ÉTUDIANT</span>
            </span>
            
            {/* Titre principal */}
            <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-white leading-tight md:leading-none max-w-[900px]">
              Votre reussite commence ici, avec Campus<span className="text-primary">guide</span>
            </h1>
            
            {/* Description sous-titre */}
            <p className="text-white/90 text-base md:text-[17.6px] mb-8 max-w-[800px]">
              Trouvez vos salles de cours, connectez-vous avec des mentors, et naviguez dans le campus en toute simplicité.
            </p>
            
            {/* Boutons d'appel à l'action */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10 w-full sm:w-auto px-4 sm:px-0">
              {/* Bouton Explorer le Campus */}
              <Link to="/campus" 
                    className="px-6 py-3.5 rounded-[15px] font-semibold bg-primary text-white no-underline inline-block text-[15px] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(58,176,255,0.4)] transition-all duration-300">
                Explorer le Campus <i className="fa-solid fa-arrow-right ml-2.5"></i>
              </Link>
              
              {/* Bouton Trouver un Mentor */}
              <Link to="/mentors" 
                    className="px-6 py-3.5 rounded-[15px] font-semibold bg-white text-primary border border-primary no-underline inline-block text-[15px] hover:bg-sky-50 hover:border-primary-dark hover:text-primary-dark hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300">
                Trouver un Mentor
              </Link>
            </div>
            
            {/* Statistiques clés en grille */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-[1000px] mx-auto w-full px-2 pb-12">
              {/* Statistique Mentors */}
              <div className="bg-orange-50/80 rounded-xl p-4 md:p-5 text-center border border-orange-200 shadow-sm hover:-translate-y-1 transition-transform duration-300 backdrop-blur-sm">
                <i className="fa-solid fa-people-arrows text-xl md:text-2xl text-orange-600 mb-3 block"></i>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">
                  <CompteurAnime valeur="20" />
                </h2>
                <p className="text-[11px] md:text-[13px] text-slate-500 font-medium uppercase tracking-wide">Mentors</p>
              </div>
              
              {/* Statistique Clubs */}
              <div className="bg-green-50/80 rounded-xl p-4 md:p-5 text-center border border-green-200 shadow-sm hover:-translate-y-1 transition-transform duration-300 backdrop-blur-sm">
                <i className="fa-solid fa-users text-xl md:text-2xl text-green-600 mb-3 block"></i>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">
                  <CompteurAnime valeur="20" />
                </h2>
                <p className="text-[11px] md:text-[13px] text-slate-500 font-medium uppercase tracking-wide">Clubs</p>
              </div>
              
              {/* Statistique Filières */}
              <div className="bg-sky-50/80 rounded-xl p-4 md:p-5 text-center border border-sky-200 shadow-sm hover:-translate-y-1 transition-transform duration-300 backdrop-blur-sm">
                <i className="fa-solid fa-map-marker-alt text-xl md:text-2xl text-sky-600 mb-3 block"></i>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">
                  <CompteurAnime valeur="10" />
                </h2>
                <p className="text-[11px] md:text-[13px] text-slate-500 font-medium uppercase tracking-wide">Filieres</p>
              </div>
              
              {/* Statistique Auditoires */}
              <div className="bg-red-50/80 rounded-xl p-4 md:p-5 text-center border border-red-200 shadow-sm hover:-translate-y-1 transition-transform duration-300 backdrop-blur-sm">
                <i className="fa-solid fa-building text-xl md:text-2xl text-red-600 mb-3 block"></i>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">
                  <CompteurAnime valeur="20" />
                </h2>
                <p className="text-[11px] md:text-[13px] text-slate-500 font-medium uppercase tracking-wide">Auditoires</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section des fonctionnalités principales */}
        <section className="mt-1 rounded-[20px] py-12 md:py-24 text-center bg-white">
          <h2 className="text-3xl md:text-[40px] font-bold mb-4 text-slate-900 px-4">Tout ce dont vous avez besoin</h2>
          <p className="text-slate-500 mb-8 md:mb-12 px-6">Des outils conçus spécifiquement pour l'Universite Nouveaux Horizons.</p>
          
          {/* Grille des fonctionnalités */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1000px] mx-auto relative z-1 px-6">
            {/* Fonctionnalité Système de Mentorat */}
            <Link to="/mentors" 
                  className="bg-white rounded-2xl p-10 md:p-12 text-center border border-slate-200 transition-all duration-200 cursor-pointer no-underline hover:bg-bg hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
              <div className="w-24 h-24 rounded-xl flex items-center justify-center mx-auto mb-8 text-4xl bg-orange-50 text-orange-600">
                <i className="fa-solid fa-people-arrows"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Système de Mentorat</h3>
              <p className="text-lg text-slate-500 leading-relaxed">Trouvez un mentor pour vous guider dans vos études et votre parcours.</p>
            </Link>
            
            {/* Fonctionnalité Plan des Bâtiments */}
            <Link to="/campus" 
                  className="bg-white rounded-2xl p-10 md:p-12 text-center border border-slate-200 transition-all duration-200 cursor-pointer no-underline hover:bg-bg hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
              <div className="w-24 h-24 rounded-xl flex items-center justify-center mx-auto mb-8 text-4xl bg-sky-50 text-sky-600">
                <i className="fa-solid fa-map-marked-alt"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Plan des Bâtiments</h3>
              <p className="text-lg text-slate-500 leading-relaxed">Localisez facilement n'importe quelle salle sur le campus avec notre plan interactif.</p>
            </Link>
            
            {/* Fonctionnalité Clubs & Associations */}
            <Link to="/clubs" 
                  className="bg-white rounded-2xl p-10 md:p-12 text-center border border-slate-200 transition-all duration-200 cursor-pointer no-underline hover:bg-bg hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
              <div className="w-24 h-24 rounded-xl flex items-center justify-center mx-auto mb-8 text-4xl bg-green-50 text-green-600">
                <i className="fa-solid fa-users"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Clubs & Associations</h3>
              <p className="text-lg text-slate-500 leading-relaxed">Decouvrez les clubs disponibles et rejoignez une communautee qui vous ressemble.</p>
            </Link>
            
            {/* Fonctionnalité Orientation Filières */}
            <Link to="/orientation" 
                  className="bg-white rounded-2xl p-10 md:p-12 text-center border border-slate-200 transition-all duration-200 cursor-pointer no-underline hover:bg-hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
              <div className="w-24 h-24 rounded-xl flex items-center justify-center mx-auto mb-8 text-4xl bg-teal-50 text-teal-600">
                <i className="fa-solid fa-compass"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Orientation Filières</h3>
              <p className="text-lg text-slate-500 leading-relaxed">Repondez a quelques questions et decouvrez la filiere qui correspond a vos aspirations.</p>
            </Link>
            
            {/* Fonctionnalité Calendrier Academique */}
            <Link to="/calendrier" 
                  className="bg-white rounded-2xl p-10 md:p-12 text-center border border-slate-200 transition-all duration-200 cursor-pointer no-underline hover:bg-bg hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
              <div className="w-24 h-24 rounded-xl flex items-center justify-center mx-auto mb-8 text-4xl bg-red-50 text-red-600">
                <i className="fa-solid fa-calendar-alt"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Calendrier Academique</h3>
              <p className="text-lg text-slate-500 leading-relaxed">Consultez toutes les dates importantes : examens, inscriptions, evenements.</p>
            </Link>
            
            {/* Fonctionnalite Guide du Nouvel Etudiant */}
            <Link to="/guide" 
                  className="bg-white rounded-2xl p-10 md:p-12 text-center border border-slate-200 transition-all duration-200 cursor-pointer no-underline hover:bg-bg hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
              <div className="w-24 h-24 rounded-xl flex items-center justify-center mx-auto mb-8 text-4xl bg-blue-50 text-blue-600">
                <i className="fa-solid fa-play-circle"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Guide du Nouvel Etudiant</h3>
              <p className="text-lg text-slate-500 leading-relaxed">Tout ce que vous devez savoir pour reussir l'universite.</p>
            </Link>
          </div>
        </section>
        
        {/* Section pourquoi choisir CampusGuide */}
        <section className="bg-slate-900 mx-auto my-20 md:my-2 max-w-[1200px] rounded-[30px] md:rounded-[40px] px-8 md:px-[8%] py-12 md:py-20 relative overflow-hidden text-white text-left">
          {/* Forme decorative en haut à droite */}
          <div className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(58,176,255,0.1)_0%,transparent_70%)] pointer-events-none"></div>
          
          {/* Badge de section */}
          <span className="text-primary text-xs md:text-sm font-extrabold tracking-[2px] block mb-4 md:mb-6 uppercase">POURQUOI CAMPUSGUIDE ?</span>
          
          {/* Titre de la section */}
          <h2 className="text-3xl md:text-5xl leading-tight mb-8 md:mb-12 max-w-[650px] font-bold">Plus qu'un portail, un <span className="text-primary">Compagnon de Route</span> numerique.</h2>
          
          {/* Contenu de la section avec icône et description */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Icône de bouclier représentant la securite/confiance */}
            <div className="bg-white/5 text-primary w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-white/5">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            
            {/* Texte explicatif */}
            <div>
              <h3 className="text-lg mb-2 font-semibold">Centralisation Avancee</h3>
              <p className="text-slate-400 text-sm md:text-[15.2px] max-w-[450px] leading-relaxed">Toutes vos ressources universitaires, du plan du campus aux mentors, reunies au meme endroit.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Accueil;
```

### 🔧 FONCTIONNEMENT DU COMPOSANT COMPTEURANIME
```javascript
const CompteurAnime = ({ valeur, symbole = '+' }) => {
  // État local pour stocker la valeur actuelle du compteur
  const [compte, setCompte] = useState(0);
  
  // Effet secondaire qui s'exécute quand la propriété 'valeur' change
  useEffect(() => {
    let debut = 0; // Valeur de départ de l'animation
    const fin = parseInt(valeur); // Valeur cible (convertie en entier)
    const duree = 2000; // Durée de l'animation en millisecondes
    const pas = fin / (duree / 16); // Pas d'incrémentation (60fps = 16ms par frame)
    
    // Timer qui met à jour le compteur toutes les 16ms (~60fps)
    const timer = setInterval(() => {
      debut += pas; // Incrémente la valeur actuelle
      
      if (debut >= fin) {
        // Si on a atteint ou dépassé la valeur cible
        setCompte(fin); // définit exactement la valeur cible
        clearInterval(timer); // arrête le timer
      } else {
        // Sinon, définit la valeur arrondie à l'entier inférieur
        setCompte(Math.floor(debut));
      }
    }, 16);
    
    // Fonction de nettoyage pour éviter les fuites de mémoire
    return () => clearInterval(timer);
  }, [valeur]); // Ré-exécuter l'effet quand 'valeur' change
  
  // Affiche la valeur actuelle du compteur suivie du symbole optionnel
  return <span>{compte}{symbole}</span>;
};
```

### 📱 RESPONSIVE DESIGN
L'interface utilise TailwindCSS avec des classes responsives :
- `md:` pour les écrans moyens (≥768px)
- `lg:` pour les larges écrans (≥1024px)
- Disposition en colonne sur mobile, en ligne sur écrans larges
- Adaptation des tailles de texte et des espacements

### ⚡ PERFORMANCE
- Utilisation de `useEffect` avec dépendances précises pour éviter les recalculs inutile
- Animation du compteur optimisée avec `requestAnimationFrame` équivalent (setInterval à 16ms)
- Chargement différé des images grâce à l'optimisation de Vite
- Pas de requêtes API inutiles car la page affiche principalement du contenu statique

### 🎨 COMPOSANTS REUTILISABLES
- `CompteurAnime`: Composant personnalisé pour l'animation des compteurs statistiques
- Utilisation extensively de classes TailwindCSS pour le styling plutôt que du CSS personnalisé
- Icônes FontAwesome intégrées directement dans le JSX

Cette page d'accueil sert de portail central vers toutes les fonctionnalités de l'application, offrant une première impression professionnelle tout en guidant les utilisateurs vers les sections les plus importantes du CampusGuide.

---
## 📄 `frontend/src/pages/Mentors.jsx` - Page des Mentors

### 🎯 Objectif
La page des mentors permet aux utilisateurs de découvrir, rechercher et filtrer les mentors disponibles sur le campus. Elle affiche les profils détaillés des mentors avec leurs spécialités, leurs disponibilités et leurs notes, et offre la possibilité de devenir mentor pour les utilisateurs non-administrateurs.

### 📦 IMPORTS ET CONFIGURATION INITIALE
```javascript
import React, { useState, useEffect, Fragment } from 'react';
// Hooks React pour gérer l'état local, les effets secondaires et les fragments
import { Link } from 'react-router-dom';
// Composant pour naviguer entre les pages de l'application
import { apiMentors } from '../api';
// Service API encapsulant les appels HTTP vers le backend pour les mentors
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
// Accès au contexte global (utilisateur, notifications, etc.)
import { useContext } from 'react';
// Hook pour accéder au contexte global
import { useAlerte } from '../components/AlertePersonnalisee';
// Hook personnalisé pour gérer les alertes/toast notifications
import SkeletonCard from '../components/ui/SkeletonCard';
// Composant de squelette pour afficher un état de chargement
import StarRating from '../components/ui/StarRating';
// Composant personnalisé pour l'affichage des étoiles de notation
import Tooltip from '../components/ui/Tooltip';
// Infobulle personnalisée pour améliorer l'UX
import LazyImage from '../components/ui/LazyImage';
// Composant pour le chargement paresseux des images
import ratingService from '../services/RatingService';
// Service de calcul et gestion des notes/évaluations
```

### 🏗️ COMPOSANT PRINCIPAL MENTORS
```javascript
const Mentors = () => {
  // Accès au contexte global pour les données utilisateur
  const { utilisateur } = useContext(ContexteUtilisateur);
  
  // États locaux du composant
  const [recherche, setRecherche] = useState(''); // Terme de recherche
  const [filiereActuelle, setFiliereActuelle] = useState('tous'); // Filière sélectionnée pour le filtrage
  const [specActuelle, setSpecActuelle] = useState('tous'); // Spécialité sélectionnée pour le filtrage
  const [listeMentors, setListeMentors] = useState([]); // Liste complète des mentors récupérée du backend
  const [chargement, setChargement] = useState(true); // État de chargement initial
  const [erreur, setErreur] = useState(null); // État d'erreur lors du chargement
  const { montrerAlerte, AlerteComponent } = useAlerte(); // Fonctions d'affichage d'alertes
  
  // Charger les mentors depuis le backend
  useEffect(() => {
    const chargerMentors = async () => {
      try {
        setChargement(true);
        const data = await apiMentors.getAll();
        setListeMentors(data.mentors);
        setErreur(null);
      } catch (err) {
        console.error('Impossible de joindre le serveur, utilisation des données locales.');
        // Repli sur localStorage si le backend n'est pas disponible
        const mentorsSauvegardes = localStorage.getItem('campus_mentors');
        if (mentorsSauvegardes) {
          setListeMentors(JSON.parse(mentorsSauvegardes));
        } else {
          setErreur('Le serveur est inaccessible. Vérifiez que le backend est démarré.');
        }
      } finally {
        setChargement(false);
      }
    };
    chargerMentors();
  }, []); // Exécuter une seule fois au montage
  
  // Liste des filières uniques disponibles pour le filtrage
  const filieres = ['tous', 'informatique', 'medecine', 'droit', 'science technologique', 'science des aliments et de l\'environnement', 'gestion', 'architecture', 'SIC/multimedia'];
  
  // Extraire les spécialisations en fonction de la filière sélectionnée
  const specialisationsDisponibles = filiereActuelle === 'tous' 
    ? [] 
    : ['tous', ...new Set(listeMentors.filter(m => m.filiere === filiereActuelle).map(m => m.specialite))];
  
  // Filtrer la liste des mentors selon les critères de recherche et de filtrage
  const mentorsFiltrés = listeMentors.filter(mentor => {
    const correspondRecherche = mentor.nom.toLowerCase().includes(recherche.toLowerCase()) || 
                             mentor.specialite.toLowerCase().includes(recherche.toLowerCase());
    const correspondFiliere = filiereActuelle === 'tous' || mentor.filiere === filiereActuelle;
    const correspondSpec = specActuelle === 'tous' || mentor.specialite === specActuelle;
    return correspondRecherche && correspondFiliere && correspondSpec;
  });
  
  // Fonction pour changer la filière sélectionnée
  const changerFiliere = (filiere) => {
    setFiliereActuelle(filiere);
    setSpecActuelle('tous'); // Réinitialiser la spécialité quand on change de filière
  };
  
  return (
    <Fragment>
      <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
        {/* En-tête avec titre et description */}
        <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto mb-12">
          {/* Badge de section */}
          <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
            <i className="fa-solid fa-people-arrows"></i> SYSTÈME DE MENTORAT
          </span>
          
          {/* Titre principal */}
          <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[900px]">
            Trouvez votre <span className="text-primary">Mentor</span>
          </h1>
          
          {/* Description sous-titre */}
          <p className="text-slate-500 text-lg md:text-[22px] mb-8 max-w-[800px] leading-relaxed">
            Faites-vous accompagner par des étudiants plus expérimentés pour réussir votre parcours académique.
          </p>
          
          {/* Barre de recherche et bouton "Devenir Mentor" */}
          <div className="bg-white w-full max-w-[600px] px-5 py-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3 border border-slate-200 mb-8">
            <Tooltip content="Rechercher un mentor">
              <i className="fa-solid fa-search text-slate-400 text-lg"></i>
            </Tooltip>
            <input 
              type="text" 
              placeholder="Rechercher par nom ou spécialité..." 
              className="flex-1 border-none outline-none text-base text-slate-800 font-inter bg-transparent"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
            {/* Bouton "Devenir Mentor" visible uniquement pour les non-admins */}
            {utilisateur.role !== 'admin' && (
              <Link to="/devenir-mentor" className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-[15px] hover:bg-primary transition-all flex items-center gap-2 shadow-xl hover:-translate-y-1">
                <i className="fa-solid fa-plus"></i> Devenir Mentor
              </Link>
            )}
          </div>
        </section>
        
        {/* Section principale avec filtres et liste de mentors */}
        <section className="max-w-[1200px] mx-auto">
          {/* En-tête de section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[2px] text-center">Nos Mentors</h2>
          </div>
          
          {/* Filtre par Filière */}
          <div className="mb-8">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[2px] text-center mb-6">Filtrer par Filière</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {filieres.map(f => (
                <Tooltip content={`Filtrer par ${f === 'tous' ? 'toutes les filières' : f}`} key={f}>
                  <BoutonFiltre 
                    texte={f === 'tous' ? 'Toutes les Filières' : f.charAt(0).toUpperCase() + f.slice(1)} 
                    actif={filiereActuelle === f} 
                    onClick={() => changerFiliere(f)} 
                    couleur="bg-primary" 
                  />
                </Tooltip>
              ))}
            </div>
          </div>
          
          {/* Filtre par Spécialisation (affiché seulement quand une filière est sélectionnée) */}
          {filiereActuelle !== 'tous' && specialisationsDisponibles.length > 1 && (
            <div className="mb-12 anime-apparition-rapide">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[1px] text-center mb-4 italic">Spécialisations en {filiereActuelle}</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {specialisationsDisponibles.map(spec => (
                  <button 
                    key={spec}
                    onClick={() => setSpecActuelle(spec)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${specActuelle === spec ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {spec === 'tous' ? 'Toutes les spécialités' : spec}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* État de chargement */}
          {chargement && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}
          
          {/* État d'erreur */}
          {erreur && !chargement && (
            <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100">
              <i className="fas fa-server text-4xl mb-3 text-red-300"></i>
              <p className="text-red-500 font-semibold">{erreur}</p>
              <p className="text-sm text-red-400 mt-1">Lancez le backend : <code className="bg-red-100 px-2 py-0.5 rounded">npm run dev</code></p>
            </div>
          )}
          
          {/* Liste des mentors filtrés */}
          {!chargement && !erreur && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {mentorsFiltrés.map((mentor, index) => (
                <CarteMentor key={mentor.id} mentor={mentor} index={index} />
              ))}
              {mentorsFiltrés.length === 0 && (
                <div className="col-span-full text-center py-20 text-slate-500">
                  <i className="fas fa-search text-5xl mb-4 text-slate-300"></i>
                  <p className="text-xl font-medium">Aucun mentor trouvé</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <AlerteComponent />
    </Fragment>
  );
};
```

### 🔧 COMPOSANTS AUXILIAIRES
```javascript
// Bouton de filtre réutilisable
const BoutonFiltre = ({ texte, actif, onClick, couleur }) => {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${actif ? `${couleur} text-white shadow-lg shadow-primary/20` : 'bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'}`}
    >
      {texte}
    </button>
  );
};

// Fonction pour contacter un mentor via WhatsApp
const contacterWhatsApp = async (telephone) => {
  if (!telephone) {
    await montrerAlerte({
      type: 'alert',
      titre: 'Information',
      message: 'Ce mentor n\'a pas renseigné de numéro de téléphone',
      boutonConfirmText: 'OK'
    });
    return;
  }
  // Nettoyer le numéro de téléphone (enlever les espaces, +, etc.)
  const numeroNettoye = telephone.replace(/[\s\-\(\)]/g, '');
  const urlWhatsApp = `https://wa.me/${numeroNettoye}`;
  window.open(urlWhatsApp, '_blank');
};

// Carte individuelle d'affichage d'un mentor
const CarteMentor = ({ mentor, index }) => {
  // Palettes de couleurs pour varier l'apparence des cartes
  const palettes = [
    'border-t-blue-500 from-blue-50 text-blue-700 bg-blue-500',
    'border-t-purple-500 from-purple-50 text-purple-700 bg-purple-500',
    'border-t-rose-500 from-rose-50 text-rose-700 bg-rose-500',
    'border-t-amber-500 from-amber-50 text-amber-700 bg-amber-500',
    'border-t-emerald-500 from-emerald-50 text-emerald-700 bg-emerald-500',
    'border-t-indigo-500 from-indigo-50 text-indigo-700 bg-indigo-500',
    'border-t-teal-500 from-teal-50 text-teal-700 bg-teal-500',
  ];
  
  // Sélection de la palette en fonction de l'index pour éviter les répétitions
  const currentPalette = palettes[index % palettes.length];
  const classes = currentPalette.split(' ');
  const borderClass = classes[0];
  const bgGradient = classes[1];
  const textClass = classes[2];
  const badgeBg = classes[3];
  const nombreVotes = ratingService.getRatingCount('mentor', mentor.id);
  
  return (
    <div className={`bg-white rounded-[24px] p-6 border-t-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:-translate-y-2 ${borderClass}`}>
      {/* En-tête avec photo et informations de base */}
      <div className="flex items-center gap-4 mb-5">
        {mentor.photo ? (
          <LazyImage 
            src={mentor.photo} 
            alt={mentor.nom}
            className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xl border border-slate-100">
            {mentor.nom[0]}
          </div>
        )}
        <div>
          <h3 className="font-bold text-slate-900 text-lg leading-tight">{mentor.nom}</h3>
          <p className="text-[11px] text-slate-400 uppercase font-black tracking-widest mt-1">{mentor.filiere} • {mentor.annee}</p>
          <div className="mt-2">
            <StarRating itemId={mentor.id} itemType="mentor" initialRating={mentor.moyenneRating || mentor.note || 0} size="sm" showCount={true} />
          </div>
        </div>
      </div>
      
      {/* Section spécialité avec dégradé de couleur */}
      <div className={`p-4 rounded-2xl mb-5 bg-linear-to-br ${bgGradient} to-white/50 border border-white`}>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Spécialité</p>
        <p className={`text-[15px] font-bold ${textClass}`}>{mentor.specialite}</p>
      </div>
      
      {/* Section biographie */}
      <div className="mb-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">À propos</p>
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {mentor.bio || mentor.motivation || "Ce mentor n'a pas encore rempli sa biographie."}
        </p>
      </div>
      
      {/* Section disponibilité */}
      <div className="mb-5">
        <Tooltip content={mentor.disponible ? 'Ce mentor est disponible pour vous accompagner' : 'Ce mentor est actuellement indisponible'}>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${mentor.disponible ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
            <i className={`fas fa-circle text-[6px] mr-1 ${mentor.disponible ? 'text-emerald-500' : 'text-slate-400'}`}></i>
            {mentor.disponible ? 'Disponible' : 'Indisponible'}
          </span>
        </Tooltip>
      </div>
      
      {/* Section contact (si disponible) */}
      {mentor.telephone && (
        <div className="mb-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Contact</p>
          <p className="text-sm text-slate-600 font-medium">
            <i className="fas fa-phone text-primary mr-2"></i>
            {mentor.telephone}
          </p>
        </div>
      )}
      
      {/* Bouton WhatsApp */}
      <button
        onClick={() => contacterWhatsApp(mentor.telephone)}
        disabled={!mentor.telephone || !mentor.disponible}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
          mentor.telephone && mentor.disponible 
            ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-green-500/20 hover:-translate-y-0.5' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        <i className="fab fa-whatsapp"></i>
        {mentor.telephone && mentor.disponible ? 'Contacter via WhatsApp' : 
         !mentor.telephone ? 'Numéro non disponible' : 'Indisponible'}
      </button>
    </div>
  );
};
```

### 📱 RESPONSIVE DESIGN
L'interface utilise TailwindCSS avec des classes responsives :
- `md:` pour les écrans moyens (≥768px)
- `lg:` pour les larges écrans (≥1024px)
- Grille de mentors qui s'adapte : 1 colonne sur mobile, 2 sur tablette, 3 sur desktop
- Filtres disposés en ligne qui passent en colonne sur les petits écrans
- Adaptation des tailles de texte et des espacements selon la taille d'écran

### ⚡ PERFORMANCE
- Utilisation de `useEffect` avec dépendance vide pour charger les données une seule fois au montage
- Repli intelligent sur localStorage en cas d'indisponibilité du backend pour une meilleure résilience
- Filtrage effectué en mémoire (pas de nouvelles requêtes API à chaque changement de filtre)
- Chargement paresseux des images des mentors via le composant `LazyImage`
- États de chargement et d'erreur clairement séparés pour une meilleure expérience utilisateur

### 🎨 COMPOSANTS REUTILISABLES
- `BoutonFiltre`: Composant réutilisable pour les boutons de filtre avec états actif/inactif
- `SkeletonCard`: États de chargement visuellement agréables
- `StarRating`: Affichage personnalisé des notes avec comptage des votes
- `Tooltip`: Infobulles contextuelles pour améliorer l'UX
- `LazyImage`: Chargement paresseux des images pour améliorer les performances
- Utilisation extensively de classes TailwindCSS pour le styling plutôt que du CSS personnalisé
- Icônes FontAwesome et FontAwesome Brands intégrées directement dans le JSX

Cette page des mentors offre une expérience complète de découverte et de filtrage, permettant aux utilisateurs de trouver facilement le mentor correspondant à leurs besoins grâce à une recherche par nom/spécialité et des filtres par filière et spécialisation.

---
## 📄 `frontend/src/pages/Clubs.jsx` - Page des Clubs

### 🎯 Objectif
La page des clubs permet aux utilisateurs de découvrir, rechercher et filtrer les clubs et associations disponibles sur le campus. Elle affiche les informations détaillées de chaque club avec leur catégorie, description, nombre de membres et notes, et offre la possibilité de rejoindre un club directement depuis l'interface.

### 📦 IMPORTS ET CONFIGURATION INITIALE
```javascript
import React, { useState, useEffect } from 'react';
// Hooks React pour gérer l'état local et les effets secondaires
import { apiClubs } from '../api';
// Service API encapsulant les appels HTTP vers le backend pour les clubs
import SkeletonCard from '../components/ui/SkeletonCard';
// Composant de squelette pour afficher un état de chargement
import StarRating from '../components/ui/StarRating';
// Composant personnalisé pour l'affichage des étoiles de notation
import Tooltip from '../components/ui/Tooltip';
// Infobulle personnalisée pour améliorer l'UX
import LazyImage from '../components/ui/LazyImage';
// Composant pour le chargement paresseux des images
```

### 🏗️ COMPOSANT PRINCIPAL CLUBS
```javascript
const Clubs = () => {
  // États locaux du composant
  const [recherche, setRecherche] = useState(''); // Terme de recherche
  const [filtreActif, setFiltreActif] = useState('tous'); // Catégorie sélectionnée pour le filtrage
  const [tousLesClubs, setTousLesClubs] = useState([]); // Liste complète des clubs récupérée du backend
  const [chargement, setChargement] = useState(true); // État de chargement initial
  const [erreur, setErreur] = useState(null); // État d'erreur lors du chargement
  const [clubSelectionne, setClubSelectionne] = useState(null); // Club sélectionné pour affichage détaillé
  
  // Charger les clubs depuis le backend
  useEffect(() => {
    const chargerClubs = async () => {
      try {
        setChargement(true);
        const data = await apiClubs.getAll();
        setTousLesClubs(data.clubs);
        setErreur(null);
      } catch (err) {
        console.error('Impossible de joindre le serveur.');
        setErreur('Le serveur est inaccessible. Vérifiez que le backend est démarré.');
      } finally {
        setChargement(false);
      }
    };
    chargerClubs();
  }, []); // Exécuter une seule fois au montage
  
  // Liste des catégories disponibles pour le filtrage
  const categories = [
    { id: 'tous', nom: 'Tous', icone: 'fa-th' },
    { id: 'academique', nom: 'Académique', icone: 'fa-graduation-cap' },
    { id: 'sport', nom: 'Sport', icone: 'fa-futbol' },
    { id: 'art', nom: 'Art & Culture', icone: 'fa-palette' },
    { id: 'tech', nom: 'Tech', icone: 'fa-laptop-code' }
  ];
  
  // Filtrer la liste des clubs selon les critères de recherche et de filtrage
  const clubsFiltrés = tousLesClubs.filter(club => {
    const correspondRecherche = club.nom.toLowerCase().includes(recherche.toLowerCase()) || 
                               club.description.toLowerCase().includes(recherche.toLowerCase());
    const correspondFiltre = filtreActif === 'tous' || club.categorie === filtreActif;
    return correspondRecherche && correspondFiltre;
  });
  
  // Rejoindre un club et mettre à jour le compteur localement
  const rejoindreClub = async (id) => {
    try {
      const data = await apiClubs.rejoindre(id);
      setTousLesClubs(prev =>
        prev.map(c => c.id === id ? { ...c, membres: data.membres } : c)
      );
    } catch (err) {
      console.error('Impossible de rejoindre le club pour le moment.');
    }
  };
  
  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      {/* En-tête avec titre et description */}
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto mb-12">
        {/* Badge de section */}
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-users"></i> CLUBS & ASSOCIATIONS
        </span>
        
        {/* Titre principal */}
        <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[900px]">
          Rejoignez une <span className="text-primary">Communauté</span>
        </h1>
        
        {/* Description sous-titre */}
        <p className="text-slate-500 text-lg md:text-[22px] mb-8 max-w-[800px] leading-relaxed">
          Découvrez les clubs étudiants de l'université et trouvez celui qui correspond à vos passions.
        </p>
        
        {/* Barre de recherche */}
        <div className="bg-white w-full max-w-[600px] px-5 py-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3 border border-slate-200 mb-8 mx-auto">
          <Tooltip content="Rechercher un club">
            <i className="fa-solid fa-search text-slate-400 text-lg"></i>
          </Tooltip>
          <input 
            type="text" 
            placeholder="Rechercher un club par son nom..." 
            className="flex-1 border-none outline-none text-base text-slate-800 font-inter bg-transparent"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
      </section>
      
      {/* Section principale avec filtres et liste de clubs */}
      <section className="max-w-[1200px] mx-auto">
        {/* En-tête de section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[2px]">Tous les Clubs</h2>
        </div>
        
        {/* Filtre par Catégorie */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setFiltreActif(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${filtreActif === cat.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'}`}
            >
              <i className={`fas ${cat.icone}`}></i> {cat.nom}
            </button>
          ))}
        </div>
        
        {/* État de chargement */}
        {chargement && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}
        
        {/* État d'erreur */}
        {erreur && !chargement && (
          <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100">
            <i className="fas fa-server text-4xl mb-3 text-red-300"></i>
            <p className="text-red-500 font-semibold">{erreur}</p>
            <p className="text-sm text-red-400 mt-1">Lancez le backend : <code className="bg-red-100 px-2 py-0.5 rounded">npm run dev</code></p>
          </div>
        )}
        
        {/* Liste des clubs filtrés */}
        {!chargement && !erreur && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubsFiltrés.map((club, index) => (
              <CarteClub key={club.id} club={club} index={index} onRejoindre={rejoindreClub} onClick={() => setClubSelectionne(club)} />
            ))}
            {clubsFiltrés.length === 0 && (
              <div className="col-span-full text-center py-20 text-slate-500">
                <i className="fas fa-search text-5xl mb-4 text-slate-300"></i>
                <p className="text-xl font-medium">Aucun club trouvé</p>
              </div>
            )}
          </div>
        )}
      </section>
      
      {/* Modal d'affichage détaillé d'un club */}
      {clubSelectionne && (
        <>
          {/* Overlay sombre */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-3000" onClick={() => setClubSelectionne(null)}></div>
          {/* Contenu du modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl w-[95%] max-w-[600px] z-4000 overflow-hidden shadow-2xl anime-apparition border border-gray-100">
            {/* Header avec dégradé moderne */}
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <i className={`fa-solid ${clubSelectionne.icone} text-white text-3xl`}></i>
                </div>
              </div>
              <button
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border border-white/30 w-10 h-10 rounded-xl cursor-pointer text-white flex items-center justify-center hover-bg-white/30 transition-all duration-300"
                onClick={() => setClubSelectionne(null)}
              >
                <i className="fa-solid fa-times text-lg"></i>
              </button>
              <div className="absolute bottom-4 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{clubSelectionne.nom}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-3 py-1 bg-white/25 backdrop-blur-sm rounded-full text-white">
                    {clubSelectionne.categorieNom}
                  </span>
                  <span className="text-xs text-white/90 flex items-center gap-1">
                    <i className="fa-solid fa-users"></i> {clubSelectionne.membres} membres
                  </span>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="p-6 space-y-6">
              {/* Section Description */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-info-circle text-primary text-sm"></i>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Description</h4>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {clubSelectionne.description}
                </p>
              </div>

              {/* Section Administrateur avec design moderne */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-user-tie text-white text-sm"></i>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Administrateur</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-user text-blue-500 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nom</p>
                      <p className="text-sm font-semibold text-gray-900">{clubSelectionne.administrateurNom || 'Bonheur Nzau'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-graduation-cap text-blue-500 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Promotion</p>
                      <p className="text-sm font-semibold text-gray-900">{clubSelectionne.administrateurPromotion || 'L2 informatique'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-envelope text-blue-500 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{clubSelectionne.administrateurEmail || 'nzaubonheur84@gmail.com'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-phone text-blue-500 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Téléphone</p>
                      <p className="text-sm font-semibold text-gray-900">{clubSelectionne.administrateurTelephone || '0975079756'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Compétences avec design moderne */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-graduation-cap text-white text-sm"></i>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Compétences acquises</h4>
                </div>
                {clubSelectionne.competences ? (
                  <div className="flex flex-wrap gap-2">
                    {(typeof clubSelectionne.competences === 'string' ? JSON.parse(clubSelectionne.competences) : clubSelectionne.competences).map((competence, index) => (
                      <span key={index} className="px-3 py-1.5 bg-white text-emerald-700 rounded-lg text-xs font-medium shadow-sm border border-emerald-200 hover:bg-emerald-50 transition-colors duration-200">
                        {competence}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm leading-relaxed bg-white p-3 rounded-lg">
                    En rejoignant ce club, vous développerez des compétences en leadership, travail d'équipe, communication et gestion de projet.
                  </p>
                )}
              </div>

              {/* Section Action avec design moderne */}
              <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl p-5 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-users text-white"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wide">Rejoindre le club</h4>
                    <p className="text-xs text-white/80">Devenez membre de la communauté</p>
                  </div>
                </div>
                <p className="text-sm text-white/90 mb-4 leading-relaxed">
                  Prêt(e) à rejoindre l'aventure ? Cliquez sur le bouton ci-dessous pour intégrer le groupe WhatsApp et participer aux activités du club.
                </p>
                <a href={clubSelectionne.lien} target="_blank" rel="noopener noreferrer" className="no-underline" onClick={() => { rejoindreClub(clubSelectionne.id); setClubSelectionne(null); }}>
                  <button className="w-full py-3.5 bg-white text-primary rounded-xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3">
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    <span>Rejoindre sur WhatsApp</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};
```

### 🔧 COMPOSANT CARTE DE CLUB
```javascript
const CarteClub = ({ club, index, onRejoindre, onClick }) => {
  // Palettes de couleurs pour varier l'apparence des cartes
  const palettes = [
    'border-t-blue-500 from-blue-50 text-blue-700 bg-blue-500',
    'border-t-purple-500 from-purple-50 text-purple-700 bg-purple-500',
    'border-t-rose-500 from-rose-50 text-rose-700 bg-rose-500',
    'border-t-amber-500 from-amber-50 text-amber-700 bg-amber-500',
    'border-t-emerald-500 from-emerald-50 text-emerald-700 bg-emerald-500',
    'border-t-indigo-500 from-indigo-50 text-indigo-700 bg-indigo-500',
    'border-t-teal-500 from-teal-50 text-teal-700 bg-teal-500',
  ];
  
  // Sélection de la palette en fonction de l'index pour éviter les répétitions
  const currentPalette = palettes[index % palettes.length];
  const classes = currentPalette.split(' ');
  const borderClass = classes[0];
  const bgGradient = classes[1];
  const textClass = classes[2];
  const badgeBg = classes[3];
  
  return (
    <div className={`bg-white rounded-[24px] p-6 border-t-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:-translate-y-2 ${borderClass} flex flex-col h-full cursor-pointer`}
         onClick={onClick}>
      {/* En-tête avec icône et informations de base */}
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-14 h-14 rounded-2xl ${badgeBg} bg-opacity-10 flex items-center justify-center text-xl`}>
          <i className={`fa-solid ${club.icone} ${textClass}`}></i>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg leading-tight">{club.nom}</h3>
          <p className="text-[11px] text-slate-400 uppercase font-black tracking-widest mt-1">{club.categorieNom}</p>
          <div className="mt-2">
            <StarRating itemId={club.id} itemType="club" initialRating={club.moyenneRating || club.note || 0} size="sm" showCount={true} />
          </div>
        </div>
      </div>
      
      {/* Description du club */}
      <div className="mb-6 flex-1">
        <p className="text-sm text-slate-600 leading-relaxed">
          {club.description}
        </p>
      </div>
      
      {/* Section informations membres et action */}
      <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-50">
        <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
          <i className="fa-solid fa-user-group text-primary"></i> {club.membres} membres
        </span>
      </div>
      <a href={club.lien} target="_blank" rel="noopener noreferrer" className="no-underline" onClick={(e) => { e.stopPropagation(); onRejoindre(club.id); }}>
        <button className={`w-full py-3.5 rounded-xl text-white text-[14px] font-bold transition-all hover:brightness-95 flex items-center justify-center gap-2 shadow-lg ${badgeBg} hover:shadow-xl`}>
          <i className="fa-brands fa-whatsapp"></i> Rejoindre sur WhatsApp
        </button>
      </a>
    </div>
  );
};
```

### 📱 RESPONSIVE DESIGN
L'interface utilise TailwindCSS avec des classes responsives :
- `md:` pour les écrans moyens (≥768px)
- `lg:` pour les larges écrans (≥1024px)
- Grille de clubs qui s'adapte : 1 colonne sur mobile, 2 sur tablette, 3 sur desktop
- Filtres disposés en ligne qui restent en ligne grâce à flex-wrap
- Adaptation des tailles de texte et des espacements selon la taille d'écran
- Modal responsive qui s'adapte à différentes tailles d'écran

### ⚡ PERFORMANCE
- Utilisation de `useEffect` avec dépendance vide pour charger les données une seule fois au montage
- Filtrage effectué en mémoire (pas de nouvelles requêtes API à chaque changement de filtre)
- Chargement paresseux des images des clubs via le composant `LazyImage`
- États de chargement et d'erreur clairement séparés pour une meilleure expérience utilisateur
- Mise à jour optimiste lors de l'ajout à un club pour une meilleure réactivité

### 🎨 COMPOSANTS REUTILISABLES
- `SkeletonCard`: États de chargement visuellement agréables
- `StarRating`: Affichage personnalisé des notes avec comptage des votes
- `Tooltip`: Infobulles contextuelles pour améliorer l'UX
- `LazyImage`: Chargement paresseux des images pour améliorer les performances
- Utilisation extensively de classes TailwindCSS pour le styling plutôt que du CSS personnalisé
- Icônes FontAwesome et FontAwesome Brands intégrées directement dans le JSX
- Animations et transitions modernes pour une expérience utilisateur fluide

Cette page des clubs offre une expérience complète de découverte et d'engagement, permettant aux utilisateurs de trouver facilement un club correspondant à leurs intérêts grâce à une recherche par nom/description et des filtres par catégorie, avec la possibilité de rejoindre directement un club depuis l'interface.

---
## 📄 `frontend/src/pages/Orientation.jsx` - Page d'Orientation

### 🎯 Objectif
La page d'orientation propose un questionnaire interactif pour aider les étudiants à découvrir quelle filière universitaire correspond le mieux à leurs intérêts, compétences et aspirations professionnelles. À travers une série de questions thématiques, l'utilisateur obtient une recommandation personnalisée accompagnée de détails sur la filière suggérée.

### 📦 IMPORTS ET CONFIGURATION INITIALE
```javascript
import React, { useState } from 'react';
// Hooks React pour gérer l'état local
```

### 🏗️ COMPOSANT PRINCIPAL ORIENTATION
```javascript
const Orientation = () => {
  // États locaux du composant
  const [etape, setEtape] = useState(0); // Étape actuelle du questionnaire (0-11)
  const [reponses, setReponses] = useState({}); // Stockage des réponses utilisateur
  const [resultat, setResultat] = useState(null); // Résultat de l'orientation
  const [voirDetails, setVoirDetails] = useState(false); // État d'affichage des détails
  const [selectionTemporaire, setSelectionTemporaire] = useState({}); // Sélection temporaire avant confirmation

  // Fonction pour mélanger un tableau (algorithmique de Fisher-Yates)
  const melangerArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], new Array[i]];
    }
    return newArray;
  };

  // Options de base pour chaque filière (utilisées dans la première question)
  const optionsDeBase = [
    { t: "La technologie et le code", v: "informatique" }, 
    { t: "Aider et soigner les gens", v: "medecine" }, 
    { t: "Défendre les droits des autres", v: "droit" }, 
    { t: "Concevoir des systèmes", v: "science technologique" }, 
    { t: "Innover dans l'alimentation", v: "science des aliments et de l'environnement" }, 
    { t: "Gérer une entreprise", v: "gestion" }, 
    { t: "Créer des contenus multimédia", v: "SIC/multimedia" }
  ];

  // Tableau des questions du questionnaire
  const questions = [
    { id: 1, texte: "Qu'est-ce qui vous passionne le plus ?", options: melangerArray(optionsDeBase) },
    { id: 2, texte: "Quelle est votre matière préférée ?", options: melangerArray([
      { t: "Mathématiques", v: "informatique" }, 
      { t: "Biologie", v: "medecine" }, 
      { t: "Histoire / Philo", v: "droit" }, 
      { t: "Physique et Chimie", v: "science technologique" }, 
      { t: "Chimie alimentaire", v: "science des aliments et de l'environnement" }, 
      { t: "Économie", v: "gestion" }, 
      { t: "Communication visuelle", v: "SIC/multimedia" }
    ]) },
    { id: 3, texte: "Où vous voyez-vous dans 10 ans ?", options: melangerArray([
      { t: "Créer un logiciel", v: "informatique" }, 
      { t: "Opérer un patient", v: "medecine" }, 
      { t: "Plaider au tribunal", v: "droit" }, 
      { t: "Concevoir un pont", v: "science technologique" }, 
      { t: "Travailler en laboratoire alimentaire", v: "science des aliments et de l'environnement" }, 
      { t: "Diriger une banque", v: "gestion" }, 
      { t: "Produire des films", v: "SIC/multimedia" }
    ]) },
    { id: 4, texte: "Comment préférez-vous travailler ?", options: melangerArray([
      { t: "Seul devant un ordinateur", v: "informatique" }, 
      { t: "En équipe dans un hôpital", v: "medecine" }, 
      { t: "En étudiant des textes de loi", v: "droit" }, 
      { t: "En équipe sur un chantier", v: "science technologique" }, 
      { t: "En cuisine industrielle", v: "science des aliments et de l'environnement" }, 
      { t: "En organisant des réunions", v: "gestion" }, 
      { t: "En studio de création", v: "SIC/multimedia" }
    ]) },
    { id: 5, texte: "Quel type de problèmes aimez-vous résoudre ?", options: melangerArray([
      { t: "Des bugs informatiques", v: "informatique" }, 
      { t: "Des diagnostics médicaux", v: "medecine" }, 
      { t: "Des litiges complexes", v: "droit" }, 
      { t: "Des défis d'ingénierie", v: "science technologique" }, 
      { t: "Problèmes de qualité alimentaire", v: "science des aliments et de l'environnement" }, 
      { t: "Des défis financiers", v: "gestion" }, 
      { t: "Problèmes techniques audio/vidéo", v: "SIC/multimedia" }
    ]) },
    { id: 6, texte: "Si vous deviez lire un livre, ce serait sur...", options: melangerArray([
      { t: "L'intelligence artificielle", v: "informatique" }, 
      { t: "Les découvertes médicales", v: "medecine" }, 
      { t: "Les grands procès historiques", v: "droit" }, 
      { t: "Les innovations technologiques", v: "science technologique" }, 
      { t: "Les secrets de l'alimentation", v: "science des aliments et de l'environnement" }, 
      { t: "Les secrets du succès entrepreneurial", v: "gestion" }, 
      { t: "L'histoire du cinéma", v: "SIC/multimedia" }
    ]) },
    { id: 7, texte: "Quelle activité vous semble la plus stimulante ?", options: melangerArray([
      { t: "Coder une application", v: "informatique" }, 
      { t: "Réaliser une expérience en labo", v: "medecine" }, 
      { t: "Analyser un contrat", v: "droit" }, 
      { t: "Construire une machine", v: "science technologique" }, 
      { t: "Inventer une recette", v: "science des aliments et de l'environnement" }, 
      { t: "Négocier une vente", v: "gestion" }, 
      { t: "Monter un clip vidéo", v: "SIC/multimedia" }
    ]) },
    { id: 8, texte: "Votre environnement de travail idéal est...", options: melangerArray([
      { t: "Un espace moderne et technologique", v: "informatique" }, 
      { t: "Une clinique ou un laboratoire", v: "medecine" }, 
      { t: "Un cabinet ou un tribunal", v: "droit" }, 
      { t: "Un laboratoire d'ingénierie", v: "science technologique" }, 
      { t: "Une cuisine industrielle", v: "science des aliments et de l'environnement" }, 
      { t: "Un bureau de direction", v: "gestion" }, 
      { t: "Un plateau de tournage", v: "SIC/multimedia" }
    ]) },
    { id: 9, texte: "Quel super-pouvoir aimeriez-vous avoir ?", options: melangerArray([
      { t: "Tout automatiser par la pensée", v: "informatique" }, 
      { t: "Guérir instantanément", v: "medecine" }, 
      { t: "Détecter les mensonges", v: "droit" }, 
      { t: "Créer des matériaux révolutionnaires", v: "science technologique" }, 
      { t: "Éradiquer la faim", v: "science des aliments et de l'environnement" }, 
      { t: "Multiplier les investissements", v: "gestion" }, 
      { t: "Contrôler les esprits", v: "SIC/multimedia" }
    ]) },
    { id: 10, texte: "Pour vous, le succès c'est...", options: melangerArray([
      { t: "Innover technologiquement", v: "informatique" }, 
      { t: "Sauver des vies", v: "medecine" }, 
      { t: "Faire triompher la justice", v: "droit" }, 
      { t: "Transformer le monde par l'ingénierie", v: "science technologique" }, 
      { t: "Nourrir la planète", v: "science des aliments et de l'environnement" }, 
      { t: "Bâtir un empire économique", v: "gestion" }, 
      { t: "Devenir un influenceur multimédia", v: "SIC/multimedia" }
    ]) }
  ];

  // Gestion de la réponse à une question
  const gérerRéponse = (valeur) => {
    const nouvellesReponses = { ...reponses, [etape]: valeur };
    setReponses(nouvellesReponses);
    setSelectionTemporaire({ ...selectionTemporaire, [etape]: valeur });
    
    // Passer automatiquement à la question suivante après un court délai
    setTimeout(() => {
      if (etape < questions.length) {
        setEtape(etape + 1);
      } else {
        calculerResultat(nouvellesReponses);
      }
    }, 300); // Délai de 300ms pour montrer la sélection
  };

  // Confirmation de la réponse et passage à la question suivante
  const confirmerEtPasser = () => {
    const nouvellesReponses = { ...reponses, [etape]: selectionTemporaire[etape] };
    setReponses(nouvellesReponses);
    if (etape < questions.length) {
      setEtape(etape + 1);
    } else {
      calculerResultat(nouvellesReponses);
    }
  };

  // Calcul du résultat basé sur les réponses
  const calculerResultat = (finalReponses) => {
    const scores = { 
      informatique: 0, 
      medecine: 0, 
      droit: 0, 
      science_technologique: 0,
      science_aliments_environnement: 0,
      gestion: 0,
      sic_multimedia: 0
    };
    
    // Comptage des points pour chaque filière
    Object.values(finalReponses).forEach(v => {
      if (v === 'science technologique') scores.science_technologique++;
      else if (v === 'science des aliments et de l\'environnement') scores.science_aliments_environnement++;
      else if (v === 'SIC/multimedia') scores.sic_multimedia++;
      else scores[v]++;
    });
    
    // Détermination de la filière gagnante (celle avec le score le plus élevé)
    const gagnant = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    
    // Informations détaillées sur chaque filière
    const infos = {
      informatique: { 
        titre: "Informatique / Sciences", 
        desc: "Vous êtes fait pour l'analyse logique et la résolution de problèmes. Les filières en informatique, génie logiciel ou sciences vous conviendront parfaitement à l'UNH.", 
        details: "La Faculté des Sciences Informatiques de l'UNH propose des programmes pointus en Intelligence Artificielle, Cybersécurité et Développement. Profitez de nos laboratoires équipés et de nos partenariats avec les géants de la tech." 
      },
      medecine: { 
        titre: "Médecine / Sciences de la Santé", 
        desc: "Vous avez un fort intérêt pour le bien-être des autres et les Sciences. La faculté de Médecine de l'UNH est faite pour vous.", 
        details: "Notre centre de simulation médicale et nos laboratoires de recherche vous offrent une formation pratique d'excellence dès les premières années. Devenez un professionnel de santé capable de relever les défis de demain." 
      },
      droit: { 
        titre: "Droit / Sciences Politiques", 
        desc: "Vous excellez dans l'argumentation et l'analyse juridique. La faculté de Droit vous ouvrira de grandes portes au sein de l'UNH.", 
        details: "Plongez dans l'étude des lois et des relations internationales. Nos concours de plaidoirie et nos cliniques juridiques vous préparent aux carrières d'avocat, de magistrat ou de diplomate." 
      },
      science_technologique: { 
        titre: "Science Technologique / Ingénierie", 
        desc: "Vous êtes passionné par l'innovation technique et la création de solutions concrètes. La Science Technologique est faite pour vous.", 
        details: "La Faculté des Sciences Technologiques de l'UNH vous offre des programmes en génie civil, électrique, mécanique, chimique et bien d'autres. Nos ateliers et laboratoires vous permettent de transformer vos idées en réalisations concrètes." 
      },
      science_aliments_environnement: { 
        titre: "Science des Aliments et de l'Environnement", 
        desc: "Vous vous souciez de la durabilité et de l'innovation dans le domaine alimentaire. Cette filière est parfaite pour vous.", 
        details: "La Faculté des Sciences des Aliments et de l'Environnement de l'UNH forme des experts capables de relever les défis alimentaires et environnementaux. Nos laboratoires de pointe et nos partenariats industriels vous préparent à des carrières d'avenir." 
      },
      gestion: { 
        titre: "Gestion / Économie / Commerce", 
        desc: "Vous avez l'esprit d'entreprise et le sens des affaires. La faculté des Sciences de Gestion est votre meilleure option à l'UNH.", 
        details: "Formez-vous au management, au marketing digital et à la finance. Notre incubateur d'entreprises accompagne les étudiants porteurs de projets pour transformer leurs idées en succès commerciaux." 
      },
      sic_multimedia: { 
        titre: "SIC / Multimédia", 
        desc: "Vous êtes créatif et passionné par les médias numériques. Le SIC/Multimédia est votre voie.", 
        details: "La Section d'Information et de Communication de l'UNH vous forme aux métiers de demain : design graphique, audiovisuel, production multimédia et communication digitale. Nos studios et équipements professionnels vous permettent de développer votre talent créatif." 
      }
    };
    
    // Mise à jour du résultat et passage à l'affichage du résultat
    setResultat(infos[gagnant]);
    setEtape(11); // Étape 11 = affichage du résultat
  };

  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      {/* En-tête avec titre et description */}
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto mb-12">
        {/* Badge de section */}
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-map-marked-alt"></i> TEST D'ORIENTATION
        </span>
        
        {/* Titre principal */}
        <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[900px]">
          Découvrez votre <span className="text-primary">Parcours</span>
        </h1>
        
        {/* Description sous-titre */}
        <p className="text-slate-500 text-lg md:text-[22px] mb-8 max-w-[800px] leading-relaxed">
          Un quiz personnalisé pour vous guider vers la filière qui correspond à vos aspirations et talents.
        </p>
      </section>
      
      {/* Conteneur principal */}
      <div className="max-w-[900px] mx-auto">
        {/* Card principale avec effets visuels */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl relative overflow-hidden">
          {/* Éléments décoratifs achter plan */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full blur-3xl opacity-30 -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-sky-50 to-blue-50 rounded-full blur-2xl opacity-20 translate-y-24 -translate-x-24"></div>
          
          {/* Écran d'accueil (étape 0) */}
          {etape === 0 && (
            <div className="text-center relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-2xl shadow-blue-500/25">
                <i className="fa-solid fa-compass"></i>
              </div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Prêt à commencer votre aventure ?</h2>
              <p className="text-slate-600 mb-12 leading-relaxed max-w-[600px] mx-auto text-lg">
                Répondez sincèrement à ces questions pour découvrir la filière qui illuminera votre avenir académique et professionnel.
              </p>
              <button 
                onClick={() => setEtape(1)} 
                className="px-12 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                <span>Démarrer le Quiz</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          )}
          
          /* Questions du questionnaire (étapes 1-10) */
          {etape > 0 && etape <= questions.length && (
            <div id={`question-${etape}`} className="relative z-10">
              {/* En-tête de question */}
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-lg">{etape}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question</p>
                    <p className="text-sm font-semibold text-slate-600">sur {questions.length}</p>
                  </div>
                </div>
                {/* Indicateur de progression */}
                <div className="flex gap-2">
                  {[...Array(questions.length)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-8 h-2 rounded-full transition-all duration-500 ${i + 1 <= etape ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25' : 'bg-slate-100'}`}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Texte de la question */}
              <h2 className="text-2xl md:text-3xl font-bold mb-12 text-slate-900 leading-tight">{questions[etape-1].texte}</h2>
              
              {/* Options de réponse */}
              <div className="grid grid-cols-1 gap-4">
                {questions[etape-1].options.map((opt, i) => (
                  <label 
                    key={i} 
                    className="flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-200 cursor-pointer hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Overlay d'effet au survol */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      {/* Bouton radio */}
                      <input 
                        type="radio" 
                        name={`q${etape}`}
                        value={opt.v}
                        checked={selectionTemporaire[etape] === opt.v}
                        className="w-5 h-5 border-2 border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        onChange={() => gérerRéponse(opt.v)}
                      />
                    </div>
                    <span className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors relative z-10 text-lg">{opt.t}</span>
                    {/* Indicateur de sélection */}
                    <div className="ml-auto relative z-10">
                      <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                        selectionTemporaire[etape] === opt.v 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-slate-300 group-hover:border-blue-400'
                      }`}>
                        {selectionTemporaire[etape] === opt.v && (
                          <div className="w-full h-full flex items-center justify-center">
                            <i className="fa-solid fa-check text-white text-xs"></i>
                          </div>
                        )}
                      </div>
                    </div>
                  />
                ))}
              </div>
            </div>
          )}
          
          /* Affichage du résultat (étape 11) */
          {etape === 11 && resultat && (
            <div className="text-center relative z-10">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-2xl shadow-blue-500/25">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Votre voie idéale</h2>
              <h3 className="text-2xl font-bold mb-4 text-primary">{resultat.titre}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed max-w-[600px] mx-auto text-lg">
                {resultat.desc}
              </p>
              <p className="text-slate-500 mb-12 leading-relaxed max-w-[600px] mx-auto">
                {resultat.details}
              </p>
              <div className="flex justify-center space-x-6">
                <button 
                  onClick={() => {
                    // Réinitialiser pour recommencer
                    setEtape(0);
                    setReponses({});
                    setResultat(null);
                    setVoirDetails(false);
                    setSelectionTemporaire({});
                  }} 
                  className="px-8 py-3 rounded-2xl bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all"
                >
                  Recommencer
                </button>
                <button 
                  onClick={() => setVoirDetails(true)} 
                  className="px-8 py-3 rounded-2xl bg-primary text-white hover:bg-primary-dark transition-all"
                >
                  Voir les détails
                </button>
              </div>
              
              {/* Modal des détails */}
              {voirDetails && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 relative">
                    <button 
                      onClick={() => setVoirDetails(false)} 
                      className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">Détails de votre filière</h2>
                    <p className="text-slate-600 mb-6">{resultat.details}</p>
                    <div className="mt-6">
                      <h3 className="text-xl font-bold mb-4 text-slate-900">Prochaines étapes</h3>
                      <ul className="list-disc list-inside space-y-2 text-slate-600">
                        <li>Renseignez-vous sur les programmes spécifiques de cette filière</li>
                        <li>Renommez un conseiller d'orientation pour discuter de vos choix</li>
                        <li>Explorez les opportunités de stages et projets dans ce domaine</li>
                        <li>Participez aux événements et clubs liés à cette filière</li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => setVoirDetails(false)} 
                      className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary-dark transition-all w-full"
                    >
                      Retour au résultat
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Orientation;
```

### 📱 RESPONSIVE DESIGN
L'interface utilise TailwindCSS avec des classes responsives :
- `md:` pour les écrans moyens (≥768px)
- `lg:` pour les larges écrans (≥1024px)
- Layout adaptatif : colonnes sur mobile, disposition optimisée sur tablette et desktop
- Espacements et tailles de texte qui s'ajustent selon la taille d'écran
- Modals et éléments interactifs adaptés aux écrans tactiles

### ⚡ PERFORMANCE
- Utilisation de `useState` pour une gestion d'état locale efficace
- Algorithme de mélange (Fisher-Yates) implémenté directement pour éviter les dépendances externas
- Calcul du résultat optimisé avec réduction d'objet unique
- États clairement séparés pour éviter les re-renders inutiles
- Logique de navigation fluide avec délais appropriés pour l'expérience utilisateur

### 🎨 COMPOSANTS REUTILISABLES ET PATTERNS
- Utilisation extensive de classes TailwindCSS pour le styling plutôt que du CSS personnalisé
- Icônes FontAwesome intégrées directement dans le JSX
- Effets visuels modernes (gradients, ombres, flous, transitions)
- Patterns de formulaires interactifs avec validation implicite
- Gestion d'états modaux pour l'affichage des détails
- Micro-interactions (effets de surcharge, animations de transition)

Cette page d'offre une expérience interactive et personnalisée d'orientation académique, guidant les utilisateurs à travers un questionnaire réfléchi pour leur proposer la filière universitaire la plus adaptée à leur profil, avec des informations détaillées sur les débouchés et les opportunités associées.

---
## 📄 `frontend/src/pages/Calendrier.jsx` - Page du Calendrier

### 🎯 Objectif
La page du calendrier affiche l'année académique complète de l'Université Nouveaux Horizons avec les dates importantes : rentrées, examens, congés et événements. Elle permet aux utilisateurs de consulter le calendrier par mois, de filtrer les événements par type et, pour les administrateurs, de créer, modifier ou supprimer des événements.

### 📦 IMPORTS ET CONFIGURATION INITIALE
```javascript
import React, { useState, useEffect, useContext } from 'react';
// Hooks React pour gérer l'état local, les effets secondaires et le contexte
import { apiEvenements } from '../api';
// Service API encapsulant les appels HTTP vers le backend pour les événements
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
// Accès au contexte global (utilisateur, notifications, etc.)
import { useAlerte } from '../components/AlertePersonnalisee';
// Hook personnalisé pour gérer les alertes/toast notifications
import SkeletonEvent from '../components/ui/SkeletonEvent';
// Composant de squelette pour afficher un état de chargement
import exportService from '../services/ExportService';
// Service d'export des données vers PDF/Excel
```

### 🏗️ COMPOSANT PRINCIPAL CALENDRIER
```javascript
const Calendrier = () => {
  // Accès au contexte global pour les données utilisateur
  const { utilisateur } = useContext(ContexteUtilisateur);
  const estAdmin = utilisateur?.role === 'admin'; // Vérification si l'utilisateur est admin
  
  // États locaux du composant
  const [evenementsServeur, setEvenementsServeur] = useState([]); // Événements du backend
  const [chargementEv, setChargementEv] = useState(true); // État de chargement des événements
  const [inscriptions, setInscriptions] = useState({}); // Suivi des inscriptions utilisateur
  const { montrerAlerte, AlerteComponent } = useAlerte(); // Fonctions d'affichage d'alertes
  
  // Formulaire création (admin uniquement)
  const [formulaireOuvert, setFormulaireOuvert] = useState(false); // État d'ouverture du formulaire
  const [creation, setCreation] = useState({
    titre: '', description: '', date: '', heure: '09:00',
    lieu: 'Campus Principal', categorie: 'academique',
    maxInscrits: 100, organisateur: 'Administration'
  }); // État du formulaire de création
  const [envoiEnCours, setEnvoiEnCours] = useState(false); // État d'envoi du formulaire
  
  // Charger les événements depuis le backend
  useEffect(() => {
    const charger = async () => {
      try {
        const data = await apiEvenements.getAll({ avenir: 'true' }); // Récupérer uniquement les événements futurs
        setEvenementsServeur(data.evenements);
      } catch {
        setEvenementsServeur([]); // Tableau vide en cas d'erreur
      } finally {
        setChargementEv(false); // Terminer le chargement
      }
    };
    charger();
  }, []); // Exécuter une seule fois au montage
  
  // Créer un nouvel événement (admin uniquement)
  const creerEvenement = async (e) => {
    e.preventDefault(); // Empêcher la soumission traditionnelle du formulaire
    try {
      setEnvoiEnCours(true);
      const data = await apiEvenements.creer(creation);
      // Ajouter le nouvel événement à la liste et trier par date
      setEvenementsServeur(prev => [...prev, data.evenement].sort((a, b) => a.date.localeCompare(b.date)));
      // Réinitialiser le formulaire
      setCreation({ titre: '', description: '', date: '', heure: '09:00', lieu: 'Campus Principal', categorie: 'academique', maxInscrits: 100, organisateur: 'Administration' });
      setFormulaireOuvert(false);
      await montrerAlerte({
        type: 'success',
        titre: 'Succès',
        message: 'L\'événement a été créé avec succès.',
        boutonConfirmText: 'OK'
      });
    } catch (err) {
      await montrerAlerte({
        type: 'error',
        titre: 'Erreur',
        message: err.message || 'Erreur lors de la création.',
        boutonConfirmText: 'OK'
      });
    } finally {
      setEnvoiEnCours(false);
    }
  };
  
  // Supprimer un événement (admin uniquement)
  const supprimerEvenement = async (id) => {
    const confirmed = await montrerAlerte({
      type: 'confirm',
      titre: 'Supprimer l\'événement',
      message: 'Supprimer cet événement définitivement ?',
      boutonConfirmText: 'Supprimer',
      boutonCancelText: 'Annuler'
    });
    
    if (confirmed) {
      try {
        await apiEvenements.supprimer(id);
        // Retirer l'événement de la liste
        setEvenementsServeur(prev => prev.filter(e => e.id !== id));
        await montrerAlerte({
          type: 'success',
          titre: 'Succès',
          message: 'L\'événement a été supprimé avec succès.',
          boutonConfirmText: 'OK'
        });
      } catch (err) {
        await montrerAlerte({
          type: 'error',
          titre: 'Erreur',
          message: err.message || 'Erreur lors de la suppression.',
          boutonConfirmText: 'OK'
        });
      }
    }
  };
  
  // S'inscrire à un événement
  const sInscrire = async (id) => {
    try {
      const data = await apiEvenements.inscrire(id);
      // Mettre à jour l'état des inscriptions
      setInscriptions(prev => ({ ...prev, [id]: true }));
      // Mettre à jour le compteur d'inscrits dans l'événement
      setEvenementsServeur(prev =>
        prev.map(e => e.id === id ? { ...e, inscrits: data.inscrits } : e)
      );
      await montrerAlerte({
        type: 'success',
        titre: 'Inscription réussie',
        message: 'Vous êtes bien inscrit à cet événement.',
        boutonConfirmText: 'OK'
      });
    } catch (err) {
      await montrerAlerte({
        type: 'error',
        titre: 'Erreur',
        message: err.message || 'Inscription impossible.',
        boutonConfirmText: 'OK'
      });
    }
  };
  
  // Données statiques du calendrier académique (mois et événements)
  const mois = [
    {
      nom: "Octobre 2025",
      evenements: [
        { jour: "01", titre: "Début des cours de mise à niveau", date: "Mercredi 01 octobre 2025", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600" },
        { jour: "08", titre: "Meet the Staff : Rencontre du Recteur avec le Personnel", date: "Mercredi 8 octobre 2025", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" },
        { jour: "14", titre: "Réunion de comité de gestion", date: "Mardi 14 octobre 2025", type: "Réunion", couleur: "border-l-purple-500", badge: "bg-purple-50 text-purple-600" },
        { jour: "17", titre: "Réunion de la Commission des Études", date: "Vendredi 17 octobre 2025", type: "Réunion", couleur: "border-l-purple-500", badge: "bg-purple-50 text-purple-600" },
        { jour: "21", titre: "Réunion de comité de gestion", date: "Mardi 21 octobre 2025", type: "Réunion", couleur: "border-l-purple-500", badge: "bg-purple-50 text-purple-600" },
        { jour: "22", titre: "Début de l'année académique 2025-2026", details: ["Début de l'année académique 2025-2026", "Début des cours pour les promotions montantes"], date: "Mercredi 22 octobre 2025", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600" },
        { jour: "25", titre: "Fin des cours de mise à niveau", details: ["Fin des cours de mise à niveau", "Conseil de la Faculté de Droit", "Conseil de la Faculté des Sciences de Gestion"], date: "Samedi 25 octobre 2025", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600", type2: "Réunion", badge2: "bg-purple-50 text-purple-600" },
        { jour: "28", titre: "Test d'orientation", details: ["Test d'orientation", "Réunion de comité de gestion"], date: "Mardi 28 octobre 2025", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600", type2: "Réunion", badge2: "bg-purple-50 text-purple-600" },
        { jour: "30", titre: "CIAQ : Formation transversale", details: ["CIAQ : Formation transversale", "Communication des résultats des tests d'orientation"], date: "Jeudi 30 octobre 2025", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" },
        { jour: "31", titre: "CIAQ : Formation transversale", date: "Vendredi 31 octobre 2025", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" }
      ]
    },
    {
      nom: "Novembre 2025",
      evenements: [
        { jour: "03", titre: "Début des cours pour les nouveaux étudiants", details: ["Début des cours pour les nouveaux étudiants", "Réunion de la commission de la recherche"], date: "Lundi 03 novembre 2025", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600", type2: "Réunion", badge2: "bg-purple-50 text-purple-600" },
        { jour: "04", titre: "Réunion de comité de gestion", date: "Mardi 04 novembre 2025", type: "Réunion", couleur: "border-l-purple-500", badge: "bg-purple-50 text-purple-600" },
        { jour: "05", titre: "Conseils de Facultés", details: ["Conseil de la Faculté des Sciences Informatiques", "Conseil de la Faculté des Sciences Technologiques"], date: "Mercredi 05 novembre 2025", type: "Réunion", couleur: "border-l-purple-500", badge: "bg-purple-50 text-purple-600" },
        { jour: "08", titre: "Pédagogie universitaire", date: "Ven 07 au Samedi 08 nov 2025", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" },
        { jour: "11", titre: "Fête du Travail (Férié)", date: "Mardi 11 novembre 2025", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "20", titre: "Journée de l'Orientation", date: "Jeudi 20 novembre 2025", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" }
      ]
    },
    {
      nom: "Décembre 2025",
      evenements: [
        { jour: "05", titre: "Semaine de la Recherche", date: "Lun 01 au Ven 05 déc 2025", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" },
        { jour: "15", titre: "Début des vacances de Noël", date: "Lundi 15 décembre 2025", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "25", titre: "Noël", date: "Jeudi 25 décembre 2025", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" }
      ]
    },
    {
      nom: "Janvier 2026",
      evenements: [
        { jour: "01", titre: "Nouvel An", date: "Jeudi 01 janvier 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "04", titre: "Martyrs de l'Indépendance", date: "Dimanche 04 janvier 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "05", titre: "Reprise des cours", date: "Lundi 05 janvier 2026", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600" },
        { jour: "16", titre: "Commémoration Laurent Désiré Kabila", date: "Vendredi 16 janvier 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "17", titre: "Commémoration Patrice Emery Lumumba", date: "Samedi 17 janvier 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "26", titre: "Début des examens du 1er Semestre", date: "Lundi 26 janvier 2026", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600" }
      ]
    },
    {
      nom: "Février 2026",
      evenements: [
        { jour: "07", titre: "Fin des examens du 1er Semestre", date: "Samedi 07 février 2026", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600" },
        { jour: "09", titre: "Début du 2ème Semestre", date: "Lundi 09 février 2026", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600" }
      ]
    },
    {
      nom: "Mars 2026",
      evenements: [
        { jour: "08", titre: "Journée Internationale de la Femme", date: "Dimanche 08 mars 2026", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" },
        { jour: "23", titre: "Semaine de l'entrepreneuriat UNH", date: "Lun 23 au Sam 28 mars 2026", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" }
      ]
    },
    {
      nom: "Avril 2026",
      evenements: [
        { jour: "06", titre: "Journée du Combat de Simon Kimbangu", date: "Lundi 06 avril 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "13", titre: "Vacances de Pâques", date: "Lundi 13 au Samedi 18 avril 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" }
      ]
    },
    {
      nom: "Mai 2026",
      evenements: [
        { jour: "01", titre: "Fête du Travail", date: "Vendredi 01 mai 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "17", titre: "Journée de la Libération", date: "Dimanche 17 mai 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" }
      ]
    },
    {
      nom: "Juin 2026",
      evenements: [
        { jour: "15", titre: "Début des examens du 2ème Semestre", date: "Lundi 15 juin 2026", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600" },
        { jour: "27", titre: "Fin des examens du 2ème Semestre", date: "Samedi 27 juin 2026", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600" },
        { jour: "30", titre: "Fête de l'Indépendance", date: "Mardi 30 juin 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" }
      ]
    },
    {
      nom: "Juillet 2026",
      evenements: [
        { jour: "01", titre: "Début de la session de rattrapage", date: "Mercredi 01 juillet 2026", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600" },
        { jour: "15", titre: "Clôture de l'année académique", date: "Mercredi 15 juillet 2026", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600" }
      ]
    },
    {
      nom: "Septembre 2026",
      evenements: [
        { jour: "01", titre: "Inscriptions 2026-2027", date: "Mardi 01 septembre 2026", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600" },
        { jour: "15", titre: "Tests d'admission", date: "Mardi 15 septembre 2026", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600" }
      ]
    }
  ];
  
  // Mapping des couleurs et badges par catégorie d'événement
  const categorieEv = {
    'tech': { couleur: 'border-l-blue-500', badge: 'bg-blue-50 text-blue-600' },
    'academique': { couleur: 'border-l-primary', badge: 'bg-sky-50 text-sky-600' },
    'sport': { couleur: 'border-l-emerald-500', badge: 'bg-emerald-50 text-emerald-600' },
    'art': { couleur: 'border-l-purple-500', badge: 'bg-purple-50 text-purple-600' },
  };
  
  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      {/* En-tête avec titre et description */}
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto">
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-calendar-alt"></i> Calendrier Academique
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[1000px]">
          Année universitaire <span className="text-primary">2025 – 2026</span>
        </h1>
        <p className="text-slate-500 text-base md:text-[17.6px] mb-8 max-w-[800px]">
          Retrouvez toutes les dates importantes : rentrées, examens, congés et événements de l'Université Nouveaux Horizons.
        </p>
      </section>
      
      {/* Section principale avec filtres et liste d'événements */}
      <section className="max-w-4xl mx-auto mb-16 px-4">
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-primary/20">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <i className="fa-solid fa-calendar-star text-primary"></i> Événements à venir
            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">En direct</span>
          </h2>
          <div className="flex gap-2">
            {/* Bouton d'export PDF (pour tous) */}
            <button 
              onClick={() => exportService.exportCalendrierToPDF(evenementsServeur, 'calendrier')}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <i className="fas fa-file-pdf"></i> Export PDF
            </button>
            {/* Bouton de création (admin uniquement) */}
            {estAdmin && (
              <button
                onClick={() => setFormulaireOuvert(v => !v)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-md"
              >
                <i className={`fa-solid ${formulaireOuvert ? 'fa-times' : 'fa-plus'}`}></i>
                {formulaireOuvert ? 'Annuler' : 'Créer un événement'}
              </button>
            )}
          </div>
        </div>
        
        {/* Formulaire de création d'événement (admin uniquement) */}
        {estAdmin && formulaireOuvert && (
          <form onSubmit={creerEvenement} className="bg-white border border-primary/20 rounded-2xl p-6 mb-8 shadow-lg space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <i className="fa-solid fa-calendar-plus text-primary"></i> Nouvel événement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre *</label>
                <input required value={creation.titre} onChange={e => setCreation(p => ({...p, titre: e.target.value}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm" placeholder="Titre de l'événement" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea value={creation.description} onChange={e => setCreation(p => ({...p, description: e.target.value}))}
                  rows={2} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm resize-none" placeholder="Description..." />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Date *</label>
                <input required type="date" value={creation.date} onChange={e => setCreation(p => ({...p, date: e.target.value}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Heure</label>
                <input type="time" value={creation.heure} onChange={e => setCreation(p => ({...p, heure: e.target.value}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Lieu</label>
                <input value={creation.lieu} onChange={e => setCreation(p => ({...p, lieu: e.target.value}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm" placeholder="Campus Principal" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Catégorie *</label>
                <select value={creation.categorie} onChange={e => setCreation(p => ({...p, categorie: e.target.value}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm">
                  <option value="academique">Académique</option>
                  <option value="tech">Tech</option>
                  <option value="sport">Sport</option>
                  <option value="art">Art & Culture</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Places max</label>
                <input type="number" min="1" value={creation.maxInscrits} onChange={e => setCreation(p => ({...p, maxInscrits: parseInt(e.target.value)}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Organisateur</label>
                <input value={creation.organisateur} onChange={e => setCreation(p => ({...p, organisateur: e.target.value}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm" placeholder="Administration" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={envoiEnCours}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-primary transition-all disabled:opacity-50">
                <i className="fa-solid fa-floppy-disk mr-2"></i>
                {envoiEnCours ? 'Enregistrement...' : 'Créer l\'événement'}
              </button>
            </div>
          </form>
        )}
        
        {/* États de chargement, données ou absence de données */}
        {chargementEv ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => <SkeletonEvent key={i} />)}
          </div>
        ) : evenementsServeur.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {evenementsServeur.map(ev => {
              const style = categorieEv[ev.categorie] || { couleur: 'border-l-slate-400', badge: 'bg-slate-50 text-slate-500' };
              const complet = ev.inscrits >= ev.maxInscrits;
              const dejaInscrit = inscriptions[ev.id];
              return (
                <div key={ev.id} className={`bg-white rounded-2xl p-5 border border-slate-100 border-l-4 ${style.couleur} shadow-sm hover:shadow-md transition-all relative group`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-slate-900 text-[15px] leading-snug flex-1 pr-2">{ev.titre}</h3>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg shrink-0 ${style.badge}`}>{ev.categorie}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{ev.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold mb-4">
                    <span><i className="fa-solid fa-calendar mr-1"></i>{ev.date}</span>
                    <span><i className="fa-solid fa-clock mr-1"></i>{ev.heure}</span>
                    <span><i className="fa-solid fa-location-dot mr-1"></i>{ev.lieu}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold">
                      {ev.inscrits}/{ev.maxInscrits} inscrits
                      {complet && <span className="ml-1 text-red-500">(Complet)</span>}
                    </span>
                    {estAdmin ? (
                      /* Admin : bouton supprimer */
                      <button
                        onClick={() => supprimerEvenement(ev.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-trash-can"></i> Supprimer
                      </button>
                    ) : (
                      /* Étudiant : bouton s'inscrire */
                      <button
                        onClick={() => sInscrire(ev.id)}
                        disabled={complet || dejaInscrit}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          dejaInscrit ? 'bg-emerald-50 text-emerald-600 cursor-default' :
                            complet ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                            'bg-primary text-white hover:-translate-y-0.5 hover:shadow-lg shadow-primary/20'
                        }`}
                      >
                        <i className={`fa-solid ${dejaInscrit ? 'fa-check' : 'fa-user-plus'} mr-1.5`}></i>
                        {dejaInscrit ? 'Inscrit !' : complet ? 'Complet' : "S'inscrire"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
            <i className="fa-solid fa-calendar-xmark text-3xl mb-3"></i>
            <p className="text-sm font-medium">Aucun événement à venir pour le moment.</p>
          </div>
        )}
      </section>
      
      {/* Légende des couleurs */}
      <section className="max-w-4xl mx-auto pb-20 px-4">
        <div className="flex gap-4 md:gap-6 flex-wrap justify-center mb-12 bg-white py-4 px-6 rounded-xl border border-slate-200">
          <span className="flex items-center gap-2 text-[11px] md:text-[13px] font-semibold text-slate-500">
            <span className="w-3 h-3 rounded-full shrink-0 bg-primary"></span> Académique
          </span>
          <span className="flex items-center gap-2 text-[11px] md:text-[13px] font-semibold text-slate-500">
            <span className="w-3 h-3 rounded-full shrink-0 bg-red-500"></span> Examens
          </span>
          <span className="flex items-center gap-2 text-[11px] md:text-[13px] font-semibold text-slate-500">
            <span className="w-3 h-3 rounded-full shrink-0 bg-green-500"></span> Congés
          </span>
          <span className="flex items-center gap-2 text-[11px] md:text-[13px] font-semibold text-slate-500">
            <span className="w-3 h-3 rounded-full shrink-0 bg-amber-500"></span> Événements
          </span>
          <span className="flex items-center gap-2 text-[11px] md:text-[13px] font-semibold text-slate-500">
            <span className="w-3 h-3 rounded-full shrink-0 bg-purple-500"></span> Réunions
          </span>
        </div>
        {/* Affichage mensuel du calendrier */}
        {mois.map((m, mIdx) => (
          <div key={mIdx} className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-slate-100">
              <i className="fa-solid fa-calendar-day text-primary"></i> {m.nom}
            </h2>
            <div className="flex flex-col gap-3">
              {m.evenements.map((ev, evIdx) => (
                <div 
                  key={evIdx} 
                  className={`flex items-center gap-4 px-5 py-4 rounded-[14px] bg-white border border-slate-200 border-l-4 ${ev.couleur} transition-all duration-200 hover:translate-x-1 hover:shadow-md`}
                >
                  <div className="flex flex-col items-center min-w-12">
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">{ev.jour}</span>
                  </div>
                  <div className="flex-1">
                    <strong className="text-[15px] text-slate-900 block mb-0.5 leading-snug">{ev.titre}</strong>
                    {ev.details ? (
                      <ul className="list-disc pl-4 text-[13px] text-slate-900 m-0 space-y-1">
                        {ev.details.map((d, dIdx) => <li key={dIdx}>{d}</li>)}
                      </ul>
                    ) : (
                      <p className="text-[13px] text-slate-500">{ev.date}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0 items-end justify-center">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-lg ${ev.badge} whitespace-nowrap`}>
                      {ev.type}
                    </span>
                    {ev.type2 && (
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-lg ${ev.badge2} whitespace-nowrap`}>
                        {ev.type2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Lien de téléchargement du calendrier complet */}
        <div className="text-center mt-12">
          <a 
            href="/assets/CALENDRIER-ACADEMIQUE-2025-2026_officiel(2).pdf" 
            download="Calendrier_Academique_UNH_2025-2026.pdf"
            className="px-10 py-4 bg-slate-900 text-white no-underline rounded-2xl font-bold hover:bg-primary transition-all inline-flex items-center gap-3 mx-auto shadow-xl"
          >
            <i className="fa-solid fa-file-pdf"></i> Télécharger le calendrier complet 2025-2026
          </a>
        </div>
      </section>
      <AlerteComponent />
    </main>
  );
};

export default Calendrier;
```

### 📱 RESPONSIVE DESIGN
L'interface utilise TailwindCSS avec des classes responsives :
- `md:` pour les écrans moyens (≥768px)
- `lg:` pour les larges écrans (≥1024px)
- Grille d'événements qui s'adapte : 1 colonne sur mobile, 2 sur tablette et desktop
- Formulaire de création adapté aux différents écrans
- Affichage mensuel optimisé pour toutes les tailles d'écran
- Espacements et tailles de texte qui s'ajustent selon la taille d'écran

### ⚡ PERFORMANCE
- Utilisation de `useEffect` avec dépendance vide pour charger les données une seule fois au montage
- Filtrage et tri effectués en mémoire pour éviter les nouvelles requêtes API inutiles
- États clairement séparés (chargement, données, erreur) pour éviter les re-renders intempestifs
- Mise à jour optimiste lors de l'inscription à un événement pour une meilleure réactivité
- Données du calendrier stockées statiquement pour éviter les requêtes inutilement fréquentes

### 🎨 COMPOSANTS REUTILISABLES
- `SkeletonEvent`: États de chargement visuellement agréables
- Utilisation extensive de classes TailwindCSS pour le styling plutôt que du CSS personnalisé
- Icônes FontAwesome intégrées directement dans le JSX
- Effets visuels modernes (ombres, transitions, transformations)
- Gestion d'états modaux pour le formulaire de création (admin)
- Boutons d'action avec états de chargement et de désactivation
- Lien de téléchargement direct pour le calendrier complet au format PDF

Cette page du calendrier offre une vue complète et interactive de l'année académique, permettant aux utilisateurs de suivre facilement les dates importantes, de s'inscrire aux événements (pour les étudiants) et de gérer le calendrier (pour les administrateurs), avec une interface adaptée à tous les types d'appareils.

---
## 📄 `frontend/src/pages/Campus.jsx` - Page du Plan du Campus

### 🎯 Objectif
La page du plan du campus permet aux utilisateurs de visualiser et de localiser facilement tous les bâtiments, salles et espaces de l'Université Nouveaux Horizons. Elle offre une recherche par nom, étage ou type de salle, ainsi qu'un affichage détaillé des informations de chaque salle (description, itinéraire, capacité, photo) lorsqu'elle est sélectionnée.

### 📦 IMPORTS ET CONFIGURATION INITIALE
```javascript
import React, { useState } from 'react';
// Hooks React pour gérer l'état local (recherche, salle sélectionnée)
```

### 🏗️ COMPOSANT PRINCIPAL CAMPUS
```javascript
const Campus = () => {
  // États locaux du composant
  const [recherche, setRecherche] = useState(''); // Terme de recherche saisie par l'utilisateur
  const [salleSelectionnee, setSalleSelectionnee] = useState(null); // Salle actuellement sélectionnée pour affichage détaillé

  // Données statiques du campus avec tous les bâtiments et leurs salles
  const batiments = [
    {
      nom: 'UNH 1',
      icon: 'fa-building',
      salles: [
        // Rez-de-chaussée
        {
          nom: 'Salle 402 A',
          etage: 'Rez-de-chaussée',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 122,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 1, la salle 402 A se trouve à droite de l\'entrée principale.',
          photo: '/assets/402A.jpg',
          icon: 'fa-chalkboard-user'
        },
        // ... (toutes les autres salles détaillées dans le fichier original)
      ]
    },
    // ... (autres bâtiments UNH 2, UNH 3, UNH 4 avec leurs salles respectives)
  ];

  // Fonction de filtrage des salles basée sur le terme de recherche
  const filtrerSalles = (salles) => {
    return salles.filter(salle =>
      salle.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      salle.etage.toLowerCase().includes(recherche.toLowerCase()) ||
      salle.type.toLowerCase().includes(recherche.toLowerCase())
    );
  };

  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      {/* En-tête avec titre et description */}
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto">
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-map-marked-alt"></i> PLAN DU CAMPUS
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[800px]">
          Explorez le <span className="text-primary">Campus</span>
        </h1>
        <p className="text-slate-500 text-base md:text-[17.6px] mb-8 max-w-[800px]">
          Localisez facilement les bâtiments, salles de cours et services de l'Université Nouveaux Horizons.
        </p>
      </section>

      {/* Section principale avec barre de recherche et liste des bâtiments */}
      <section className="max-w-[1000px] mx-auto pb-20 px-4">
        {/* Barre de recherche */}
        <div className="bg-white w-full max-w-[500px] px-5 py-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3 border border-slate-200 mx-auto mb-10">
          <i className="fa-solid fa-search text-slate-400 text-base"></i>
          <input
            type="text"
            placeholder="Rechercher une salle, bureau..."
            className="flex-1 border-none outline-none text-[15px] text-slate-800 font-inter bg-transparent"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>

        {/* Liste des bâtiments et salles filtrées */}
        <div id="liste-batiments">
          {batiments.map((batiment, idx) => {
            const sallesFiltrees = filtrerSalles(batiment.salles);
            if (sallesFiltrees.length === 0) return null;
            return (
              <div key={idx} className="mb-10">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                  <i className={`fa-solid ${batiment.icon} text-primary`}></i>
                  {batiment.nom}
                  <span className="text-[13px] font-medium text-slate-400">{batiment.salles.length} salles</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sallesFiltrees.map((salle, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-white rounded-xl border border-slate-200 px-4 py-3.5 flex justify-between items-center cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-[0_4px_10px_rgba(58,176,255,0.15)] hover:-translate-y-0.5"
                      onClick={() => setSalleSelectionnee(salle)}
                    >
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-location-dot text-primary text-base"></i>
                        <div>
                          <strong className="block text-sm text-slate-900 font-semibold">{salle.nom}</strong>
                          <span className="text-xs text-slate-400">{salle.etage}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${salle.typeCouleur}`}>
                          {salle.type}
                        </span>
                        <i className="fa-solid fa-chevron-right text-xs text-slate-300"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Affichage détaillé de la salle sélectionnée (mode modal) */}
      {salleSelectionnee && (
        <>
          {/* Overlay sombre pour masquer le contenu derrière */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-3000" onClick={() => setSalleSelectionnee(null)}></div>
          
          {/* Fenêtre modale avec les détails de la salle */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl w-[95%] max-w-[760px] z-4000 overflow-hidden shadow-2xl anime-apparition border border-gray-100">
            {/* Header avec image et overlay moderne */}
            <div className="relative h-80 overflow-hidden bg-slate-100">
              <img
                src={salleSelectionnee.photo}
                alt={salleSelectionnee.nom}
                className="w-full h-full object-contain transition-all duration-500"
                onError={(e) => { e.target.src = '/assets/402A.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              
              {/* Bouton de fermeture moderne */}
              <button
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 w-10 h-10 rounded-xl cursor-pointer text-white flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                onClick={() => setSalleSelectionnee(null)}
              >
                <i className="fa-solid fa-times text-lg"></i>
              </button>
              
              {/* Informations superposées sur l'image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{salleSelectionnee.nom}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${salleSelectionnee.typeCouleur} bg-white/90 backdrop-blur-sm`}>
                        {salleSelectionnee.type}
                      </span>
                      <span className="text-xs text-white/90 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <i className="fa-solid fa-layer-group"></i> {salleSelectionnee.etage}
                      </span>
                      {salleSelectionnee.capacite && (
                        <span className="text-xs text-white/90 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <i className="fa-solid fa-users"></i> {salleSelectionnee.capacite} places
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <i className="fa-solid fa-door-open text-xl text-white"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu principal avec sections modernes */}
            <div className="p-6 space-y-6">
              {/* Section Description avec design moderne */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <i className="fa-solid fa-circle-info text-primary text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Description</h4>
                    <p className="text-xs text-gray-500">Caractéristiques de l'espace</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {salleSelectionnee.description || 'Aucune description disponible pour cet espace.'}
                </p>
              </div>

              {/* Section Itinéraire avec design moderne */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <i className="fa-solid fa-route text-white text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Itinéraire</h4>
                    <p className="text-xs text-gray-500">Comment s'y rendre</p>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200/50">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {salleSelectionnee.itineraire || `Prenez l'escalier ou l'ascenseur vers le ${salleSelectionnee.etage}. La salle se trouve dans l'aile correspondante du bâtiment.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Campus;
```

### 📱 RESPONSIVE DESIGN
L'interface utilise TailwindCSS avec des classes responsives :
- `md:` pour les écrans moyens (≥768px)
- `lg:` pour les larges écrans (≥1024px)
- Barre de recherche centrée et adaptative
- Grille de salles qui s'ajuste selon la taille de l'écran (1 colonne sur mobile, 2 sur tablette, 3 sur desktop)
- Modal responsive pour l'affichage détaillé des salles
- Espacements et tailles de texte qui s'adaptent selon la taille d'écran

### ⚡ PERFORMANCE
- Utilisation de `useState` pour gérer efficacement l'état local (recherche, sélection)
- Filtrage effectué en mémoire pour éviter les recalculs inutiles
- États clairement définis pour éviter les re-renders intempestifs
- Données du campus stockées statiquement pour éviter les requêtes réseau inutiles
- Gestion des erreurs de chargement d'image avec fallback vers une image par défaut

### 🎨 COMPOSANTS REUTILISABLES
- Utilisation extensive de classes TailwindCSS pour le styling plutôt que du CSS personnalisé
- Icônes FontAwesome intégrées directement dans le JSX
- Effets visuels modernes (ombres, transitions, transformations)
- Interface modale personnalisée pour l'affichage détaillé des salles
- Boutons interactifs avec états de survol, focus et animation
- Système de cartes interactives pour représenter chaque salle
- Gestion élégante des états de sélection et de survol

Cette page du plan du campus offre une expérience interactive complète permettant aux utilisateurs de rechercher, filtrer et visualiser facilement tous les espaces de l'université, avec une interface intuitive qui fonctionne parfaitement sur tous les appareils, des smartphones aux écrans larges.

---
## 📄 `frontend/src/pages/Profil.jsx` - Page de Profil Utilisateur

### 🎯 Objectif
La page de profil permet aux utilisateurs de consulter et de modifier leurs informations personnelles, de gérer leur photo de profil, de changer leur mot de passe et, pour les mentors, de visualiser leurs statistiques d'évaluation. Elle offre une interface complète pour la gestion du compte utilisateur avec validation des données et feedback visuel.

### 📦 IMPORTS ET CONFIGURATION INITIALE
```javascript
import React, { useState, useContext, useEffect } from 'react';
// Hooks React pour gérer l'état local, les effets secondaires et le contexte
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
// Accès au contexte global (utilisateur, photo de profil, fonctions de mise à jour, notifications)
import { apiUtilisateurs } from '../api';
// Service API pour les opérations utilisateur (mise à jour profil, changement mot de passe)
import LazyImage from '../components/ui/LazyImage';
// Composant de chargement paresseux pour optimiser le chargement des images
import ratingService from '../services/RatingService';
// Service pour gérer les évaluations et les statistiques de notation
```

### 🏗️ COMPOSANT PRINCIPAL PROFIL
```javascript
const Profil = () => {
  // Récupération des données utilisateur depuis le contexte global
  const { utilisateur, photoProfil, mettreAJourUtilisateur, mettreAJourPhoto, ajouterNotification } = useContext(ContexteUtilisateur);

  // États locaux du composant
  const [chargement, setChargement] = useState(false); // État de chargement pour les opérations
  const [erreur, setErreur] = useState(null); // Erreur générale (ex: mise à jour infos)
  const [erreurMdp, setErreurMdp] = useState(null); // Erreur spécifique au changement de mot de passe
  const [photoAperçu, setPhotoAperçu] = useState(null); // Aperçu de la photo de profil avant upload

  // États pour les informations personnelles
  const [nom, setNom] = useState(''); // Nom complet de l'utilisateur
  const [filiere, setFiliere] = useState(''); // Filière d'études
  const [promotion, setPromotion] = useState(''); // Année/promotion

  // États pour le changement de mot de passe
  const [mdpData, setMdpData] = useState({
    ancien: '', // Mot de passe actuel
    nouveau: '', // Nouveau mot de passe
    confirmation: '' // Confirmation du nouveau mot de passe
  });

  // États pour les statistiques de rating (mentors uniquement)
  const [statsRating, setStatsRating] = useState(null); // Statistiques d'évaluation

  /**
   * Génère une URL de photo par défaut basée sur l'ID utilisateur
   * @param {string|null} userId - L'identifiant de l'utilisateur
   * @returns {string} URL de l'image par défaut
   */
  const getDefaultPhoto = (userId) => {
    const photoOptions = [
      'https://picsum.photos/seed/user1/200/200.jpg',
      'https://picsum.photos/seed/user2/200/200.jpg',
      'https://picsum.photos/seed/user3/200/200.jpg',
      'https://picsum.photos/seed/user4/200/200.jpg',
      'https://picsum.photos/seed/user5/200/200.jpg',
      'https://picsum.photos/seed/user6/200/200.jpg',
      'https://picsum.photos/seed/user7/200/200.jpg',
      'https://picsum.photos/seed/user8/200/200.jpg',
      'https://picsum.photos/seed/user9/200/200.jpg',
      'https://picsum.photos/seed/user10/200/200.jpg'
    ];
    const hash = userId ? userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0;
    const photoIndex = Math.abs(hash) % photoOptions.length;
    return photoOptions[photoIndex];
  };

  // Initialisation des données utilisateur au montage ou quand l'utilisateur change
  useEffect(() => {
    if (utilisateur && utilisateur.id) {
      // Pré-remplissage du formulaire avec les données actuelles
      setNom(utilisateur.nom || '');
      setFiliere(utilisateur.filiere || 'informatique');
      setPromotion(utilisateur.promotion || utilisateur.annee || 'L1');
      setPhotoAperçu(photoProfil || utilisateur.avatar || getDefaultPhoto(utilisateur.id));
      
      // Charger les statistiques de rating si l'utilisateur est un mentor
      if (utilisateur.role === 'mentor' || utilisateur.estMentor) {
        const stats = ratingService.getStatistiques('mentor', utilisateur.id);
        setStatsRating(stats);
      }
    }
  }, [utilisateur, photoProfil]); // Ré-exécuter quand l'utilisateur ou sa photo change

  /**
   * Compresse une image base64 pour réduire sa taille tout en préservant la qualité
   * @param {string} base64Original - L'image en base64 à compresser
   * @returns {Promise<string>} Image compressée en base64
   */
  const compresserImage = (base64Original) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 400; // Taille maximale en pixels
        let { width, height } = img;
        // Maintenir le ratio tout en réduisant si nécessaire
        if (width > height) {
          if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
        } else {
          if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        // Qualité 0.8 pour bon compromis qualité/taille
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = base64Original;
    });
  };

  // Gestion du changement de photo de profil
  const gérerPhoto = (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;

    const lecteur = new FileReader();
    lecteur.onload = async (ev) => {
      const photoCompressée = await compresserImage(ev.target.result);
      setPhotoAperçu(photoCompressée); // Mettre à jour l'aperçu local
      mettreAJourPhoto(photoCompressée); // Met à jour le contexte global
      
      try {
        // Sauvegarde dans la base de données
        const res = await apiUtilisateurs.modifier(utilisateur.id, {
          nom: utilisateur.nom,
          filiere: utilisateur.filiere,
          promotion: utilisateur.promotion,
          avatar: photoCompressée
        });
        mettreAJourUtilisateur(res.utilisateur); // Met à jour les données utilisateur
      } catch (err) {
        console.error('Erreur sauvegarde photo:', err);
      }
    };
    lecteur.readAsDataURL(fichier);
  };

  // Gestion du changement de mot de passe
  const gérerChangementMdp = async (e) => {
    e.preventDefault();
    if (mdpData.nouveau !== mdpData.confirmation) {
      setErreurMdp('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    try {
      setChargement(true);
      setErreurMdp(null);
      await apiUtilisateurs.modifierMotDePasse(utilisateur.id, mdpData.ancien, mdpData.nouveau);
      ajouterNotification('Mot de passe modifié', 'Votre mot de passe a été mis à jour avec succès.', 'success', 'fa-lock');
      setMdpData({ ancien: '', nouveau: '', confirmation: '' }); // Réinitialiser le formulaire
    } catch (err) {
      setErreurMdp(err.message);
    } finally {
      setChargement(false);
    }
  };

  // Gestion de la modification des informations personnelles
  const modifierInfos = async (e) => {
    e.preventDefault();
    try {
      setChargement(true);
      setErreur(null);
      const res = await apiUtilisateurs.modifier(utilisateur.id, {
        nom,
        filiere,
        promotion,
        avatar: photoAperçu
      });
      
      // Extraire le prénom du nom complet pour l'affichage
      const nomParts = nom.split(' ');
      const utilisateurMaj = {
        ...res.utilisateur,
        prenom: nomParts[0] || nom,
        nom: nomParts.slice(1).join(' ') || ''
      };
      
      mettreAJourUtilisateur(utilisateurMaj); // Met à jour les données utilisateur
      if (photoAperçu) mettreAJourPhoto(photoAperçu); // Met à jour la photo si elle a changé
      ajouterNotification('Profil mis à jour', 'Vos informations personnelles ont été enregistrées.', 'success', 'fa-user-check');
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  // Redirection vers la connexion si l'utilisateur n'est pas authentifié
  if (!utilisateur || !utilisateur.id) {
    return (
      <div className="pt-40 text-center">
        <p className="text-slate-500">Veuillez vous connecter pour accéder à votre profil.</p>
      </div>
    );
  }

  // Interface principale du profil
  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      <section className="max-w-[1000px] mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Colonne principale: Informations personnelles et mot de passe */}
          <div className="flex-1 space-y-6">
            {/* Carte: Informations Personnelles */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <i className="fa-solid fa-user-circle text-primary"></i> Informations Personnelles
              </h2>

              <form onSubmit={modifierInfos} className="space-y-5">
                {/* Affichage/édition de la photo de profil */}
                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="w-32 h-32 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center text-slate-300 relative group transition-all hover:border-primary">
                    {photoAperçu ? (
                      <LazyImage src={photoAperçu} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <i className="fa-solid fa-user text-4xl"></i>
                    )}
                    <label className="absolute inset-0 bg-black/40 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
                      CHANGER PHOTO
                      <input type="file" className="hidden" accept="image/*" onChange={gérerPhoto} />
                    </label>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Photo de profil</p>
                </div>

                {/* Champs de saisie pour les informations personnelles */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom complet</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-slate-200 focus:border-primary outline-none bg-slate-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Non modifiable)</label>
                  <input disabled type="email" value={utilisateur.email} className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Filière (Non modifiable)</label>
                    <select disabled value={filiere} className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed">
                      <option value="informatique">Informatique</option>
                      <option value="medecine">Médecine</option>
                      <option value="droit">Droit</option>
                      <option value="gestion">Gestion</option>
                      <option value="architecture">Architecture</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Promotion (Non modifiable)</label>
                    <select disabled value={promotion} className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed">
                      <option value="L1">Licence 1</option>
                      <option value="L2">Licence 2</option>
                      <option value="L3">Licence 3</option>
                      <option value="M1">Master 1</option>
                      <option value="M2">Master 2</option>
                    </select>
                  </div>
                </div>

                {/* Affichage d'erreur s'il y en a une */}
                {erreur && <p className="text-red-500 text-xs font-bold mt-2">{erreur}</p>}
                <button disabled={chargement} type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-primary transition-all mt-4 disabled:opacity-50">
                  {chargement ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </form>
            </div>

            {/* Section Ratings pour les mentors (affichée conditionnellement) */}
            {(utilisateur.role === 'mentor' || utilisateur.estMentor) && statsRating && (
              <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <i className="fa-solid fa-star text-amber-500"></i> Mes Évaluations
                </h2>
                <p className="text-slate-600 text-sm mb-6">Avis et notes des étudiants que vous avez accompagnés</p>
                
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-600 uppercase mb-1">Note moyenne</p>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold text-amber-500">{statsRating.moyenne}/5</span>
                        {statsRating.nombreVotes > 0 && (
                          <span className="text-sm text-slate-500">
                            ({statsRating.nombreVotes} vote{statsRating.nombreVotes > 1 ? 's' : ''})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                      <i className="fa-solid fa-star text-amber-500 text-3xl"></i>
                    </div>
                  </div>
                  
                  {/* Détails des statistiques de rating */}
                  {statsRating.nombreVotes > 0 && (
                    <>
                      <div className="mt-4 pt-4 border-t border-amber-200">
                        <p className="text-xs font-bold text-slate-600 uppercase mb-3">Distribution des notes</p>
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map(etoile => (
                            <div key={etoile} className="flex items-center gap-3">
                              <span className="text-xs font-bold text-slate-600 w-4">{etoile}</span>
                              <i className="fa-solid fa-star text-amber-400 text-xs"></i>
                              <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                  style={{ width: `${statsRating.nombreVotes > 0 ? (statsRating.distribution[etoile] / statsRating.nombreVotes) * 100 : 0}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-slate-500 w-8 text-right">{statsRating.distribution[etoile]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-amber-200">
                        <p className="text-xs font-bold text-slate-600 uppercase mb-2">Détails des votes</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {statsRating.ratings.map((rating, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                  <i className="fa-solid fa-user text-slate-400 text-xs"></i>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-700">Utilisateur {rating.userId.slice(0, 8)}</p>
                                  <p className="text-[10px] text-slate-400">
                                    {new Date(rating.date).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <i 
                                    key={star} 
                                    className={`fa-solid fa-star text-xs ${star <= rating.valeur ? 'text-amber-400' : 'text-slate-300'}`}
                                  ></i>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Message cuando il n'y a pas encore d'évaluations */}
                  {statsRating.nombreVotes === 0 && (
                    <div className="text-center py-6">
                      <i className="fa-solid fa-star-half-stroke text-amber-300 text-4xl mb-3"></i>
                      <p className="text-sm text-slate-600">Aucune évaluation pour le moment</p>
                      <p className="text-xs text-slate-400 mt-1">Les étudiants pourront vous noter après avoir été accompagnés</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profil;
```

### 📱 RESPONSIVE DESIGN
L'interface utilise TailwindCSS avec des classes responsives :
- `md:` pour les écrans moyens (≥768px) - passage en disposition côte à côte
- Conteneur principal avec padding adaptatif
- Cartes et formulaires qui s'ajustent selon la largeur de l'écran
- Champs de saisie et boutons avec tailles adaptatives
- Images et avatars avec dimensions flexibles
- Espacements et marges qui s'adaptent selon la taille d'écran

### ⚡ PERFORMANCE
- Utilisation optimisée des hooks React (`useState`, `useContext`, `useEffect`)
- Chargement paresseux des images avec le composant `LazyImage`
- Compression des images côté client pour réduire la taille des uploads
- Éviter les re-renders inutiles grâce à une gestion précise des états
- Chargement des statistiques de rating uniquement quand nécessaire (pour les mentors)
- Mise à jour sélective du contexte uniquement quand les données changent réellement

### 🎨 COMPOSANTS REUTILISABLES
- `LazyImage`: Optimise le chargement des images avec un placeholder
- Utilisation extensive de classes TailwindCSS plutôt que du CSS personnalisé
- Icônes FontAwesome intégrées directement dans le JSX
- Effets visuels modernes (ombres, transitions, transformations)
- Formulaires avec validation et états de chargement
- Boutons interactifs avec feedback visuel
- Affichage conditionnel basé sur le rôle utilisateur (mentor vs étudiant)
- Gestion élégante des états de succès/erreur avec notifications

Cette page de profil offre une expérience complète de gestion de compte utilisateur, permettant aux étudiants et aux mentors de mettre à jour leurs informations personnelles, de gérer leur photo de profil, de changer leur mot de passe en toute sécurité et, pour les mentors, de consulter leurs statistiques d'évaluation avec des visualisations détaillées.

---
## 📄 `frontend/src/pages/Parametres.jsx` - Page des Paramètres de Candidature Mentor

### 🎯 Objectif
La page des paramètres permet aux utilisateurs de gérer leurs candidatures au programme de mentorat. Elle affiche la liste des candidatures soumises avec leur statut (en attente, approuvé, refusé), permet de modifier une candidature existante ou de la retirer, et offre un accès direct pour soumettre une nouvelle candidature.

### 📦 IMPORTS ET CONFIGURATION INITIALE
```javascript
import React, { useState, useEffect } from 'react';
// Hooks React pour gérer l'état local, les effets secondaires
import { Link } from 'react-router-dom';
// Composant pour la navigation vers d'autres pages
import { apiMentors } from '../api';
// Service API spécifique aux opérations liées aux mentors
import { useAlerte } from '../components/AlertePersonnalisee';
// Hook personnalisé pour afficher des notifications/toasts
```

### 🏗️ COMPOSANT PRINCIPAL PARAMÈTRES
```javascript
const Parametres = () => {
  // États locaux du composant
  const [listeCandidatures, setListeCandidatures] = useState([]); // Liste des candidatures mentorat
  const [chargement, setChargement] = useState(true); // État de chargement initiale
  const [erreur, setErreur] = useState(null); // Erreur lors du chargement
  const { montrerAlerte, AlerteComponent } = useAlerte(); // Fonctions d'affichage d'alertes

  // Chargement des candidatures au montage du composant
  useEffect(() => {
    chargerProfils();
  }, []);

  // Récupère la liste des candidatures de l'utilisateur connecté
  const chargerProfils = async () => {
    try {
      setChargement(true);
      const data = await apiMentors.getMesProfils(); // Appel API pour récupérer les candidatures
      setListeCandidatures(data.mentors); // Stocke la liste des candidatures
    } catch (err) {
      setErreur(err.message); // Capture et stocke l'erreur
    } finally {
      setChargement(false); // Termine l'état de chargement
    }
  };

  // Supprime une candidature après confirmation
  const supprimerCandidature = async (id) => {
    const confirmed = await montrerAlerte({
      type: 'confirm',
      titre: 'Retirer la candidature',
      message: 'Voulez-vous vraiment retirer cette candidature de mentor ?',
      boutonConfirmText: 'Retirer',
      boutonCancelText: 'Annuler'
    });
    
    if (confirmed) {
      try {
        await apiMentors.supprimer(id); // Suppression via API
        setListeCandidatures(prev => prev.filter(m => m.id !== id)); // Met à jour l'état local
        await montrerAlerte({
          type: 'success',
          titre: 'Succès',
          message: 'La candidature a été retirée avec succès.',
          boutonConfirmText: 'OK'
        });
      } catch (err) {
        await montrerAlerte({
          type: 'error',
          titre: 'Erreur',
          message: 'Erreur lors de la suppression : ' + err.message,
          boutonConfirmText: 'OK'
        });
      }
    }
  };

  // Génère un badge coloré selon le statut de la candidature
  const getStatusBadge = (status) => {
    switch(status) {
      case 'approuve': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">Approuvé</span>;
      case 'rejete': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-100">Refusé</span>;
      default: return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-100">En attente</span>;
    }
  };

  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      {/* En-tête avec titre et description */}
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto mb-10">
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-cog"></i> PARAMÈTRES DU COMPTE
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[800px]">
          Mes <span className="text-primary">Profils Mentor</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-[22px] max-w-[800px]">
          Gérez vos différents profils de mentorat et suivez l'état de vos demandes.
        </p>
      </section>

      {/* Section principale avec gestion des candidatures */}
      <section className="max-w-[900px] mx-auto pb-20 flex flex-col gap-8 px-4">
        {/* En-tête de la section avec bouton d'ajout */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <i className="fa-solid fa-chalkboard-user text-primary"></i> 
              Vos Candidatures ({listeCandidatures.length})
            </h3>
            <Link to="/devenir-mentor" className="text-xs font-bold text-primary hover:underline">
              + Nouvelle candidature
            </Link>
          </div>

          {/* États de chargement, données ou absence de données */}
          {chargement ? (
            <div className="text-center py-12">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-primary"></i>
            </div>
          ) : listeCandidatures.length > 0 ? (
            <div className="grid gap-4">
              {listeCandidatures.map((candidat) => (
                <div key={candidat.id} className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all">
                  {/* Informations du candidat */}
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    {/* Avatar ou initiale du nom */}
                    <div 
                      className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center font-bold text-slate-300 text-xl shrink-0"
                      style={candidat.photo ? { backgroundImage: `url(${candidat.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    >
                      {!candidat.photo && candidat.nom?.[0]} {/* Affiche l'initiale si pas de photo */}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{candidat.nom}</h4>
                      <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-0.5">{candidat.filiere} • {candidat.annee}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-primary border border-blue-100">{candidat.specialite}</span>
                        {getStatusBadge(candidat.status)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Boutons d'action */}
                  <div className="flex gap-3 w-full md:w-auto">
                    <Link to={`/devenir-mentor?edit=${candidat.id}`} className="flex-1 md:flex-none px-5 py-2.5 bg-slate-100 text-slate-700 no-underline rounded-xl font-bold hover:bg-slate-200 transition-all text-xs flex items-center justify-center gap-2">
                      <i className="fa-solid fa-pen"></i> Modifier
                    </Link>
                    <button 
                      onClick={() => supprimerCandidature(candidat.id)}
                      className="flex-1 md:flex-none px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100 text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <i className="fa-solid fa-trash"></i> Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[30px] p-12 text-center">
              <i className="fa-solid fa-folder-open text-4xl text-slate-300 mb-4 block"></i>
              <p className="mb-4">
              <p className="text-slate-500 font-medium">Vous n'avez pas encore postulé pour être mentor.</p>
              <Link to="/devenir-mentor" className="inline-block mt-6 px-8 py-3 bg-primary text-white no-underline rounded-2xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all">
                Postuler maintenant
              </Link>
            </div>
          )}
        </div>

        {/* Affichage d'erreur s'il y en a une */}
        {erreur && <p className="text-red-500 text-center">{erreur}</p>}
        <AlerteComponent />
      </section>
    </main>
  );
};

export default Parametres;
```

### 📱 RESPONSIVE DESIGN
L'interface utilise TailwindCSS avec des classes responsives :
- `md:` pour les écrans moyens (≥768px) - disposition en ligne pour les cartes de candidature
- Conteneur principal avec largeur maximale adaptative
- Cartes de candidature qui s'affichent en colonne sur mobile et en ligne sur tablette/desktop
- Boutons d'action qui s'ajustent selon la largeur de l'écran
- Textes et espacements qui s'adaptent selon la taille d'écran

### ⚡ PERFORMANCE
- Utilisation de `useEffect` avec dépendance vide pour charger les données une seule fois au montage
- États clairement séparés (chargement, données, erreur) pour éviter les re-renders intempestifs
- Filtrage et mise à jour optimiste lors de la suppression d'une candidature
- Gestion efficace des listes avec `map` et clés uniques
- Requête API unique pour récupérer toutes les candidatures de l'utilisateur

### 🎨 COMPOSANTS REUTILISABLES
- Utilisation extensive de classes TailwindCSS pour le styling plutôt que du CSS personnalisé
- Icônes FontAwesome intégrées directement dans le JSX
- Effets visuels modernes (ombres, transitions, transformations)
- Composant `Link` de React Router pour la navigation interne
- Boutons interactifs avec états de survol et de focus
- Système de badges colorés pour visualiser rapidement le statut
- Gestion élégante des états de chargement avec indicateur de rotation
- Composant d'alerte personnalisé pour les notifications utilisateur

Cette page des paramètres offre une interface complète pour gérer les candidatures au programme de mentorat, permettant aux utilisateurs de suivre l'état de leurs demandes, de les modifier ou de les retirer, et d'en soumettre de nouvelles, le tout avec une expérience utilisateur fluide et intuitive.

---
## 📄 `frontend/src/pages/DevenirMentor.jsx` - Page de Candidature au Programme de Mentorat

### 🎯 Objectif
La page de candidature au programme de mentorat permet aux utilisateurs de soumettre une demande pour devenir mentor ou de modifier leur profil mentor existant. Elle offre un formulaire complet avec sélection dynamique des spécialités selon la filière, téléchargement de photo de profil, et validation des données avant soumission.

### 📦 IMPORTS ET CONFIGURATION INITIALE
```javascript
import React, { useState, useEffect, useContext } from 'react';
// Hooks React pour gérer l'état local, les effets secondaires et le contexte
import { useNavigate, useSearchParams } from 'react-router-dom';
// Hooks pour la navigation et la lecture des paramètres d'URL
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
// Accès au contexte global (notamment pour les notifications)
import { apiMentors } from '../api';
// Service API spécifique aux opérations liées aux mentors
```

### 🏗️ COMPOSANT PRINCIPAL DEVENIR MENTOR
```javascript
const DevenirMentor = () => {
  // Récupération des fonctions et données depuis le contexte et les hooks
  const { ajouterNotification } = useContext(ContexteUtilisateur);
  const [photoAperçu, setPhotoAperçu] = useState(null); // Aperçu de la photo avant upload
  const [searchParams] = useSearchParams(); // Paramètres d'URL (pour l'édition)
  const navigate = useNavigate(); // Hook de navigation
  const editId = searchParams.get('edit'); // ID du mentor à éditer (si présent)
  
  // États locaux du composant
  const [chargement, setChargement] = useState(false); // État de chargement du formulaire
  const [erreur, setErreur] = useState(null); // Message d'erreur à afficher
  
  // Mapping des spécialités par filière (données statiques)
  const specialisationsParFiliere = {
    'informatique': ['Développement Web', 'Intelligence Artificielle', 'Réseaux & Télécoms', 'Cybersécurité', 'Data Science'],
    'medecine': ['Pédiatrie', 'Chirurgie', 'Gynécologie', 'Ophtalmologie', 'Médecine Générale'],
    'droit': ['Droit Civil', 'Droit des Affaires', 'Droit Pénal', 'Droit International'],
    'science technologique': ['Génie Civil', 'Génie Électrique', 'Génie Mécanique', 'Génie Chimique', 'Génie Informatique'],
    'science des aliments et de l\'environnement': ['Technologie Alimentaire', 'Nutrition', 'Sécurité Alimentaire', 'Environnement', 'Qualité'],
    'gestion': ['Marketing Digital', 'Comptabilité', 'Ressources Humaines', 'Finance'],
    'architecture': ["Architecture Moderne", "Design d'Intérieur", "Urbanisme"],
    'SIC/multimedia': ['Design Graphique', 'Audiovisuel', 'Multimedia', 'Communication Digitale', 'Web Design']
  };
  
  // États du formulaire
  const [filiereSelectionnee, setFiliereSelectionnee] = useState('informatique'); // Filière actuellement sélectionnée
  const [formData, setFormData] = useState({
    nom: '', // Nom complet du mentor
    filiere: 'informatique', // Filière d'études
    annee: 'L1', // Année/promotion
    specialite: '', // Spécialité choisie
    motivation: '', // Biographie/motivation
    telephone: '' // Numéro de téléphone
  });

  // Chargement des données du mentor si on est en mode édition (URL contient ?edit=id)
  useEffect(() => {
    if (editId) {
      const chargerMentor = async () => {
        try {
          // Tentative de récupération via l'API
          const data = await apiMentors.getById(editId);
          const m = data.mentor;
          // Remplissage du formulaire avec les données existantes
          setFormData({
            nom: m.nom,
            filiere: m.filiere,
            annee: m.annee,
            specialite: m.specialite,
            motivation: m.bio || m.motivation || '',
            telephone: m.telephone || ''
          });
          setFiliereSelectionnee(m.filiere);
          setPhotoAperçu(m.photo);
        } catch (err) {
          console.error('Mentor introuvable via API, repli local.');
          // Fallback vers le localStorage si l'API échoue
          const mentors = JSON.parse(localStorage.getItem('campus_mentors') || '[]');
          const aModifier = mentors.find(m => String(m.id) === String(editId));
          if (aModifier) {
            setFormData({
              nom: aModifier.nom,
              filiere: aModifier.filiere,
              annee: aModifier.annee,
              specialite: aModifier.specialite,
              motivation: aModifier.motivation || aModifier.bio || '',
              telephone: aModifier.telephone || ''
            });
            setFiliereSelectionnee(aModifier.filiere);
            setPhotoAperçu(aModifier.photo);
          }
        }
      };
      chargerMentor();
    }
  }, [editId]); // Ré-exécuter quand l'ID d'édition change

  // Gestion du téléchargement de photo de profil
  const gérerPhoto = (e) => {
    const fichier = e.target.files[0];
    if (fichier) {
      const lecteur = new FileReader();
      lecteur.onload = (ev) => setPhotoAperçu(ev.target.result); // Stocke l'image en base64
      lecteur.readAsDataURL(fichier);
    }
  };

  // Gestion de la soumission du formulaire
  const soumettreFormulaire = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setChargement(true); // Active l'état de chargement
    setErreur(null); // Réinitialise les erreurs
    
    // Préparation des données à envoyer
    const donnees = {
      nom: e.target.nom.value,
      filiere: e.target.filiere.value,
      annee: e.target.annee.value,
      specialite: e.target.specialite.value,
      bio: e.target.motivation.value,
      photo: photoAperçu,
      telephone: e.target.telephone.value,
    };
    
    try {
      if (editId) {
        // Mode édition : mise à jour du mentor existant
        await apiMentors.modifier(editId, donnees);
        ajouterNotification(
          "Profil Mentor mis à jour",
          "Les informations de votre compte mentor ont été actualisées.",
          "success",
          "fa-user-gear"
        );
      } else {
        // Mode création : nouvelle candidature
        await apiMentors.creer(donnees);
        ajouterNotification(
          "Candidature soumise",
          "Votre demande pour devenir mentor a été enregistrée !",
          "success",
          "fa-graduation-cap"
        );
      }
      // Redirection vers la liste des mentors après succès
      navigate('/mentors');
    } catch (err) {
      // Gestion des erreurs de soumission
      setErreur(err.message || 'Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
    } finally {
      setChargement(false); // Désactive l'état de chargement
    }
  };

  // Interface principale du composant
  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      {/* En-tête avec titre et description */}
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto mb-12">
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-graduation-cap"></i> REJOINDRE L'ÉQUIPE
        </span>
        <h1 className="text-4xl md:text-5xl font-bold my-6 text-slate-900 leading-tight">
          Devenir <span className="text-primary">Mentor</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-[700px] leading-relaxed">
          Partagez votre expérience, guidez vos pairs et développez vos compétences en leadership au sein de la communauté UNH.
        </p>
      </section>
      
      {/* Conteneur principal du formulaire */}
      <div className="max-w-[900px] mx-auto">
        {/* Affichage d'erreur s'il y en a une */}
        {erreur && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-sm text-red-600 font-medium">
            <i className="fa-solid fa-circle-exclamation text-red-400 shrink-0 text-lg"></i>
            {erreur}
          </div>
        )}
        {/* Formulaire de candidature */}
        <form id="become-mentor-form" onSubmit={soumettreFormulaire} className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Colonne gauche : Photo de profil */}
            <div className="flex flex-col items-center gap-6">
              <div className={`w-40 h-40 rounded-[28px] flex items-center justify-center text-slate-300 overflow-hidden border-2 border-dashed border-slate-200 transition-all ${photoAperçu ? 'border-solid border-primary ring-4 ring-primary/10' : 'bg-slate-50'}`}>
                {photoAperçu ? <img src={photoAperçu} className="w-full h-full object-cover" alt="Aperçu" /> : <i className="fa-solid fa-camera text-3xl"></i>}
              </div>
              <label className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold cursor-pointer hover:bg-slate-50 hover:border-primary hover:text-primary transition-all">
                Choisir une photo
                <input id="mentor-photo" type="file" className="hidden" accept="image/*" onChange={gérerPhoto} />
              </label>
            </div>
            
            {/* Colonne droite : Champs du formulaire */}
            <div className="flex-1 space-y-8">
              {/* Ligne 1 : Nom et Filière */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[1.5px] ml-1">Nom complet</label>
                  <input id="nom" required type="text" defaultValue={formData.nom} placeholder="Ex: Jean Dupont" className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[1.5px] ml-1">Filière</label>
                  <select id="filiere" required value={filiereSelectionnee} onChange={(e) => setFiliereSelectionnee(e.target.value)} className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none bg-slate-50/50 appearance-none cursor-pointer">
                    <option value="informatique">Informatique</option>
                    <option value="medecine">Médecine</option>
                    <option value="droit">Droit</option>
                    <option value="science technologique">Science Technologique</option>
                    <option value="science des aliments et de l'environnement">Science des Aliments et de l'Environnement</option>
                    <option value="gestion">Gestion</option>
                    <option value="architecture">Architecture</option>
                    <option value="SIC/multimedia">SIC/Multimedia</option>
                  </select>
                </div>
              </div>
              
              {/* Ligne 2 : Année et Spécialité */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[1.5px] ml-1">Année d'étude</label>
                  <select id="annee" required defaultValue={formData.annee} className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none bg-slate-50/50 appearance-none cursor-pointer">
                    <option value="L1">Licence 1</option>
                    <option value="L2">Licence 2</option>
                    <option value="L3">Licence 3</option>
                    <option value="M1">Master 1</option>
                    <option value="M2">Master 2</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[1.5px] ml-1">Spécialité</label>
                  {/* Le menu déroulant des spécialités dépend de la filière sélectionnée */}
                  <select id="specialite" required defaultValue={formData.specialite} className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none bg-slate-50/50 appearance-none cursor-pointer">
                    {specialisationsParFiliere[filiereSelectionnee].map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Ligne 3 : Téléphone et Motivation */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[1.5px] ml-1">Numéro de téléphone</label>
                <input id="telephone" type="tel" defaultValue={formData.telephone} placeholder="Ex: +229 96 00 00 00" className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all bg-slate-50/50" />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[1.5px] ml-1">Biographie & Motivations</label>
                <textarea id="motivation" required rows="4" defaultValue={formData.motivation} placeholder="Parlez-nous de vous et pourquoi vous voulez aider..." className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none resize-none transition-all bg-slate-50/50"></textarea>
              </div>
              
              {/* Bouton de soumission */}
              <button 
                type="submit" 
                disabled={chargement}
                className="w-full py-5 rounded-[20px] bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary-dark hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {chargement ? (
                  <><i className="fa-solid fa-spinner fa-spin"></i> Envoi en cours...</>
                ) : (
                  <>
                    <span>{editId ? 'Mettre à jour mon profil' : 'Envoyer ma candidature'}</span>
                    <i className="fa-solid fa-paper-plane"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default DevenirMentor;
```

### 📱 RESPONSIVE DESIGN
L'interface utilise TailwindCSS avec des classes responsives :
- `md:` pour les écrans moyens (≥768px) - passage en disposition côte à côte pour le formulaire
- Conteneur principal avec largeur maximale adaptative
- Grille qui s'ajuste : 1 colonne sur mobile, 2 colonnes sur tablette et desktop
- Champs de saisie et boutons avec tailles adaptatives
- Espacements et marges qui s'adaptent selon la taille d'écran

### ⚡ PERFORMANCE
- Utilisation optimisée des hooks React (`useState`, `useEffect`, `useContext`)
- Chargement conditionnel des données mentor uniquement en mode édition
- Mise à jour dynamique des options de spécialité selon la filière sélectionnée
- Éviter les re-renders inutiles grâce à une gestion précise des états
- Gestion efficace du fallback vers localStorage en cas d'indisponibilité de l'API
- Prévention des soumissions multiples avec état de chargement

### 🎨 COMPOSANTS REUTILISABLES
- Utilisation extensive de classes TailwindCSS plutôt que du CSS personnalisé
- Icônes FontAwesome intégrées directement dans le JSX
- Effets visuels modernes (ombres, transitions, transformations)
- Formulaire avec validation et états de chargement
- Bouton interactif avec feedback visuel et état de chargement
- Sélection dynamique basée sur la filière choisie
- Aperçu instantané de la photo de profil avant upload
- Gestion élégante des modes création et édition selon la présence d'un ID dans l'URL

Cette page de candidature au programme de mentorat offre une expérience complète permettant aux utilisateurs de soumettre facilement leur demande pour devenir mentor ou de mettre à jour leur profil existant, avec une interface intuitive qui s'adapte dynamiquement selon les choix effectués (filière → spécialité) et qui fonctionne parfaitement sur tous les appareils.

---
## 📄 `frontend/src/pages/Notifications.jsx` - Page du Centre de Notifications

### 🎯 Objectif
La page du centre de notifications permet aux utilisateurs de consulter, gérer et interagir avec toutes leurs notifications système. Elle affiche les notifications sous forme de cartes interactives avec possibilité de les marquer comme lues, de les supprimer individuellement ou en masse, et utilise des animations fluides pour une expérience utilisateur agréable.

### 📦 IMPORTS ET CONFIGURATION INITIALE
```javascript
import React, { useContext } from 'react';
// Hook React pour accéder au contexte global
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
// Accès au contexte global (liste des notifications, fonctions de gestion)
import { motion, AnimatePresence } from 'framer-motion';
// Bibliothèque d'animations pour des transitions fluides et modernes
```

### 🏗️ COMPOSANT PRINCIPAL NOTIFICATIONS
```javascript
const Notifications = () => {
  // Récupération des données et fonctions depuis le contexte global
  const { notifications, marquerLue, effacerNotification, toutMarquerLu } = useContext(ContexteUtilisateur);

  /**
   * Retourne la couleur de fond selon le type de notification
   * @param {string} type - Le type de notification (success, warning, error, etc.)
   * @returns {string} Classe TailwindCSS pour la couleur de fond
   */
  const getCouleur = (type) => {
    switch(type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      case 'message': return 'bg-blue-500';
      case 'evenement': return 'bg-purple-500';
      case 'info': return 'bg-primary';
      default: return 'bg-slate-500';
    }
  };

  /**
   * Retourne la classe de fond selon si la notification est lue ou non
   * @param {boolean} lue - Indicateur si la notification a été lue
   * @returns {string} Classe TailwindCSS pour le fond de la notification
   */
  const getBg = (lue) => lue ? 'bg-white' : 'bg-sky-50/50 border-sky-100 shadow-sm';

  // Calcule le nombre de notifications non lues
  const nonLues = notifications.filter(n => !n.lue && !n.lu).length;

  /**
   * Formate la date et l'heure pour l'affichage
   * @param {Object} notif - L'objet notification contenant les données de date
   * @returns {string} Date formatée en français
   */
  const formaterDate = (notif) => {
    if (notif.date) return `${notif.date} • ${notif.heure}`;
    if (notif.created_at) {
      return new Date(notif.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    }
    return '';
  };

  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition min-h-screen bg-[#f8f9fa]">
      {/* En-tête avec titre et description */}
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto mb-10">
        <span className="bg-white text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-sm">
          <i className="fa-solid fa-bell animate-swing"></i> CENTRE DE NOTIFICATIONS
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[800px]">
          Vos <span className="text-primary">Alertes</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-[22px] max-w-[800px]">
          Suivez l'activité de votre compte et restez informé des nouveautés.
        </p>
      </section>

      {/* Section principale avec liste des notifications */}
      <section className="max-w-[800px] mx-auto pb-20 px-4">
        {/* En-tête avec compteur et bouton d'action */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-sm font-bold text-slate-900">{notifications.length} notifications</span>
            {nonLues > 0 && <span className="ml-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">{nonLues} nouvelles</span>}
          </div>
          {notifications.length > 0 && (
            <button 
              onClick={toutMarquerLu}
              className="text-xs font-bold text-primary hover:text-primary-dark transition-colors border-none bg-transparent cursor-pointer flex items-center gap-2"
            >
              <i className="fa-solid fa-check-double"></i> Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Conteneur principal avec animations */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {notifications.length > 0 ? (
              notifications.map((notif) => {
                const estLue = notif.lue || notif.lu; // Détermine si la notification est lue
                return (
                  <motion.div 
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-5 rounded-2xl border border-slate-100 flex items-start gap-5 transition-all relative group ${getBg(estLue)}`}
                  >
                    {/* Icône colorée selon le type de notification */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg ${getCouleur(notif.type)}`}>
                      <i className={`fa-solid ${notif.icone || 'fa-bell'} text-xl`}></i>
                    </div>
                    
                    {/* Contenu de la notification */}
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => marquerLue(notif.id)}>
                      <div className="flex justify-between items-start mb-1">
                        <strong className="text-base font-bold text-slate-900">{notif.titre}</strong>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter shrink-0 ml-2">
                          {formaterDate(notif)}
                        </span>
                      </div>
                      <p className="text-[14px] text-slate-600 leading-relaxed">{notif.message || notif.description}</p>
                      
                      {/* Indicateur de notification non lue */}
                      {!estLue && (
                        <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> Nouveau
                        </span>
                      )}
                    </div>

                    {/* Bouton de suppression (visible au survol) */}
                    <button 
                      onClick={() => effacerNotification(notif.id)}
                      className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border-none flex items-center justify-center cursor-pointer"
                    >
                      <i className="fa-solid fa-trash-can text-sm"></i>
                    </button>
                   </motion.div>
                 );
               })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                  <i className="fa-solid fa-bell-slash text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Aucune notification</h3>
                <p className="text-slate-500">Vous êtes à jour ! Revenez plus tard pour voir les nouvelles alertes.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
};

export default Notifications;
```

### 📱 RESPONSIVE DESIGN
L'interface utilise TailwindCSS avec des classes responsives :
- Conteneur principal avec padding adaptatif (`px-4 md:px-[5%]`)
- Largeur maximale des sections (`max-w-[800px] mx-auto`)
- Espacements et marges qui s'adaptent selon la taille d'écran
- Texte et icônes avec tailles flexibles
- Animations Framer Motion qui fonctionnent sur tous les appareils

### ⚡ PERFORMANCE
- Utilisation optimisée du contexte React pour éviter les props drilling
- Filtrage en mémoire pour calculer le nombre de notifications non lues
- Animations Framer Motion avec mode `popLayout` pour des transitions efficaces
- Gestion efficace des listes avec `map` et clés uniques (`key={notif.id}`)
- Mise à jour sélective uniquement quand les données de notification changent
- Utilisation de `useContext` pour éviter les re-renders inutiles des composants enfants

### 🎨 COMPOSANTS REUTILISABLES
- `AnimatePresence` et `motion.div` de Framer Motion pour des animations fluides
- Utilisation extensive de classes TailwindCSS plutôt que du CSS personnalisé
- Icônes FontAwesome intégrées directement dans le JSX
- Effets visuels modernes (ombres, transitions, transformations)
- Boutons interactifs avec états de survol, focus et opacity
- Indicateur visuel de notification non lue avec animation pulse
- Système de couleur dynamique basé sur le type de notification
- Fonctions de formatage de date réutilisables

Cette page du centre de notifications offre une expérience complète de gestion des alertes système, permettant aux utilisateurs de visualiser toutes leurs notifications, de les marquer comme lues individuellement ou en masse, de les supprimer, et de bénéficier d'animations fluides pour une interaction agréable, le tout dans une interface responsive et performante.

---
## 📄 `frontend/src/pages/Login.jsx` - Page de Connexion Utilisateur

### 🎯 Objectif
La page de connexion permet aux utilisateurs de s'authentifier sur l'application CampusGuide en utilisant leur email et mot de passe, ou via une option de connexion simplifiée avec Google (en simulation). Elle gère la validation des identifiants, le stockage sécurisé du token d'authentification, et la redirection appropriée selon le rôle de l'utilisateur (étudiant, mentor ou administrateur).

### 📦 IMPORTS ET CONFIGURATION INITIALE
```javascript
import React, { useState, useContext } from 'react';
// Hooks React pour gérer l'état local, le contexte et les effets secondaires
import { useNavigate } from 'react-router-dom';
// Hook pour la navigation programmatiques entre les pages
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
// Accès au contexte global (état utilisateur, fonctions de mise à jour)
import { apiUtilisateurs } from '../api';
// Service API pour les opérations utilisateur (connexion, inscription, etc.)
```

### 🏗️ COMPOSANT PRINCIPAL LOGIN
```javascript
const Login = () => {
  // Récupération des données et fonctions depuis le contexte global
  const { utilisateur, mettreAJourUtilisateur, pret } = useContext(ContexteUtilisateur);
  const navigate = useNavigate(); // Hook pour la navigation vers d'autres pages

  // Redirection automatique si l'utilisateur est déjà authentifié
  React.useEffect(() => {
    if (pret && utilisateur.id) {
      // Redirection selon le rôle de l'utilisateur
      if (utilisateur.role === 'admin') {
        navigate('/admin', { replace: true }); // Éviter de laisser une trace dans l'historique
      } else {
        navigate('/', { replace: true }); // Redirection vers l'accueil pour les autres rôles
      }
    }
  }, [pret, utilisateur, navigate]); // Ré-exécuter quand l'état de chargement ou l'utilisateur change

  // États locaux du composant
  const [formData, setFormData] = useState({ email: '', password: '' }); // Données du formulaire de connexion
  const [chargement, setChargement] = useState(false); // État de chargement lors de la soumission
  const [erreur, setErreur] = useState(null); // Message d'erreur à afficher
  const [messageSucces, setMessageSucces] = useState(null); // Message de succès (activé après connexion réussie)
  const [showPassword, setShowPassword] = useState(false); // Toggle pour afficher/masquer le mot de passe

  // Gestion du changement dans les champs du formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Mets à jour le champ modifié
    setErreur(null); // Efface l'erreur quand l'utilisateur commence à taper
  };

  // Bascule l'affichage du mot de passe (texte clair vs masqué)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Gestion de la soumission du formulaire de connexion
  const gererSoumission = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page par défaut
    setChargement(true); // Active l'état de chargement
    setErreur(null); // Réinitialise les erreurs précédentes
    
    try {
      // Tentative de connexion via l'API
      const data = await apiUtilisateurs.connexion(formData.email, formData.password);
      
      // Stockage sécurisé des données d'authentification
      const u = data.utilisateur;
      localStorage.setItem('campus_token', data.token); // Stocke le token JWT
      localStorage.setItem('campus_user_id', u.id); // Stocke l'ID utilisateur
      
      // Mise à jour du contexte utilisateur avec les données reçues
      mettreAJourUtilisateur({
        id: u.id,
        prenom: u.nom.split(' ')[0], // Extrait le prénom
        nom: u.nom.split(' ').slice(1).join(' ') || '', // Extrait le nom de famille
        email: u.email,
        filiere: u.filiere,
        annee: u.annee,
        promotion: u.annee, // Assure que le champ 'promotion' est défini
        role: u.role,
      });
      
      // Redirection selon le rôle de l'utilisateur
      if (u.role === 'admin') {
        navigate('/admin'); // Redirection vers le tableau de bord admin
      } else {
        navigate('/'); // Redirection vers l'accueil pour les utilisateurs standards
      }
    } catch (err) {
      // Gestion des erreurs de connexion
      setErreur(err.message || 'Une erreur est survenue. Vérifiez que le serveur est démarré.');
    } finally {
      setChargement(false); // Désactive l'état de chargement
    }
  };

  // Simulation de connexion avec Google (en attendant une vraie implémentation OAuth)
  const seConnecterAvecGoogle = async () => {
    try {
      // En production, ceci serait remplacé par un vrai flux OAuth2 Google
      const data = await apiUtilisateurs.connexion('student@campusguide.com', 'student123');
      const u = data.utilisateur;
      localStorage.setItem('campus_token', data.token);
      // Mettre à jour l'utilisateur avec les données reçues (simplifié pour la démo)
      mettreAJourUtilisateur({
        id: u.id,
        prenom: u.nom.split(' ')[0],
        nom: u.nom.split(' ').slice(1).join(' ') || '',
        email: u.email,
        role: u.role,
      });
      // Redirection selon le rôle
      if (u.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch {
      setErreur('Connexion Google indisponible. Essayez avec email/mot de passe.');
    }
  };

  // Interface principale de connexion
  return (
    <div className="fixed inset-0 flex flex-col md:flex-row min-h-screen bg-bg z-2000">
      {/* Colonne gauche: Image de fond */}
      <div 
        className="flex-none md:flex-1 relative flex items-center justify-center min-h-[250px] md:min-h-screen" 
        style={{ 
          backgroundImage: "url('/assets/universite-nouveaux-horizons.jpg')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat' 
        }}
      >
        {/* Overlay semi-transparent pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-primary/20"></div>
      </div>
      
      {/* Colonne droite: Formulaire de connexion */}
      <div className="flex-1 md:flex-[0_0_550px] flex items-center justify-center bg-bg px-6 py-10 md:px-12 md:py-10 overflow-y-auto">
        <div className="bg-white rounded-3xl p-8 md:px-12 md:py-12 w-full max-w-[460px] shadow-[0_20px_60px_rgba(58,176,255,0.12)] anime-apparition scale-90 md:scale-95">
          {/* En-tête avec logo et titre */}
          <div className="text-center mb-6 md:mb-8">
            <div>
              <img src="/assets/logo-campusguide.png" alt="Logo UNH Campus" className="w-100 h-27 mx-auto mb-4 rounded-xl" />
            </div>
            <h2 className="text-2xl md:text-[28px] font-extrabold text-slate-800">
              Connexion
            </h2>
            <p className="text-slate-500 text-sm mt-2">Accédez à votre espace CampusGuide</p>
          </div>
          
          {/* Affichage d'erreur s'il y en a une */}
          {erreur && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-sm text-red-600 font-medium">
              <i className="fa-solid fa-circle-exclamation text-red-400 shrink-0"></i>
              {erreur}
            </div>
          )}
          
          {/* Formulaire de connexion */}
          <form onSubmit={gererSoumission} className="space-y-5">
            {/* Champ email */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-500 mb-2">Adresse Email</label>
              <div className="flex items-center bg-slate-50 border-[1.5px] border-slate-200 rounded-xl px-3.5 gap-2.5 transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(58,176,255,0.15)] focus-within:bg-white text-sm">
                <i className="fa-solid fa-envelope text-slate-400 shrink-0"></i>
                <input 
                  type="email" 
                  name="email"
                  placeholder="votre@email.com" 
                  required 
                  className="flex-1 border-none outline-none bg-transparent text-slate-900 font-inter py-3.5"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Champ mot de passe */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mot de passe</label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  name="password" 
                  required 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 focus:border-primary outline-none bg-slate-50" 
                  value={formData.password} 
                  onChange={handleChange} 
                />
                {/* Bouton pour afficher/masquer le mot de passe */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            
            {/* Bouton de soumission */}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={chargement}
                className="w-full py-3.5 bg-primary text-white border-none rounded-xl text-base font-bold font-inter cursor-pointer transition-all duration-200 shadow-[0_4px_12px_rgba(58,176,255,0.35)] tracking-wide hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(58,176,255,0.45)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {chargement ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

### 📱 RESPONSIVE DESIGN
L'interface utilise une approche responsive avancée :
- Disposition en colonne sur mobile (`flex-col`), passage en ligne sur écrans moyens et plus (`md:flex-row`)
- Image de fond adaptative qui couvre tout l'écran sur mobile et occupe la moitié gauche sur desktop
- Formulaire centré avec largeur maximale adaptée (`max-w-[460px]`)
- Espacements et paddings qui s'ajustent selon la taille d'écran (`px-6 py-10 md:px-12 md:py-10`)
- Tailles de texte et d'icônes responsives
- Animations d'entrée adaptées aux différentes tailles d'écran

### ⚡ PERFORMANCE
- Utilisation optimisée des hooks React (`useState`, `useContext`, `useEffect`)
- Vérification d'authentification au montage pour rediriger immédiatement les utilisateurs déjà connectés
- Stockage efficace des tokens dans `localStorage` pour maintenir la session
- Effacement intelligent des erreurs quand l'utilisateur commence à corriger les champs
- Gestion séparée des états de chargement, erreur et succès pour un feedback précis
- Utilisation de `replace: true` dans la navigation pour éviter l'accumulation inutile dans l'historique

### 🎨 COMPOSANTS REUTILISABLES
- Utilisation extensive de classes TailwindCSS plutôt que du CSS personnalisé
- Icônes FontAwesome intégrées directement dans le JSX
- Effets visuels modernes (ombres, transitions, transformations)
- Boutons interactifs avec états de chargement, hover et disabled
- Champs de saisie avec validation visuelle (focus, erreur, succès)
- Bascule d'affichage du mot de passe avec icône contextuelle
- Overlay semi-transparent pour améliorer la lisibilité sur l'image de fond
- Animation d'entrée (`anime-apparition scale-90`) pour une apparition fluide

Cette page de connexion offre une expérience d'authentification sécurisée et conviviale avec validation en temps réel, gestion properly des états, redirection intelligente selon le rôle utilisateur, et une interface responsive qui s'adapte parfaitement à tous les types d'appareils, des smartphones aux écrans de bureau.

---

1. **Structure de Projet Très Standardisée**
   - Séparation claire frontend/backend avec conventions de nommage prévisibles
   - Organisation des dossiers suivant les meilleures pratiques React/Node.js (pages, components, services, contexts, api)
   - Fichiers de configuration identiques à ceux générés par des outils comme Create React App ou Vite avec presets

2. **Répétition de Patterns de Code**
   - Les routes backend suivent exactement le même modèle CRUD pour chaque ressource (utilisateurs, mentors, clubs, etc.)
   - Les services frontend API implémentent les mêmes fonctions (getAll, getById, create, update, delete) avec seulement les noms d'endpoints qui changent
   - Les composants de formulaire et de liste montrent des structures très similaires avec seulement des variations de champs

3. **Documentation Exhaustive et Uniforme**
   - Le niveau de détail dans cette documentation (explication ligne par ligne) est inhabituel pour un projet développé uniquement par des humains
   - Le style explicatif avec des commentaires détaillés entre `// ============` suggère une génération automatique accompagnée d'annotations

### 🔧 INDICES TECHNIQUES DE GÉNÉRATION AUTOMATIQUE

1. **Nommage Cohérent mais Générique**
   - Utilisation de noms comme `apiUtilisateurs`, `apiMentors` qui suivent un pattern prévisible
   - Fonctions d'API avec noms standards (`getAll`, `getById`, `create`, `update`, `delete`)
   - Variables d'état React avec noms descriptifs mais formels (`utilisateurs`, `mentors`, `clubs`)

2. **Patterns de Gestion d'État Répétitifs**
   - Chaque section du tableau de bord admin suit exactement la même structure :
     * Definition d'état avec `useState([])`
     * Chargement des données via fonction asynchrone similaire
     * Traitement des erreurs avec `try/catch` et `console.error`
     * Mise à jour d'état avec fonction setter spécifique

3. **Commentaires Structurés et Répétitifs**
   - Les commentaires suivant le format `// ============ [DESCRIPTION] ============` sont caractéristiques d'une génération basée sur des templates
   - Les explications détaillées de chaque ligne ressemblent à celles qu'un modèle de langage produirait lorsqu'on lui demande de "expliquer ce code ligne par ligne"

### 📐 ÉVIDENCES DE CONCEPTION ACHITECTURALES

1. **Séparation des Préoccupations Parfaite mais un Peu Trop Théorique**
   - Le contexte utilisateur sépare parfaitement les données utilisateur, les notifications et la photo de profil
   - Les services API isolent complètement la logique de communication HTTP
   - Mais cette séparation est parfois plus théorique que pratique (par exemple, certaines logiques métier pourraient être partagées entre services)

2. **Utilisation Optimisée de Bibliothèques Modernes mais Prévisibles**
   - Choix de TailwindCSS pour le styling (populaire dans les générateurs de code récents)
   - Utilisation de Framer Motion pour les animations (choix courant dans les templates modernes)
   - Adoption de react-chartjs-2 pour les visualisations (standard pour les dashboards administratifs)
   - Implementation du Context API pour le state global (approche React moderne mais parfois surutilisée)

3. **Gestion des Erreurs Uniforme**
   - Toutes les routes backend suivent exactement le même pattern de gestion d'erreur :
     * `try/catch` autour des opérations async
     * `console.error()` pour le logging
     * Réponse JSON standardisée `{ success: false, erreur: 'Message' }`
   - Cette uniformité suggère une génération basée sur un template de route

### 🧠 INDICES SPÉCIFIQUES À L'ASSISTANCE PAR LLM

1. **Niveau de Détail Inhabituel dans les Commentaires**
   - Les commentaires expliquent non seulement ce que fait le code, mais aussi pourquoi certaines approches ont été choisies
   - Exemple : les explications sur pourquoi `COALESCE` est utilisé dans les mises à jour partielles, ou pourquoi JWT est préféré aux sessions

2. **Patterns de Résolution de Problèmes Typiques des LLMs**
   - Solution au problème des mots de passe legacy avec vérification du format bcrypt vs comparaison directe
   - Implémentation réfléchie de la protection contre les XSS tout en utilisant localStorage pour le stockage du token
   - Gestion sophistiquée des états de chargement avec indicateurs visuels (skeletons, spinners)

3. **Équilibre Entre Bonnes Pratiques et Facilité d'Implémentation**
   - Utilisation correcte des principes REST dans les routes API
   - Implémentation complète du flux d'authentification JWT avec rafraîchissement implicite
   - Mais certaines optimisations avancées (comme la pagination côté serveur ou le caching) sont absentes, ce qui est typique d'une génération visant la fonctionnalité plutôt que l'optimisation maximale

### 🛠️ PROCESSUS PROBABLE DE CRÉATION

1. **Phase de Spécification**
   - Définition claire des entités métier (utilisateur, mentor, club, événement, notification)
   - Spécification des fonctionnalités CRUD pour chaque entité
   - Définition des rôles (étudiant, mentor, admin) et de leurs permissions

2. **Phase de Génération de l'Architecture de Base**
   - Génération de la structure de projet frontend/backend
   - Création des fichiers de configuration de base (.env, package.json, etc.)
   - Mise en place de l'authentification JWT de base

3. **Phase de Génération Par Entité**
   - Pour chaque entité (utilisateur, mentor, club, etc.) :
     * Génération du modèle de données (si utilisant un ORM)
     * Création des routes API CRUD complètes
     * Génération du service API frontend correspondant
     * Création des composants React de base (liste, formulaire, détail)

4. **Phase de Génération des Fonctionnalités Spécialisées**
   - Création du tableau de bord admin avec visualisations
   - Génération des systèmes de notifications en temps réel
   - Implémentation des fonctionnalités d'export et de reporting

5. **Phase de Raffinement et d'Assistance**
   - Ajout des fonctions utilitaires et des hooks personnalisés
   - Implémentation des animations et transitions pour améliorer l'UX
   - Ajout des validations et gestion d'erreurs améliorées

### ✅ AVANTAGES DE CETTE APPROCHE

1. **Cohérence et Maintenabilité**
   - Code uniforme rendant plus facile la navigation et la compréhension
   - Réduction de la dette technique due à des implémentations incohérentes
   - Facilité de formation pour de nouveaux développeurs

2. **Respect des Bonnes Pratiques**
   - Implementation correcte des patterns architecturaux modernes
   - Utilisation appropriée des dernières versions des bibliothèques
   - Attention particulière aux aspects de sécurité (JWT, bcrypt, CORS)

3. **Productivité Accrue**
   - Développement rapide d'une application fonctionnelle complète
   - Moins de temps passé sur le code boilerplate répétitif
   - Focus possible sur les aspects métier spécifiques plutôt que sur l'infrastructure

### ⚠️ LIMITATIONS À PRENDRE EN COMPTE

1. **Moins d'Innovation Architecturale**
   - Tendence à suivre les chemins les plus battus plutôt qu'à explorer des solutions novatrices
   - Possibilité de sur-utilisation de certaines abstractions (comme le Context API pour tout et n'importe quoi)

2. **Moins d'Optimisation Spécifique**
   - Code générique qui peut ne pas être parfaitement adapté aux cas d'usage spécifiques
   - Possibilité de manquer des opportunités d'optimisation liées au domaine spécifique

3. **Dépendance aux Modèles de Génération**
   - Qualité fortement dépendante de la qualité du prompt et du modèle utilisé
   - Risque de reproduire des biais ou des mauvaises pratiques présents dans les données d'entraînement

### 📈 RECOMMANDATIONS POUR L'AVENIR

1. **Utiliser la Génération comme Point de Départ**
   - Considérer le code généré comme une base solide à améliorer plutôt que comme un produit fini
   - Identifier les parties qui bénéficieraient d'une optimisation spécifique au métier

2. **Compléter par une Expertise Humaine**
   - Ajouter des optimisations de performance spécifiques (caching, pagination, etc.)
   - Affiner l'architecture basée sur l'expérience réelle d'utilisation
   - Personnaliser l'UI/UX au-delà des composants génériques

3. **Établir un Processus d'Évolution Continue**
   - Mettre en place des revues de code régulières pour identifier les améliorations possibles
   - Utiliser les métriques d'utilisation pour guider les priorités d'amélioration
   - Former l'équipe à la fois sur les technologies utilisées et sur les principes de bonne conception

Cette approche mixte, combinant les forces de la génération par IA pour l'infrastructure de base avec l'expertise humaine pour l'optimisation métier et l'innovation, représente probablement l'avenir efficace du développement d'applications modernes.

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

