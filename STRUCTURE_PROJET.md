# Structure du Projet CampusGuide - Explication Détaillée

Ce document explique à quoi sert chaque fichier du projet CampusGuide, en termes simples pour comprendre même sans connaissances techniques.

---

## 📁 Racine du projet (dossier principal)

### `.env.example`
- **À quoi ça sert :** C'est un modèle de fichier de configuration
- **Explication simple :** Imagine que c'est un formulaire vierge qui montre quelles informations sont nécessaires pour que le projet fonctionne (comme un mot de passe ou une adresse de base de données). Chaque utilisateur copie ce fichier et remplit ses propres informations.

### `.gitignore`
- **À quoi ça sert :** Liste des fichiers à ignorer lors de la sauvegarde
- **Explication simple :** Quand on sauvegarde le projet, ce fichier dit quels fichiers NE PAS sauvegarder (par exemple, les fichiers temporaires ou les fichiers avec des mots de passe secrets).

### `package.json`
- **À quoi ça sert :** Liste des dépendances du projet
- **Explication simple :** C'est comme une liste de courses qui indique quels outils et bibliothèques sont nécessaires pour que le projet fonctionne. Quand on installe le projet, ce fichier dit à l'ordinateur quoi télécharger.

### `package-lock.json`
- **À quoi ça sert :** Version figée des dépendances
- **Explication simple :** Il enregistre exactement quelle version de chaque outil a été installée. Cela garantit que tout le monde utilise les mêmes versions pour éviter les problèmes de compatibilité.

### `README.md`
- **À quoi ça sert :** Documentation principale du projet
- **Explication simple :** C'est le fichier d'accueil qui explique ce qu'est le projet, comment l'installer et comment l'utiliser. C'est le premier fichier à lire pour comprendre le projet.

### `DOCUMENTATION_COMPLETE.md`
- **À quoi ça sert :** Documentation technique complète
- **Explication simple :** Un guide détaillé pour les développeurs qui explique comment fonctionne chaque partie du projet en détail.

---

## 📁 Dossier Backend (Partie serveur)

### `backend/package.json`
- **À quoi ça sert :** Liste des outils nécessaires pour le serveur
- **Explication simple :** Comme le package.json principal, mais spécifique à la partie serveur du projet.

### `backend/package-lock.json`
- **À quoi ça sert :** Versions figées des outils du serveur
- **Explication simple :** Garantit que le serveur utilise exactement les mêmes versions d'outils.

### `backend/.env`
- **À quoi ça sert :** Configuration secrète du serveur
- **Explication simple :** Contient les informations sensibles comme les mots de passe de la base de données. Ce fichier ne doit jamais être partagé publiquement.

### `backend/.env.example`
- **À quoi ça sert :** Modèle de configuration du serveur
- **Explication simple :** Montre quelles informations sont nécessaires sans révéler les vrais mots de passe.

### `backend/src/server.js`
- **À quoi ça sert :** Point d'entrée du serveur
- **Explication simple :** C'est le fichier principal qui démarre le serveur. Il met en place toutes les connexions et attend les demandes des utilisateurs.

### `backend/src/config/database.js`
- **À quoi ça sert :** Configuration de la base de données
- **Explication simple :** Ce fichier explique comment se connecter à la base de données (comme l'adresse et le mot de passe).

### `backend/src/database/schema.sql`
- **À quoi ça sert :** Structure de la base de données
- **Explication simple :** C'est le plan de construction de la base de données. Il définit quelles tables existent (utilisateurs, clubs, événements) et quelles informations elles contiennent.

### `backend/src/database/migration_longtext.sql`
- **À quoi ça sert :** Modification de la base de données
- **Explication simple :** Un fichier qui apporte des modifications à la structure de la base de données existante (comme changer le type d'une colonne).

### `backend/src/middleware/auth.js`
- **À quoi ça sert :** Sécurité et authentification
- **Explication simple :** C'est comme un gardien qui vérifie si un utilisateur a le droit d'accéder à certaines parties du site avant de le laisser passer.

### `backend/src/routes/utilisateurs.js`
- **À quoi ça sert :** Gestion des utilisateurs
- **Explication simple :** Ce fichier gère tout ce qui concerne les comptes utilisateurs : inscription, connexion, modification de profil, etc.

### `backend/src/routes/clubs.js`
- **À quoi ça sert :** Gestion des clubs
- **Explication simple :** Gère les clubs étudiants : afficher la liste, créer un club, rejoindre un club, etc.

### `backend/src/routes/evenements.js`
- **À quoi ça sert :** Gestion des événements
- **Explication simple :** Gère tous les événements du campus : créer un événement, s'inscrire, voir le calendrier, etc.

### `backend/src/routes/mentors.js`
- **À quoi ça sert :** Gestion des mentors
- **Explication simple :** Gère le système de mentorat : trouver un mentor, devenir mentor, noter un mentor, etc.

### `backend/src/routes/notifications.js`
- **À quoi ça sert :** Gestion des notifications
- **Explication simple :** Envoie et gère les notifications aux utilisateurs (rappels d'événements, nouveaux messages, etc.).

### `backend/scripts/init-db.js`
- **À quoi ça sert :** Initialisation de la base de données
- **Explication simple :** Script qui crée la base de données et les tables nécessaires au premier lancement du projet.

### `backend/scripts/manage-clubs.js`
- **À quoi ça sert :** Gestion administrative des clubs
- **Explication simple :** Outil pour les administrateurs pour gérer les clubs (ajouter, modifier, supprimer des clubs).

---

## 📁 Dossier Frontend (Partie utilisateur)

### `frontend/package.json`
- **À quoi ça sert :** Liste des outils pour l'interface
- **Explication simple :** Liste les outils nécessaires pour créer l'interface utilisateur (le site web visible).

### `frontend/package-lock.json`
- **À quoi ça sert :** Versions figées des outils de l'interface
- **Explication simple :** Garantit que l'interface utilise exactement les mêmes versions d'outils.

### `frontend/.env`
- **À quoi ça sert :** Configuration de l'interface
- **Explication simple :** Contient l'adresse du serveur et d'autres paramètres de configuration pour l'interface.

### `frontend/index.html`
- **À quoi ça sert :** Page HTML principale
- **Explication simple :** C'est le fichier HTML de base qui charge l'application. C'est ce que le navigateur lit en premier.

### `frontend/vite.config.js`
- **À quoi ça sert :** Configuration de l'outil de construction
- **Explication simple :** Configure Vite, l'outil qui transforme le code en un site web fonctionnel.

### `frontend/src/main.jsx`
- **À quoi ça sert :** Point d'entrée de l'application
- **Explication simple :** C'est le fichier qui lance l'application React. Il dit où afficher l'application dans la page HTML.

### `frontend/src/App.jsx`
- **À quoi ça sert :** Composant principal de l'application
- **Explication simple :** C'est le composant principal qui contient toute la structure de l'application. Il gère la navigation entre les différentes pages.

### `frontend/src/index.css`
- **À quoi ça sert :** Styles globaux
- **Explication simple :** Contient les règles de style CSS qui s'appliquent à toute l'application (couleurs, polices, espacements).

### `frontend/src/contexte/ContexteUtilisateur.jsx`
- **À quoi ça sert :** Gestion de l'état utilisateur
- **Explication simple :** Garde en mémoire si l'utilisateur est connecté, qui il est, et partage cette information avec toute l'application.

### `frontend/src/api/index.js`
- **À quoi ça sert :** Communication avec le serveur
- **Explication simple :** Contient toutes les fonctions qui permettent à l'interface de parler au serveur (demander des données, envoyer des informations).

### `frontend/src/services/AIService.jsx`
- **À quoi ça sert :** Service d'intelligence artificielle
- **Explication simple :** Fonctions qui utilisent l'IA pour aider les utilisateurs (répondre aux questions, donner des conseils).

### `frontend/src/services/ExportService.jsx`
- **À quoi ça sert :** Service d'export
- **Explication simple :** Permet d'exporter des données (par exemple, télécharger son calendrier en PDF).

### `frontend/src/services/OfflineService.jsx`
- **À quoi ça sert :** Mode hors ligne
- **Explication simple :** Permet à l'application de fonctionner même sans internet en sauvegardant les données localement.

### `frontend/src/services/PWAService.jsx`
- **À quoi ça sert :** Service d'application web
- **Explication simple :** Transforme le site en application installable sur téléphone avec notifications et accès rapide.

### `frontend/src/services/RappelService.jsx`
- **À quoi ça sert :** Service de rappels
- **Explication simple :** Gère les rappels d'événements et de tâches pour les utilisateurs.

### `frontend/src/services/RatingService.jsx`
- **À quoi ça sert :** Service de notation
- **Explication simple :** Permet aux utilisateurs de noter et évaluer les mentors et les clubs.

---

## 📁 Pages de l'interface (frontend/src/pages)

### `Accueil.jsx`
- **À quoi ça sert :** Page d'accueil
- **Explication simple :** La première page que voit l'utilisateur avec les informations principales et les liens vers les autres sections.

### `Login.jsx`
- **À quoi ça sert :** Page de connexion
- **Explication simple :** Formulaire pour se connecter à son compte avec email et mot de passe.

### `APropos.jsx`
- **À quoi ça sert :** Page "À propos"
- **Explication simple :** Présente le projet, son histoire et ses objectifs.

### `Guide.jsx`
- **À quoi ça sert :** Page guide
- **Explication simple :** Guide d'utilisation pour aider les nouveaux utilisateurs à comprendre comment utiliser l'application.

### `Clubs.jsx`
- **À quoi ça sert :** Page des clubs
- **Explication simple :** Affiche la liste de tous les clubs étudiants avec possibilité de les filtrer et de rejoindre.

### `Mentors.jsx`
- **À quoi ça sert :** Page des mentors
- **Explication simple :** Affiche la liste des mentors disponibles avec leurs spécialités et notes.

### `Calendrier.jsx`
- **À quoi ça sert :** Page calendrier
- **Explication simple :** Affiche le calendrier des événements du campus avec possibilité de s'inscrire.

### `Campus.jsx`
- **À quoi ça sert :** Page du campus
- **Explication simple :** Présente le campus avec les photos des bâtiments, salles et installations.

### `Orientation.jsx`
- **À quoi ça sert :** Page d'orientation
- **Explication simple :** Aide les étudiants à choisir leur orientation avec des conseils et informations.

### `Notifications.jsx`
- **À quoi ça sert :** Page des notifications
- **Explication simple :** Affiche toutes les notifications de l'utilisateur (événements, messages, rappels).

### `Profil.jsx`
- **À quoi ça sert :** Page de profil
- **Explication simple :** Permet à l'utilisateur de voir et modifier son profil personnel.

### `ProfilMentor.jsx`
- **À quoi ça sert :** Page de profil mentor
- **Explication simple :** Profil détaillé d'un mentor avec ses informations, disponibilités et avis.

### `DevenirMentor.jsx`
- **À quoi ça sert :** Page pour devenir mentor
- **Explication simple :** Formulaire pour s'inscrire en tant que mentor.

### `Parametres.jsx`
- **À quoi ça sert :** Page des paramètres
- **Explication simple :** Permet de configurer l'application (thème, notifications, langue, etc.).

### `AdminDashboard.jsx`
- **À quoi ça sert :** Tableau de bord administrateur
- **Explication simple :** Interface pour les administrateurs pour gérer tout le site (utilisateurs, clubs, événements).

---

## 📁 Composants de l'interface (frontend/src/components)

### `Navigation.jsx`
- **À quoi ça sert :** Barre de navigation
- **Explication simple :** Menu qui permet de naviguer entre les différentes pages de l'application.

### `AIAssistant.jsx`
- **À quoi ça sert :** Assistant IA
- **Explication simple :** Chatbot intelligent qui répond aux questions des utilisateurs.

### `AcademicJournal.jsx`
- **À quoi ça sert :** Journal académique
- **Explication simple :** Permet aux étudiants de noter leurs progrès académiques et objectifs.

### `AlertePersonnalisee.jsx`
- **À quoi ça sert :** Alertes personnalisées
- **Explication simple :** Permet de créer des rappels personnalisés pour les événements importants.

### `OfflineIndicator.jsx`
- **À quoi ça sert :** Indicateur hors ligne
- **Explication simple :** Montre si l'application est connectée à internet ou fonctionne en mode hors ligne.

### `PWAFeatures.jsx`
- **À quoi ça sert :** Fonctionnalités PWA
- **Explication simple :** Affiche les options pour installer l'application sur téléphone.

---

## 📁 Composants UI réutilisables (frontend/src/components/ui)

### `LazyImage.jsx`
- **À quoi ça sert :** Chargement différé d'images
- **Explication simple :** Charge les images seulement quand elles sont visibles pour accélérer le site.

### `PageTransition.jsx`
- **À quoi ça sert :** Transition entre pages
- **Explication simple :** Animation fluide quand on change de page.

### `SkeletonCard.jsx`
- **À quoi ça sert :** Skeleton de carte
- **Explication simple :** Placeholder animé qui s'affiche pendant le chargement du contenu.

### `SkeletonEvent.jsx`
- **À quoi ça sert :** Skeleton d'événement
- **Explication simple :** Placeholder pour les événements pendant le chargement.

### `SkeletonTable.jsx`
- **À quoi ça sert :** Skeleton de tableau
- **Explication simple :** Placeholder pour les tableaux de données pendant le chargement.

### `StarRating.jsx`
- **À quoi ça sert :** Système de notation par étoiles
- **Explication simple :** Composant pour afficher et sélectionner une note avec des étoiles.

### `Tooltip.jsx`
- **À quoi ça sert :** Info-bulle
- **Explication simple :** Petite fenêtre qui apparaît quand on survole un élément pour donner plus d'informations.

---

## 📁 Fichiers publics (frontend/public)

### `public/favicon.svg`
- **À quoi ça sert :** Icône du site
- **Explication simple :** Petite icône qui s'affiche dans l'onglet du navigateur.

### `public/manifest.json`
- **À quoi ça sert :** Manifeste PWA
- **Explication simple :** Fichier qui dit au navigateur comment installer l'application comme une app native (nom, icône, couleurs).

### `public/sw.js`
- **À quoi ça sert :** Service Worker
- **Explication simple :** Programme qui permet à l'application de fonctionner hors ligne et d'envoyer des notifications.

### `public/assets/` (dossier)
- **À quoi ça sert :** Images et médias
- **Explication simple :** Contient toutes les images, photos et vidéos utilisées dans l'application (photos du campus, logos, etc.).

---

## 📁 Dossiers techniques (à ignorer)

### `node_modules/` (dans backend et frontend)
- **À quoi ça sert :** Bibliothèques installées
- **Explication simple :** Contient tous les outils téléchargés automatiquement. On ne modifie jamais ce dossier manuellement.

### `.git/` (dossier)
- **À quoi ça sert :** Historique Git
- **Explication simple :** Contient l'historique de toutes les modifications du projet pour pouvoir revenir en arrière si nécessaire.

### `frontend/.vscode/` (dossier)
- **À quoi ça sert :** Configuration VS Code
- **Explication simple :** Paramètres personnalisés pour l'éditeur de code Visual Studio Code.

### `frontend/dist/` et `frontend/dev-dist/` (dossiers)
- **À quoi ça sert :** Fichiers construits
- **Explication simple :** Contient la version finale du site prête à être mise en ligne. Généré automatiquement.

### `backend/public/` (dossier)
- **À quoi ça sert :** Fichiers statiques du serveur
- **Explication simple :** Contient les fichiers que le serveur peut envoyer directement (images, documents).

---

## 📝 Résumé

Ce projet CampusGuide est divisé en deux parties principales :

1. **Backend (Serveur)** : Gère les données, la logique métier et communique avec la base de données
2. **Frontend (Interface)** : Ce que l'utilisateur voit et avec quoi il interagit

Les deux parties communiquent entre elles pour créer une application complète et fonctionnelle.
