// Script pour vérifier les champs exacts dans la base de données
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDBFields() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campusguide'
  });

  try {
    console.log('Vérification des champs de la table mentors...\n');
    
    // Récupérer les données brutes d'un mentor
    const [mentors] = await connection.execute(
      `SELECT * FROM mentors LIMIT 1`
    );
    
    if (mentors.length > 0) {
      const mentor = mentors[0];
      console.log('Champs disponibles dans la table mentors:');
      Object.keys(mentor).forEach(key => {
        console.log(`  ${key}: ${mentor[key]}`);
      });
      
      console.log('\nTest de la fonction normaliserMentor:');
      const normaliserMentor = (m) => ({
        id: m.id,
        nom: m.nom,
        filiere: m.filiere,
        annee: m.annee,
        specialite: m.specialite,
        bio: m.bio,
        photo: m.photo,
        telephone: m.telephone,
        note: m.note ? parseFloat(m.note) : 0,
        nbEtudiants: m.nb_etudiants,
        disponible: m.disponible,
        status: m.status,
        utilisateurId: m.utilisateur_id,
        createdAt: m.created_at
      });
      
      const normalized = normaliserMentor(mentor);
      console.log('\nRésultat normalisé:');
      console.log(JSON.stringify(normalized, null, 2));
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

checkDBFields();
