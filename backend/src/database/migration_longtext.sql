-- =============================================
--  Migration : Augmenter la capacité des images
-- =============================================

USE campusguide;

-- 1. Table Utilisateurs
ALTER TABLE utilisateurs MODIFY COLUMN avatar LONGTEXT DEFAULT NULL;

-- 2. Table Mentors
ALTER TABLE mentors MODIFY COLUMN photo LONGTEXT DEFAULT NULL;

-- 3. Table Messages (pour les images envoyées par chat)
ALTER TABLE messages MODIFY COLUMN contenu LONGTEXT NOT NULL;

-- 4. Table Notifications (au cas où on mettrait des images riches)
ALTER TABLE notifications MODIFY COLUMN description LONGTEXT DEFAULT NULL;

-- 5. Table Événements
ALTER TABLE evenements MODIFY COLUMN description LONGTEXT DEFAULT NULL;

SELECT 'Migration terminée avec succès !' AS Resultat;
