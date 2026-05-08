// Script pour ajouter le champ telephone à la table mentors
const mysql = require('mysql2/promise');
require('dotenv').config();

async function addTelephoneField() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campusguide'
  });

  try {
    console.log('Ajout du champ telephone à la table mentors...');
    
    // Vérifier si le champ existe déjà
    const [columns] = await connection.execute(
      `SHOW COLUMNS FROM mentors LIKE 'telephone'`
    );
    
    if (columns.length === 0) {
      // Ajouter le champ telephone
      await connection.execute(
        `ALTER TABLE mentors ADD COLUMN telephone VARCHAR(20) DEFAULT NULL`
      );
      console.log('✅ Champ telephone ajouté avec succès');
    } else {
      console.log('ℹ️  Le champ telephone existe déjà');
    }

    // Afficher la structure mise à jour
    const [structure] = await connection.execute(`DESCRIBE mentors`);
    console.log('\nStructure actuelle de la table mentors:');
    structure.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

addTelephoneField();
