# CampusGuide — Backend API (Node.js & Express.js)

## 🗂️ Structure du projet

```
CampusGuide - nodejs et expressjs/
├── package.json              # Dépendances Node.js
├── src/
│   ├── server.js             # Point d'entrée — Express + middlewares
│   ├── data/
│   │   └── db.js             # Base de données en mémoire (dev)
│   └── routes/
│       ├── mentors.js        # /api/mentors
│       ├── clubs.js          # /api/clubs
│       ├── utilisateurs.js   # /api/utilisateurs
│       ├── messages.js       # /api/messages
│       ├── notifications.js  # /api/notifications
│       └── evenements.js     # /api/evenements
```

## 🚀 Démarrage

```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur **http://localhost:3001**

---

## 📡 Référence des APIs

### 👨‍🏫 Mentors — `/api/mentors`

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/mentors` | Tous les mentors |
| `GET` | `/api/mentors?filiere=informatique` | Filtrer par filière |
| `GET` | `/api/mentors?recherche=React` | Rechercher |
| `GET` | `/api/mentors/:id` | Un mentor par ID |
| `POST` | `/api/mentors` | Créer un mentor |
| `PUT` | `/api/mentors/:id` | Modifier un mentor |
| `DELETE` | `/api/mentors/:id` | Supprimer un mentor |

**Corps POST/PUT :**
```json
{
  "nom": "Jean Dupont",
  "filiere": "informatique",
  "annee": "L3",
  "specialite": "Développement Web",
  "bio": "Ma bio..."
}
```

---

### 🎓 Clubs — `/api/clubs`

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/clubs` | Tous les clubs |
| `GET` | `/api/clubs?categorie=sport` | Filtrer par catégorie |
| `GET` | `/api/clubs/:id` | Un club par ID |
| `POST` | `/api/clubs` | Créer un club |
| `PUT` | `/api/clubs/:id` | Modifier un club |
| `DELETE` | `/api/clubs/:id` | Supprimer un club |
| `POST` | `/api/clubs/:id/rejoindre` | Rejoindre un club (+1 membre) |

---

### 👤 Utilisateurs — `/api/utilisateurs`

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/utilisateurs/:id` | Profil utilisateur |
| `POST` | `/api/utilisateurs/inscription` | Créer un compte |
| `POST` | `/api/utilisateurs/connexion` | Se connecter |
| `PUT` | `/api/utilisateurs/:id` | Modifier le profil |
| `DELETE` | `/api/utilisateurs/:id` | Supprimer le compte |

**Connexion — Réponse :**
```json
{
  "success": true,
  "utilisateur": { "id": "u1", "nom": "...", "email": "..." },
  "token": "token_demo_u1"
}
```

---

### 💬 Messages — `/api/messages`

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/messages?expediteurId=u1&destinataireId=1` | Conversation |
| `GET` | `/api/messages/conversations/:userId` | Liste des conversations |
| `POST` | `/api/messages` | Envoyer un message |
| `PUT` | `/api/messages/:id/lire` | Marquer comme lu |
| `DELETE` | `/api/messages/:id` | Supprimer |

---

### 🔔 Notifications — `/api/notifications`

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/notifications/:userId` | Notifications d'un utilisateur |
| `PUT` | `/api/notifications/:id/lire` | Marquer une comme lue |
| `PUT` | `/api/notifications/lire-tout/:userId` | Tout marquer comme lu |
| `DELETE` | `/api/notifications/:id` | Supprimer |

---

### 📅 Événements — `/api/evenements`

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/evenements` | Tous les événements |
| `GET` | `/api/evenements?categorie=sport` | Filtrer par catégorie |
| `GET` | `/api/evenements?avenir=true` | Événements à venir seulement |
| `GET` | `/api/evenements/:id` | Un événement |
| `POST` | `/api/evenements` | Créer un événement |
| `PUT` | `/api/evenements/:id` | Modifier |
| `POST` | `/api/evenements/:id/inscrire` | S'inscrire |
| `DELETE` | `/api/evenements/:id` | Supprimer |

---

## 🧪 Comptes de test

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `demo@campusguide.com` | `demo123` | Étudiant |
| `admin@campusguide.com` | `admin123` | Admin |

---

## ⚙️ Variables d'environnement

Créer un fichier `.env` à la racine :

```env
PORT=3001
```

> **Note :** Les données sont stockées **en mémoire** (elles se réinitialisent au redémarrage du serveur). Pour la production, connecter une vraie base de données (MongoDB, PostgreSQL...).
