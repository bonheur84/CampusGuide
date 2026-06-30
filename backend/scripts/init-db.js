const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('Lecture du schema.sql...');
    const schemaPath = path.join(__dirname, '../src/database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Exécution du schema...');
    await pool.query(schema);
    
    console.log('✅ Base de données initialisée avec succès!');
    
    // Vérifier les tables créées
    const [tables] = await pool.query(`SHOW TABLES FROM ${process.env.DB_NAME || 'campusguide'}`);
    console.log('Tables créées:', tables.map(t => Object.values(t)[0]).join(', '));
    
    await pool.end();
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
    await pool.end();
    process.exit(1);
  }
}

initDatabase();
