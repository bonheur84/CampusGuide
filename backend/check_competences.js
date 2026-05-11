const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkCompetences() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'campusguide'
    });

    console.log('Vérification des compétences dans la base de données...');

    const [rows] = await connection.execute('SELECT id, nom, competences FROM clubs LIMIT 5');
    
    rows.forEach(row => {
      console.log(`Club: ${row.nom} (${row.id})`);
      console.log(`Compétences: ${row.competences}`);
      console.log('---');
    });

    await connection.end();
    
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    process.exit(1);
  }
}

checkCompetences();
