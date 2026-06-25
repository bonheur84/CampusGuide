# 🎓 CampusGuide

**Plateforme complète de gestion universitaire** - Application fullstack pour faciliter la vie étudiante avec des fonctionnalités de mentorat, clubs, événements et orientation.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-18%2B-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.5-61DAFB.svg)

## 📋 Table des matières

- [Description](#-description)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture du projet](#-architecture-du-projet)
- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement de l'application](#-lancement-de-lapplication)
- [Structure de la base de données](#-structure-de-la-base-de-données)
- [API Endpoints](#-api-endpoints)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)
- [Licence](#-licence)

## 📖 Description

CampusGuide est une application web fullstack moderne conçue pour les universités. Elle permet aux étudiants de:
- Trouver des mentors pour leur orientation académique
- Découvrir et rejoindre des clubs et associations
- Participer à des événements campus
- Gérer leur profil et leurs compétences
- Recevoir des notifications en temps réel

L'application utilise une architecture moderne avec React pour le frontend, Node.js/Express pour le backend, et MySQL pour la base de données.

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- Inscription et connexion utilisateur
- Authentification JWT (JSON Web Token)
- Protection des routes avec middleware
- Gestion des rôles (étudiant, mentor, admin)

### 👥 Gestion des utilisateurs
- Création et modification de profils
- Upload d'avatar
- Gestion des compétences
- Système de notation et avis

### 🎯 Système de Mentorat
- Recherche de mentors par compétence
- Profils détaillés des mentors
- Demande de mentorat
- Système de notation des mentors

### 🏆 Clubs & Associations
- Liste des clubs disponibles
- Inscription aux clubs
- Système de notation des clubs
- Gestion des compétences par club

### 📅 Événements Campus
- Calendrier des événements
- Inscription aux événements
- Notifications d'événements

### 🔔 Notifications en temps réel
- Socket.io pour les notifications live
- Notifications d'événements
- Alertes système

### 📱 Interface utilisateur
- Design moderne avec TailwindCSS
- Animations avec Framer Motion
- Navigation fluide avec React Router
- Support hors-ligne (PWA)
- Interface responsive

### 📊 Dashboard Admin
- Gestion des utilisateurs
- Statistiques et analytics
- Modération du contenu

## 🏗️ Architecture du projet

```
CampusGuide/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── config/         # Configuration base de données
│   │   ├── database/       # Scripts SQL
│   │   ├── middleware/     # Middlewares d'authentification
│   │   ├── routes/         # Routes API
│   │   │   ├── mentors.js
│   │   │   ├── clubs.js
│   │   │   ├── utilisateurs.js
│   │   │   ├── notifications.js
│   │   │   └── evenements.js
│   │   └── server.js       # Point d'entrée serveur

├── frontend/               # Application React
│   ├── src/
│   │   ├── api/           # Services API
│   │   ├── components/    # Composants React
│   │   ├── contexte/      # Context API
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services utilitaires
│   │   ├── App.jsx        # Composant principal
│   │   └── main.jsx       # Point d'entrée
│   ├── public/            # Fichiers statiques
│   └── index.html

├── .env.example           # Exemple de configuration
├── .gitignore
├── package.json           # Scripts racine
└── README.md
```

## 🛠️ Technologies utilisées

### Backend
- **Node.js** (18+) - Runtime JavaScript
- **Express.js** (4.18.2) - Framework web
- **MySQL** (3.22.3) - Base de données relationnelle
- **JWT** (9.0.3) - Authentification
- **bcryptjs** (3.0.3) - Hashage des mots de passe
- **Socket.io** (4.8.3) - WebSockets pour notifications
- **Multer** (2.1.1) - Upload de fichiers
- **CORS** (2.8.5) - Gestion CORS
- **dotenv** (17.4.2) - Variables d'environnement

### Frontend
- **React** (19.2.5) - Bibliothèque UI
- **Vite** (8.0.10) - Build tool
- **React Router** (7.14.2) - Routing
- **TailwindCSS** (4.2.2) - Framework CSS
- **Framer Motion** (12.38.0) - Animations
- **Lucide React** (1.14.0) - Icônes
- **Chart.js** (4.5.1) - Graphiques
- **Socket.io-client** (4.8.3) - Client WebSocket
- **vite-plugin-pwa** (1.3.0) - Support PWA

### Développement
- **Nodemon** - Hot reload backend
- **Concurrently** - Exécution parallèle

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé:

- **Node.js** (version 18 ou supérieure)
- **MySQL** (version 8.0 ou supérieure)
- **npm** ou **yarn** (gestionnaire de paquets)
- **Git** (pour le versionnage)

Vérifiez vos versions:
```bash
node --version
mysql --version
npm --version
git --version
```

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/bonheur84/CampusGuide.git
cd CampusGuide
```

### 2. Installer les dépendances

Le projet inclut un script pour installer toutes les dépendances:

```bash
npm run install-all
```

Ou manuellement:

```bash
# Installer les dépendances racine
npm install

# Installer les dépendances backend
cd backend
npm install

# Installer les dépendances frontend
cd ../frontend
npm install
```

### 3. Configurer la base de données

Créez une base de données MySQL:

```sql
CREATE DATABASE campusguide;
```

Exécutez les scripts de migration situés dans `backend/src/database/` pour créer les tables nécessaires.

## ⚙️ Configuration

### 1. Variables d'environnement

Copiez le fichier `.env.example` et renommez-le en `.env`:

```bash
cp .env.example .env
```

### 2. Configurer les variables

Éditez le fichier `.env` avec vos configurations:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=campusguide

# JWT Secret
JWT_SECRET=votre_cle_secrete_jwt_tres_longue_et_securisee

# Frontend URL (pour CORS)
FRONTEND_URL=http://localhost:5173

# API URL (pour frontend)
VITE_API_URL=http://localhost:3001/api
```

### 3. Sécurité

- **IMPORTANT**: Changez le `JWT_SECRET` par une chaîne aléatoire longue et sécurisée
- Utilisez un mot de passe MySQL fort
- En production, utilisez des variables d'environnement sécurisées

## 🎮 Lancement de l'application

### Mode développement

Lancez le backend et le frontend simultanément:

```bash
npm start
```

Ou séparément:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

L'application sera accessible:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Mode production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🗄️ Structure de la base de données

### Tables principales

- **utilisateurs** - Informations des utilisateurs
- **mentors** - Profils des mentors
- **clubs** - Informations des clubs
- **evenements** - Événements campus
- **notifications** - Notifications utilisateurs
- **competences** - Compétences des utilisateurs
- **ratings_clubs** - Notations des clubs

### Schéma simplifié

```sql
-- Utilisateurs
CREATE TABLE utilisateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    mot_de_passe VARCHAR(255),
    role ENUM('etudiant', 'mentor', 'admin'),
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mentors
CREATE TABLE mentors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utilisateur_id INT,
    specialite VARCHAR(100),
    bio TEXT,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- Clubs
CREATE TABLE clubs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100),
    description TEXT,
    categorie VARCHAR(50)
);

-- Événements
CREATE TABLE evenements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(200),
    description TEXT,
    date_evenement DATETIME,
    lieu VARCHAR(100)
);
```

## 🔌 API Endpoints

### Authentification
- `POST /api/utilisateurs/register` - Inscription
- `POST /api/utilisateurs/login` - Connexion
- `GET /api/utilisateurs/profil` - Profil utilisateur

### Mentors
- `GET /api/mentors` - Liste des mentors
- `GET /api/mentors/:id` - Détails d'un mentor
- `POST /api/mentors` - Créer un profil mentor
- `PUT /api/mentors/:id` - Modifier un mentor

### Clubs
- `GET /api/clubs` - Liste des clubs
- `GET /api/clubs/:id` - Détails d'un club
- `POST /api/clubs` - Créer un club
- `POST /api/clubs/:id/rating` - Noter un club

### Événements
- `GET /api/evenements` - Liste des événements
- `GET /api/evenements/:id` - Détails d'un événement
- `POST /api/evenements` - Créer un événement

### Notifications
- `GET /api/notifications` - Liste des notifications
- `PUT /api/notifications/:id` - Marquer comme lu

## 🌐 Déploiement

### Backend (Production)

Déployez le backend sur:
- **Heroku**
- **Railway**
- **Render**
- **VPS personnel**

Étapes:
1. Configurez les variables d'environnement
2. Build et push du code
3. Exécutez `npm start`

### Frontend (Production)

Déployez le frontend sur:
- **Vercel** (recommandé pour React)
- **Netlify**
- **GitHub Pages**

Étapes:
1. Configurez `VITE_API_URL` avec l'URL de production du backend
2. Build: `npm run build`
3. Déployez le dossier `dist`

### Base de données

Utilisez:
- **PlanetScale** (MySQL serverless)
- **AWS RDS**
- **Google Cloud SQL**
- **Railway MySQL**

## 🤝 Contribution

Les contributions sont les bienvenues! Voici comment contribuer:

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Guidelines de contribution
- Respectez le style de code existant
- Ajoutez des tests pour les nouvelles fonctionnalités
- Mettez à jour la documentation si nécessaire
- Assurez-vous que les tests passent

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 👥 Auteurs

- **Bonheur** - Développeur principal
- **Université Nouveaux Horizons** - Client

## 🙏 Remerciements

- À l'équipe de l'Université Nouveaux Horizons
- À la communauté open source
- À tous les contributeurs

## 📞 Support

Pour toute question ou support:
- Email: support@campusguide.com
- Issues GitHub: [Créer une issue](https://github.com/bonheur84/CampusGuide/issues)

## 🔮 Roadmap

- [ ] Intégration complète du système de chat
- [ ] Module de cours en ligne
- [ ] Application mobile (React Native)
- [ ] Système de paiements
- [ ] Analytics avancés
- [ ] Multi-langues

---

**Développé avec ❤️ pour les étudiants**
