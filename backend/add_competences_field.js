const mysql = require('mysql2/promise');
require('dotenv').config();

async function addCompetencesField() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'campusguide'
    });

    console.log('Ajout du champ competences à la table clubs...');

    // Ajouter la colonne competences si elle n'existe pas
    await connection.execute(`
      ALTER TABLE clubs 
      ADD COLUMN competences TEXT DEFAULT NULL
    `);

    console.log('Colonne competences ajoutée avec succès!');

    // Mettre à jour les clubs existants avec des compétences par défaut
    const clubsCompetences = {
      'c-001': '["Dessin", "Créativité", "Culture japonaise", "Animation"]',
      'c-002': '["Programmation", "Travail d équipe", "Résolution de problèmes", "Innovation"]',
      'c-003': '["Orthographe", "Stratégie", "Concentration", "Compétition"]',
      'c-004': '["Musique", "Créativité", "Performance", "Travail d équipe"]',
      'c-005': '["Stratégie", "Logique", "Patience", "Analyse"]',
      'c-006': '["Travail d équipe", "Endurance", "Leadership", "Discipline"]',
      'c-007': '["Coordination", "Travail d équipe", "Agilité", "Stratégie"]',
      'c-008': '["Créativité", "Techniques artistiques", "Vision artistique", "Expression"]',
      'c-009': '["Méthode scientifique", "Analyse", "Recherche", "Communication"]',
      'c-010': '["Travail d équipe", "Réflexes", "Communication", "Endurance"]',
      'c-011': '["Art oratoire", "Argumentation", "Confiance en soi", "Communication"]'
    };

    for (const [clubId, competences] of Object.entries(clubsCompetences)) {
      await connection.execute(
        'UPDATE clubs SET competences = ? WHERE id = ?',
        [competences, clubId]
      );
      console.log(`Compétences ajoutées pour le club ${clubId}`);
    }

    console.log('Migration terminée avec succès!');
    await connection.end();
    
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    process.exit(1);
  }
}

addCompetencesField();
