# RAPPORT DE PROJET
## CampusGuide - Plateforme d'Accompagnement Étudiant

**Auteur :** Bonheur Nzau  
**Filière :** Informatique  
**Université :** Université Nouveaux Horizons (UNH)  
**Année Académique :** 2025-2026

---

## TABLE DES MATIÈRES

1. [Introduction](#1-introduction)
2. [Problématique](#2-problématique)
3. [Objectifs du Projet](#3-objectifs-du-projet)
4. [Analyse des Besoins](#4-analyse-des-besoins)
5. [Architecture Technique](#5-architecture-technique)
6. [Fonctionnalités](#6-fonctionnalités)
7. [Technologies Utilisées](#7-technologies-utilisées)
8. [Sécurité](#8-sécurité)
9. [Base de Données](#9-base-de-données)
10. [Déploiement](#10-déploiement)
11. [Conclusion](#11-conclusion)

---

## 1. INTRODUCTION

CampusGuide est une application web Full-Stack conçue et développée pour améliorer l'expérience des étudiants de l'Université Nouveaux Horizons (UNH). Cette plateforme centralise l'ensemble des informations et services nécessaires à la vie universitaire en un seul endroit accessible.

Ce projet répond à un besoin réel identifié sur le campus : l'information est dispersée entre panneaux d'affichage, emails, groupes WhatsApp et communications orales, rendant difficile l'accès aux ressources essentielles pour les étudiants, notamment les nouveaux arrivants.

CampusGuide propose une solution moderne, intuitive et sécurisée qui permet aux étudiants de :
- Se repérer facilement sur le campus
- Accéder au calendrier académique en temps réel
- Bénéficier d'un système de mentorat
- Découvrir et rejoindre les clubs étudiants
- Gérer leur profil universitaire

---

## 2. PROBLÉMATIQUE

### 2.1 Contexte

L'Université Nouveaux Horizons accueille chaque année de nouveaux étudiants qui font face à plusieurs défis :

- **Difficulté d'orientation :** Les salles de cours, laboratoires et bureaux administratifs sont répartis sur plusieurs bâtiments (UNH 1, UNH 2, UNH 3). Les plans existants sont souvent peu clairs ou obsolètes.
- **Manque d'information centralisée :** Les événements, examens et annonces sont communiqués via différents canaux non synchronisés.
- **Isolement des nouveaux étudiants :** L'absence d'un système structuré de mentorat rend l'intégration difficile.
- **Visibilité limitée des clubs :** Les associations étudiantes peinent à faire connaître leurs activités et recruter de nouveaux membres.

### 2.2 Problème Technique

Actuellement, aucune solution numérique unifiée n'existe pour répondre à ces besoins. Les informations sont gérées manuellement, ce qui entraîne :
- Perte d'information
- Délais de communication
- Erreurs humaines
- Difficulté de mise à jour

---

## 3. OBJECTIFS DU PROJET

### 3.1 Objectif Principal

Développer une plateforme web centralisée qui facilite l'intégration et l'organisation des étudiants de l'UNH.

### 3.2 Objectifs Spécifiques

1. **Créer un plan interactif du campus** avec photos réelles et itinéraires détaillés
2. **Développer un calendrier académique dynamique** avec système d'inscription aux événements
3. **Implémenter un système de mentorat** connectant étudiants juniors et seniors
4. **Créer un annuaire des clubs étudiants** avec fonctionnalité d'adhésion
5. **Assurer la sécurité des données** avec authentification robuste et isolation des comptes
6. **Proposer une interface responsive** adaptée aux mobiles et ordinateurs

---

## 4. ANALYSE DES BESOINS

### 4.1 Acteurs Identifiés

| Acteur | Rôle | Besoins |
|--------|------|---------|
| **Étudiant** | Utilisateur principal | Accéder aux informations, s'orienter, s'inscrire aux événements, trouver un mentor |
| **Administrateur** | Gestionnaire | Gérer les comptes, valider les mentors, modérer les événements |
| **Mentor** | Étudiant expérimenté | Partager son expertise, aider les juniors |
| **Responsable de club** | Animateur | Promouvoir les activités, gérer les adhésions |

### 4.2 Cas d'Utilisation Principaux

#### 4.2.1 Consultation du Plan du Campus
- L'étudiant sélectionne un bâtiment
- Il recherche une salle spécifique
- Il visualise la photo de la salle
- Il suit l'itinéraire indiqué

#### 4.2.2 Inscription à un Événement
- L'étudiant consulte le calendrier
- Il sélectionne un événement
- Il clique sur "S'inscrire"
- Le système confirme son inscription

#### 4.2.3 Recherche d'un Mentor
- L'étudiant filtre par filière
- Il consulte les profils disponibles
- Il contacte un mentor

#### 4.2.4 Gestion Administrative
- L'admin consulte la liste des utilisateurs
- Il modifie les informations si nécessaire
- Il valide les demandes de mentorat

---

## 5. ARCHITECTURE TECHNIQUE

### 5.1 Architecture Globale

CampusGuide adopte une architecture **Full-Stack** séparée en trois couches :

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Client)                     │
│  React.js + Vite + TailwindCSS + React Router           │
│  Interface utilisateur interactive et responsive         │
└────────────────────┬────────────────────────────────────┘
                     │ API REST (HTTP/JSON)
                     │
┌────────────────────▼────────────────────────────────────┐
│                     BACKEND (Serveur)                    │
│  Node.js + Express.js + JWT + Bcrypt                    │
│  Logique métier, sécurité, gestion des requêtes         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 BASE DE DONNÉES                          │
│  MySQL (Relationnelle)                                  │
│  Stockage persistant des données                         │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Architecture du Frontend

Le frontend est organisé en composants modulaires :

- **Pages :** Accueil, Login, Campus, Calendrier, Mentors, Clubs, Profil, Admin
- **Composants réutilisables :** Navigation, Cartes, Formulaires, Modales
- **Contexte :** Gestion de l'état utilisateur global
- **API :** Couche d'abstraction pour les requêtes HTTP

### 5.3 Architecture du Backend

Le backend suit le pattern **MVC (Model-View-Controller)** :

- **Routes :** Définition des endpoints API
- **Contrôleurs :** Logique métier
- **Modèles :** Interaction avec la base de données
- **Middlewares :** Authentification, validation, gestion d'erreurs

---

## 6. FONCTIONNALITÉS

### 6.1 Plan Interactif du Campus

**Description :** Visualisation complète des bâtiments et salles de l'UNH.

**Fonctionnalités :**
- Navigation par bâtiment (UNH 1, UNH 2, UNH 3)
- Recherche de salles par nom ou type
- Fiches détaillées avec :
  - Photo réelle de la salle
  - Capacité d'accueil
  - Équipements disponibles
  - Itinéraire précis depuis l'entrée
- Filtrage par type (salles de cours, laboratoires, bureaux, amphithéâtres)

**Avantages :**
- Réduit le temps de recherche
- Élimine le stress d'orientation
- Facilite l'intégration des nouveaux étudiants

### 6.2 Calendrier Académique

**Description :** Gestion dynamique des événements universitaires.

**Fonctionnalités :**
- Affichage en temps réel des événements
- Filtrage par catégorie (examens, congés, événements étudiants)
- Inscription aux événements en un clic
- Notifications des nouveaux événements
- Interface administrative pour créer/modifier/supprimer des événements

**Avantages :**
- Centralisation de l'information
- Réduction des absences aux événements importants
- Communication instantanée

### 6.3 Système de Mentorat

**Description :** Mise en relation entre étudiants juniors et seniors.

**Fonctionnalités :**
- Annuaire des mentors par filière
- Profils détaillés (spécialisation, bio, disponibilité)
- Candidature spontanée pour devenir mentor
- Validation administrative des mentors
- Recherche avancée (filière, spécialité)

**Avantages :**
- Facilite l'entraide entre étudiants
- Améliore la réussite académique
- Renforce le sentiment d'appartenance

### 6.4 Annuaire des Clubs

**Description :** Répertoire dynamique des associations étudiantes.

**Fonctionnalités :**
- Liste des clubs par catégorie (sport, culture, science, etc.)
- Descriptions détaillées et photos
- Compteur de membres
- Adhésion en un clic
- Recherche par nom ou catégorie

**Avantages :**
- Augmente la visibilité des clubs
- Facilite le recrutement
- Encourage la vie associative

### 6.5 Gestion de Profil

**Description :** Espace personnel de l'étudiant.

**Fonctionnalités :**
- Modification des informations personnelles
- Upload de photo de profil avec compression automatique
- Changement de mot de passe sécurisé
- Historique des activités
- Isolation complète des données par compte

**Avantages :**
- Autonomie de l'étudiant
- Sécurité des données personnelles
- Personnalisation de l'expérience

### 6.6 Tableau de Bord Administrateur

**Description :** Interface de gestion pour le personnel administratif.

**Fonctionnalités :**
- Gestion des comptes utilisateurs (CRUD)
- Validation des demandes de mentorat
- Création et suppression d'événements
- Statistiques d'utilisation
- Accès restreint par authentification

**Avantages :**
- Contrôle total sur la plateforme
- Modération des contenus
- Adaptation rapide aux besoins

---

## 7. TECHNOLOGIES UTILISÉES

### 7.1 Frontend

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **React.js** | 19.2.5 | Framework JavaScript pour interfaces dynamiques |
| **Vite** | 8.0.10 | Outil de build ultra-rapide et moderne |
| **TailwindCSS** | 4.2.4 | Framework CSS pour design responsive |
| **React Router** | 7.14.2 | Gestion de la navigation SPA |
| **Framer Motion** | 12.38.0 | Animations fluides et interactives |
| **Lucide React** | 1.14.0 | Bibliothèque d'icônes modernes |
| **Socket.io Client** | 4.8.3 | Communication temps réel (notifications) |

### 7.2 Backend

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **Node.js** | - | Environnement JavaScript côté serveur |
| **Express.js** | 4.18.2 | Framework pour APIs REST |
| **MySQL2** | 3.22.3 | Driver de base de données MySQL |
| **JWT** | 9.0.3 | Authentification par token |
| **Bcrypt** | 3.0.3 | Chiffrement des mots de passe |
| **CORS** | 2.8.5 | Gestion des requêtes cross-origin |
| **Multer** | 2.1.1 | Upload de fichiers |
| **Socket.io** | 4.8.3 | Communication temps réel |
| **Dotenv** | 17.4.2 | Gestion des variables d'environnement |

### 7.3 Outils de Développement

- **Git :** Gestion de version
- **NPM :** Gestion des dépendances
- **Nodemon :** Rechargement automatique en développement
- **Vercel :** Plateforme de déploiement cloud

---

## 8. SÉCURITÉ

### 8.1 Authentification

**JWT (JSON Web Token)**
- Génération d'un token unique lors de la connexion
- Stockage côté client (localStorage)
- Validation automatique à chaque requête protégée
- Expiration configurable pour renouvellement

**Avantages :**
- Pas de stockage de session côté serveur
- Scalabilité améliorée
- Sécurité renforcée

### 8.2 Chiffrement des Mots de Passe

**Bcrypt**
- Algorithme de hachage unidirectionnel
- 12 rounds de salage pour résistance aux attaques brute-force
- Impossible de déchiffrer les mots de passe originaux
- Comparaison sécurisée lors de la connexion

**Exemple :**
```
Mot de passe : campus123
Après Bcrypt : $2b$12$e8Y9k2M3n4O5p6Q7r8S9T0u1V2w3X4y5Z6a7B8c9D0e1F2g3H4i5J6k7L8m9N0
```

### 8.3 Isolation des Données

- Chaque utilisateur ne peut accéder qu'à ses propres données
- Les requêtes API vérifient systématiquement l'identité du demandeur
- Les rôles (étudiant/admin) définissent les permissions
- Aucune fuite de données entre comptes

### 8.4 Protection CORS

- Configuration stricte des origines autorisées
- Validation des en-têtes HTTP
- Protection contre les requêtes cross-origin malveillantes

---

## 9. BASE DE DONNÉES

### 9.1 Structure

La base de données MySQL est organisée en tables relationnelles :

| Table | Description |
|-------|-------------|
| **utilisateurs** | Comptes étudiants et administrateurs |
| **mentors** | Profils des mentors |
| **clubs** | Informations sur les clubs |
| **evenements** | Calendrier des événements |
| **notifications** | Alertes utilisateurs |
| **messages** | Messagerie interne |

### 9.2 Schéma Simplifié

```sql
-- Table utilisateurs
CREATE TABLE utilisateurs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,
  filiere VARCHAR(100),
  annee VARCHAR(50),
  role ENUM('etudiant', 'admin') DEFAULT 'etudiant',
  photo_profil VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table mentors
CREATE TABLE mentors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  utilisateur_id INT,
  specialite VARCHAR(255),
  bio TEXT,
  statut ENUM('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- Table evenements
CREATE TABLE evenements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  date_evenement DATETIME,
  categorie VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9.3 Avantages de MySQL

- **Fiabilité :** Système éprouvé et robuste
- **Performance :** Optimisé pour les requêtes relationnelles
- **Scalabilité :** Supporte de grandes quantités de données
- **Sécurité :** Gestion native des permissions et transactions

---

## 10. DÉPLOIEMENT

### 10.1 Architecture de Déploiement

```
┌─────────────────────────────────────────────────┐
│              VERCEL (Cloud)                     │
│  • Frontend : React build statique              │
│  • Backend : Serverless Functions               │
│  • Base de données : MySQL externe              │
└─────────────────────────────────────────────────┘
           │
           ▼
    https://campus-guide-cd.vercel.app
```

### 10.2 Configuration

- **Frontend :** Déployé sur Vercel avec build automatique
- **Backend :** Déployé comme serverless functions sur Vercel
- **Base de données :** MySQL hébergé sur service externe (PlanetScale/Supabase)
- **Variables d'environnement :** Gérées via dashboard Vercel

### 10.3 Processus de Déploiement

1. Pousser le code sur GitHub
2. Vercel détecte automatiquement les changements
3. Build et déploiement automatiques
4. Tests de validation
5. Mise en production

---

## 11. CONCLUSION

### 11.1 Réalisations

CampusGuide est une application complète et fonctionnelle qui répond aux besoins identifiés :

✅ **Plan interactif du campus** avec photos et itinéraires  
✅ **Calendrier académique dynamique** avec système d'inscription  
✅ **Système de mentorat** opérationnel  
✅ **Annuaire des clubs** fonctionnel  
✅ **Gestion sécurisée des profils** utilisateurs  
✅ **Interface administrative** complète  
✅ **Sécurité de niveau professionnel** (JWT + Bcrypt)  
✅ **Design moderne et responsive**  

### 11.2 Apports Techniques

Ce projet a permis de mettre en œuvre :
- Architecture Full-Stack moderne (React + Node.js + MySQL)
- Bonnes pratiques de sécurité (authentification, chiffrement)
- Design responsive et accessible
- Gestion de base de données relationnelle
- Déploiement cloud automatisé

### 11.3 Perspectives d'Avenir

Des améliorations pourraient être apportées :

- **Application mobile native** (iOS/Android)
- **Système de messagerie instantanée** avancé
- **Intégration avec les systèmes universitaires existants**
- **Analytics et statistiques d'utilisation**
- **Système de recommandations basé sur l'IA**

### 11.4 Bilan Personnel

Ce projet a été une expérience enrichissante qui a permis de :
- Développer des compétences techniques avancées
- Comprendre les besoins réels des utilisateurs
- Gérer un projet de A à Z (conception à déploiement)
- Travailler avec des technologies modernes du marché

CampusGuide démontre comment la technologie peut concrètement améliorer la vie étudiante et faciliter l'intégration au sein de l'université.

---

**REMERCIEMENTS**

Je tiens à remercier l'Université Nouveaux Horizons pour m'avoir donné l'opportunité de développer ce projet, ainsi que l'ensemble du corps professoral pour son encadrement et ses conseils tout au long de cette réalisation.

---

**SIGNATURE**

Bonheur Nzau  
Étudiant en Informatique  
Université Nouveaux Horizons

**Date :** 28 mai 2026
