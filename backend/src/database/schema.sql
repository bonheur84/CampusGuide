-- =============================================
--  CampusGuide — Schéma MySQL
--  Exécutez ce fichier dans votre MySQL :
--  mysql -u root -p < schema.sql
-- =============================================

CREATE DATABASE IF NOT EXISTS campusguide CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campusguide;

-- ─── Utilisateurs ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS utilisateurs (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  nom         VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  avatar      TEXT         DEFAULT NULL,
  filiere     VARCHAR(80)  DEFAULT NULL,
  annee       VARCHAR(10)  DEFAULT NULL,
  role        ENUM('etudiant','admin') NOT NULL DEFAULT 'etudiant',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── Mentors ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mentors (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  utilisateur_id VARCHAR(36)  DEFAULT NULL,
  nom         VARCHAR(100) NOT NULL,
  filiere     VARCHAR(80)  NOT NULL,
  annee       VARCHAR(10)  NOT NULL,
  specialite  VARCHAR(120) NOT NULL,
  bio         TEXT         DEFAULT NULL,
  photo       TEXT         DEFAULT NULL,
  telephone   VARCHAR(20)  DEFAULT NULL,
  note        DECIMAL(3,1) NOT NULL DEFAULT 0,
  nb_etudiants INT         NOT NULL DEFAULT 0,
  disponible  TINYINT(1)   NOT NULL DEFAULT 1,
  status      ENUM('en_attente', 'approuve', 'rejete') NOT NULL DEFAULT 'en_attente',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE SET NULL
);

-- ─── Clubs ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clubs (
  id           VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  nom          VARCHAR(100) NOT NULL,
  description  TEXT         DEFAULT NULL,
  membres      INT          NOT NULL DEFAULT 0,
  categorie    VARCHAR(50)  NOT NULL,
  categorie_nom VARCHAR(80) NOT NULL,
  icone        VARCHAR(60)  DEFAULT 'fa-users',
  lien         TEXT         DEFAULT NULL,
  competences  TEXT         DEFAULT NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── Messages ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id              VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  expediteur_id   VARCHAR(36)  NOT NULL,
  destinataire_id VARCHAR(36)  NOT NULL,
  contenu         TEXT         NOT NULL,
  type            ENUM('texte','image','audio','fichier') NOT NULL DEFAULT 'texte',
  lu              TINYINT(1)   NOT NULL DEFAULT 0,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_expediteur (expediteur_id),
  INDEX idx_destinataire (destinataire_id)
);

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id              VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  utilisateur_id  VARCHAR(36)  NOT NULL,
  type            VARCHAR(50)  NOT NULL DEFAULT 'info',
  titre           VARCHAR(200) NOT NULL,
  description     TEXT         DEFAULT NULL,
  lu              TINYINT(1)   NOT NULL DEFAULT 0,
  icone           VARCHAR(60)  DEFAULT 'fa-bell',
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_utilisateur (utilisateur_id)
);

-- ─── Événements ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS evenements (
  id           VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  titre        VARCHAR(200) NOT NULL,
  description  TEXT         DEFAULT NULL,
  date         DATE         NOT NULL,
  heure        TIME         NOT NULL DEFAULT '09:00:00',
  lieu         VARCHAR(200) DEFAULT 'Campus Principal',
  categorie    VARCHAR(50)  NOT NULL,
  inscrits     INT          NOT NULL DEFAULT 0,
  max_inscrits INT          NOT NULL DEFAULT 100,
  organisateur VARCHAR(120) DEFAULT 'Administration',
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date),
  INDEX idx_categorie (categorie)
);

-- ─── Données initiales — Mentors ──────────────────────────────────────────────
INSERT IGNORE INTO mentors (id, nom, filiere, annee, specialite, bio, note, nb_etudiants, disponible) VALUES
('m-001', 'Jean Dupont',   'informatique', 'L3', 'Développement Web',      'Passionné par React et le design UI/UX.', 4.8, 12, 1),

-- ─── Données initiales — Clubs ────────────────────────────────────────────────
INSERT IGNORE INTO clubs (id, nom, description, membres, categorie, categorie_nom, icone, lien, competences) VALUES
('c-001', 'Club de Manga',       'Partagez votre passion pour les mangas.', 206, 'art',       'Art & Culture', 'fa-book',       'https://wa.me/22997047047', '["Dessin", "Créativité", "Culture japonaise", "Animation"]'),
('c-002', "Club d'informatique", 'Hackathons, projets collaboratifs.',       62,  'tech',      'Tech',          'fa-code',       'https://wa.me/22997047047', '["Programmation", "Travail d équipe", "Résolution de problèmes", "Innovation"]'),
('c-003', 'Club de Scrabble',    'Des tournois réguliers.',                  45,  'academique','Académique',    'fa-chess-board','https://wa.me/22997047047', '["Orthographe", "Stratégie", "Concentration", "Compétition"]'),
('c-004', 'Club Musical',        'Instrument, chant, composition.',          33,  'art',       'Art & Culture', 'fa-music',      'https://wa.me/22997047047', '["Musique", "Créativité", "Performance", "Travail d équipe"]'),
('c-005', "Club d'Echec",        'Tournois et analyses de parties.',         24,  'academique','Académique',    'fa-chess',      'https://wa.me/22997047047', '["Stratégie", "Logique", "Patience", "Analyse"]'),
('c-006', 'Club Football',       'Entraînements hebdomadaires.',             98,  'sport',     'Sport',         'fa-futbol',     'https://wa.me/22997047047', '["Travail d équipe", "Endurance", "Leadership", "Discipline"]'),
('c-007', 'Club Basketball',     'Rejoignez notre équipe de basket.',        28,  'sport',     'Sport',         'fa-basketball', 'https://wa.me/22997047047', '["Coordination", "Travail d équipe", "Agilité", "Stratégie"]'),
('c-008', "Club d'Art",          'Peinture, dessin et photographie.',        24,  'art',       'Art & Culture', 'fa-camera',     'https://wa.me/22997047047', '["Créativité", "Techniques artistiques", "Vision artistique", "Expression"]'),
('c-009', 'Club Sciences',       'Expériences et conférences.',              37,  'academique','Académique',    'fa-flask',      'https://wa.me/22997047047', '["Méthode scientifique", "Analyse", "Recherche", "Communication"]'),
('c-010', 'Club Volleyball',     "Entraînements de volley.",                 41,  'sport',     'Sport',         'fa-volleyball', 'https://wa.me/22997047047', '["Travail d équipe", "Réflexes", "Communication", "Endurance"]'),
('c-011', 'Club Éloquence',      "Concours de débat et de plaidoirie.",      19,  'art',       'Art & Culture', 'fa-microphone', 'https://wa.me/22997047047', '["Art oratoire", "Argumentation", "Confiance en soi", "Communication"]');