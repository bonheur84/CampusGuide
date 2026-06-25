const pool = require('../src/config/database');

async function createTable() {
  try {
    // Créer la table ratings pour clubs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings_clubs (
        id VARCHAR(36) PRIMARY KEY,
        club_id VARCHAR(36) NOT NULL,
        utilisateur_id VARCHAR(36) NOT NULL,
        note INT NOT NULL CHECK (note >= 1 AND note <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_vote (club_id, utilisateur_id),
        FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
        FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('Table ratings_clubs créée avec succès');

    // Créer les index (ignorer si ils existent déjà)
    try {
      await pool.query('CREATE INDEX idx_ratings_clubs_club ON ratings_clubs(club_id)');
    } catch (e) {
      // Index existe déjà, ignorer l'erreur
    }
    try {
      await pool.query('CREATE INDEX idx_ratings_clubs_utilisateur ON ratings_clubs(utilisateur_id)');
    } catch (e) {
      // Index existe déjà, ignorer l'erreur
    }
    
    console.log('Index créés avec succès');
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de la création de la table:', err.message);
    process.exit(1);
  }
}

createTable();
