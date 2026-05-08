// Script pour réinitialiser tous les clubs
const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetClubs() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campusguide'
  });

  try {
    console.log('🔄 Réinitialisation des clubs...\n');
    
    // 1. Supprimer tous les clubs existants
    console.log('Suppression des clubs existants...');
    await connection.execute('DELETE FROM clubs');
    console.log('✅ Tous les clubs supprimés');
    
    // 2. Réinsérer les clubs avec les données initiales
    console.log('\nRéinsertion des clubs avec les données initiales...');
    
    const clubsData = [
      {
        id: 'c-001',
        nom: 'Club de Manga',
        description: 'Partagez votre passion pour les mangas, participez à des débats et des événements cosplay.',
        membres: 206,
        categorie: 'art',
        categorie_nom: 'Art & Culture',
        icone: 'fa-book',
        lien: 'https://chat.whatsapp.com/GzsUAwKoXgU6pP72O2lME7'
      },
      {
        id: 'c-002',
        nom: "Club d'informatique",
        description: "Hackathons, projets collaboratifs, ateliers de programmation et initiation à l'IA.",
        membres: 62,
        categorie: 'tech',
        categorie_nom: 'Tech',
        icone: 'fa-code',
        lien: 'https://wa.me/22997047047'
      },
      {
        id: 'c-003',
        nom: 'Club de Scrabble',
        description: "Des tournois réguliers, des analyses de parties et des sessions d'entraînement pour tous les niveaux.",
        membres: 45,
        categorie: 'academique',
        categorie_nom: 'Académique',
        icone: 'fa-chess-board',
        lien: 'https://wa.me/22997047047'
      },
      {
        id: 'c-004',
        nom: 'Club Musical',
        description: 'Instrument, chant, composition et concerts organisés tout au long de l\'année universitaire.',
        membres: 33,
        categorie: 'art',
        categorie_nom: 'Art & Culture',
        icone: 'fa-music',
        lien: 'https://wa.me/22997047047'
      },
      {
        id: 'c-005',
        nom: "Club d'Echec",
        description: 'Tournois et analyses de parties.',
        membres: 24,
        categorie: 'academique',
        categorie_nom: 'Académique',
        icone: 'fa-chess',
        lien: 'https://wa.me/22997047047'
      },
      {
        id: 'c-006',
        nom: 'Club Football',
        description: 'Entraînements hebdomadaires.',
        membres: 98,
        categorie: 'sport',
        categorie_nom: 'Sport',
        icone: 'fa-futbol',
        lien: 'https://wa.me/22997047047'
      },
      {
        id: 'c-007',
        nom: 'Club Basketball',
        description: 'Rejoignez notre équipe de basket.',
        membres: 28,
        categorie: 'sport',
        categorie_nom: 'Sport',
        icone: 'fa-basketball',
        lien: 'https://wa.me/22997047047'
      },
      {
        id: 'c-008',
        nom: "Club d'Art",
        description: 'Peinture, dessin et photographie.',
        membres: 24,
        categorie: 'art',
        categorie_nom: 'Art & Culture',
        icone: 'fa-camera',
        lien: 'https://wa.me/22997047047'
      },
      {
        id: 'c-009',
        nom: 'Club Sciences',
        description: 'Expériences et conférences.',
        membres: 37,
        categorie: 'academique',
        categorie_nom: 'Académique',
        icone: 'fa-flask',
        lien: 'https://wa.me/22997047047'
      },
      {
        id: 'c-010',
        nom: 'Club Volleyball',
        description: "Entraînements de volley.",
        membres: 41,
        categorie: 'sport',
        categorie_nom: 'Sport',
        icone: 'fa-volleyball',
        lien: 'https://wa.me/22997047047'
      },
      {
        id: 'c-011',
        nom: 'Club Éloquence',
        description: "Concours de débat et de plaidoirie.",
        membres: 19,
        categorie: 'art',
        categorie_nom: 'Art & Culture',
        icone: 'fa-microphone',
        lien: 'https://wa.me/22997047047'
      }
    ];

    // Insérer chaque club
    for (const club of clubsData) {
      await connection.execute(
        `INSERT INTO clubs (id, nom, description, membres, categorie, categorie_nom, icone, lien) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [club.id, club.nom, club.description, club.membres, club.categorie, club.categorie_nom, club.icone, club.lien]
      );
      console.log(`✅ Club "${club.nom}" inséré`);
    }

    // 3. Vérifier l'insertion
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM clubs');
    console.log(`\n📊 Total des clubs insérés: ${result[0].total}`);
    
    // 4. Afficher les clubs insérés
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

resetClubs();
