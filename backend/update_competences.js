const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateCompetences() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'campusguide'
    });

    console.log('Mise à jour des compétences pour les clubs existants...');

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

    console.log('Mise à jour terminée avec succès!');
    await connection.end();
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    process.exit(1);
  }
}

updateCompetences();
