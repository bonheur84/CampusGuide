// Script de gestion des clubs - Réinitialisation et mise à jour des compétences
const mysql = require('mysql2/promise');
require('dotenv').config();

const clubsData = [
  {
    id: 'c-001',
    nom: 'Club de Manga',
    description: 'Partagez votre passion pour les mangas, participez à des débats et des événements cosplay.',
    membres: 206,
    categorie: 'art',
    categorie_nom: 'Art & Culture',
    icone: 'fa-book',
    lien: 'https://chat.whatsapp.com/GzsUAwKoXgU6pP72O2lME7',
    competences: '["Dessin", "Créativité", "Culture japonaise", "Animation"]'
  },
  {
    id: 'c-002',
    nom: "Club d'informatique",
    description: "Hackathons, projets collaboratifs, ateliers de programmation et initiation à l'IA.",
    membres: 62,
    categorie: 'tech',
    categorie_nom: 'Tech',
    icone: 'fa-code',
    lien: 'https://wa.me/22997047047',
    competences: '["Programmation", "Travail d équipe", "Résolution de problèmes", "Innovation"]'
  },
  {
    id: 'c-003',
    nom: 'Club de Scrabble',
    description: "Des tournois réguliers, des analyses de parties et des sessions d'entraînement pour tous les niveaux.",
    membres: 45,
    categorie: 'academique',
    categorie_nom: 'Académique',
    icone: 'fa-chess-board',
    lien: 'https://wa.me/22997047047',
    competences: '["Orthographe", "Stratégie", "Concentration", "Compétition"]'
  },
  {
    id: 'c-004',
    nom: 'Club Musical',
    description: 'Instrument, chant, composition et concerts organisés tout au long de l\'année universitaire.',
    membres: 33,
    categorie: 'art',
    categorie_nom: 'Art & Culture',
    icone: 'fa-music',
    lien: 'https://wa.me/22997047047',
    competences: '["Musique", "Créativité", "Performance", "Travail d équipe"]'
  },
  {
    id: 'c-005',
    nom: "Club d'Echec",
    description: 'Tournois et analyses de parties.',
    membres: 24,
    categorie: 'academique',
    categorie_nom: 'Académique',
    icone: 'fa-chess',
    lien: 'https://wa.me/22997047047',
    competences: '["Stratégie", "Logique", "Patience", "Analyse"]'
  },
  {
    id: 'c-006',
    nom: 'Club Football',
    description: 'Entraînements hebdomadaires.',
    membres: 98,
    categorie: 'sport',
    categorie_nom: 'Sport',
    icone: 'fa-futbol',
    lien: 'https://wa.me/22997047047',
    competences: '["Travail d équipe", "Endurance", "Leadership", "Discipline"]'
  },
  {
    id: 'c-007',
    nom: 'Club Basketball',
    description: 'Rejoignez notre équipe de basket.',
    membres: 28,
    categorie: 'sport',
    categorie_nom: 'Sport',
    icone: 'fa-basketball',
    lien: 'https://wa.me/22997047047',
    competences: '["Coordination", "Travail d équipe", "Agilité", "Stratégie"]'
  },
  {
    id: 'c-008',
    nom: "Club d'Art",
    description: 'Peinture, dessin et photographie.',
    membres: 24,
    categorie: 'art',
    categorie_nom: 'Art & Culture',
    icone: 'fa-camera',
    lien: 'https://wa.me/22997047047',
    competences: '["Créativité", "Techniques artistiques", "Vision artistique", "Expression"]'
  },
  {
    id: 'c-009',
    nom: 'Club Sciences',
    description: 'Expériences et conférences.',
    membres: 37,
    categorie: 'academique',
    categorie_nom: 'Académique',
    icone: 'fa-flask',
    lien: 'https://wa.me/22997047047',
    competences: '["Méthode scientifique", "Analyse", "Recherche", "Communication"]'
  },
  {
    id: 'c-010',
    nom: 'Club Volleyball',
    description: "Entraînements de volley.",
    membres: 41,
    categorie: 'sport',
    categorie_nom: 'Sport',
    icone: 'fa-volleyball',
    lien: 'https://wa.me/22997047047',
    competences: '["Travail d équipe", "Réflexes", "Communication", "Endurance"]'
  },
  {
    id: 'c-011',
    nom: 'Club Éloquence',
    description: "Concours de débat et de plaidoirie.",
    membres: 19,
    categorie: 'art',
    categorie_nom: 'Art & Culture',
    icone: 'fa-microphone',
    lien: 'https://wa.me/22997047047',
    competences: '["Art oratoire", "Argumentation", "Confiance en soi", "Communication"]'
  }
];

async function resetClubs() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campusguide'
  });

  try {
    console.log('🔄 Réinitialisation des clubs...\n');
    
    // Supprimer tous les clubs existants
    console.log('Suppression des clubs existants...');
    await connection.execute('DELETE FROM clubs');
    console.log('✅ Tous les clubs supprimés');
    
    // Réinsérer les clubs avec toutes les données
    console.log('\nRéinsertion des clubs avec les données complètes...');
    
    for (const club of clubsData) {
      await connection.execute(
        `INSERT INTO clubs (id, nom, description, membres, categorie, categorie_nom, icone, lien, competences) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [club.id, club.nom, club.description, club.membres, club.categorie, club.categorie_nom, club.icone, club.lien, club.competences]
      );
      console.log(`✅ Club "${club.nom}" inséré`);
    }

    // Vérifier l'insertion
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM clubs');
    console.log(`\n📊 Total des clubs insérés: ${result[0].total}`);
    
    // Afficher les clubs insérés
    const [clubs] = await connection.execute('SELECT nom, categorie, membres FROM clubs ORDER BY nom');
    console.log('\n📋 Liste des clubs réinsérés:');
    clubs.forEach((club, index) => {
      console.log(`${index + 1}. ${club.nom} (${club.categorie}) - ${club.membres} membres`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
    console.log('\n🎉 Réinitialisation des clubs terminée !');
  }
}

async function updateCompetences() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campusguide'
  });

  try {
    console.log('📝 Mise à jour des compétences pour les clubs existants...');

    for (const club of clubsData) {
      await connection.execute(
        'UPDATE clubs SET competences = ? WHERE id = ?',
        [club.competences, club.id]
      );
      console.log(`✅ Compétences mises à jour pour ${club.nom}`);
    }

    console.log('✅ Mise à jour terminée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error.message);
  } finally {
    await connection.end();
  }
}

// Vérifier l'argument de ligne de commande
const action = process.argv[2];

if (action === 'reset') {
  resetClubs();
} else if (action === 'update') {
  updateCompetences();
} else {
  console.log('Usage:');
  console.log('  node scripts/manage-clubs.js reset  - Réinitialise tous les clubs');
  console.log('  node scripts/manage-clubs.js update - Met à jour les compétences des clubs existants');
  process.exit(1);
}
