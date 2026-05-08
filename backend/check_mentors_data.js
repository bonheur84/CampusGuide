// Script pour vérifier les données des mentors
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkMentorsData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campusguide'
  });

  try {
    console.log('Vérification des données des mentors...\n');
    
    // Récupérer tous les mentors
    const [mentors] = await connection.execute(
      `SELECT id, nom, telephone, whatsapp_number FROM mentors`
    );
    
    console.log(`Nombre total de mentors: ${mentors.length}\n`);
    
    mentors.forEach((mentor, index) => {
      console.log(`Mentor ${index + 1}:`);
      console.log(`  ID: ${mentor.id}`);
      console.log(`  Nom: ${mentor.nom}`);
      console.log(`  Téléphone: ${mentor.telephone || 'NULL'}`);
      console.log(`  WhatsApp: ${mentor.whatsapp_number || 'NULL'}`);
      console.log('');
    });

    // Mettre à jour un mentor de test avec un numéro de téléphone
    if (mentors.length > 0) {
      const firstMentor = mentors[0];
      if (!firstMentor.telephone) {
        console.log(`Ajout d'un numéro de téléphone pour ${firstMentor.nom}...`);
        await connection.execute(
          `UPDATE mentors SET telephone = ? WHERE id = ?`,
          ['+22996000000', firstMentor.id]
        );
        console.log('✅ Numéro de téléphone ajouté: +22996000000');
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

checkMentorsData();
