// =============================================
//  Migration : avatar → LONGTEXT
//  Exécuter avec : node migrate_avatar.js
// =============================================

require('dotenv').config({ path: './.env' });
const mysql = require('mysql2/promise');

async function migrer() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // 1. Passer avatar en LONGTEXT
    console.log('⏳ Modification de la colonne avatar...');
    await conn.execute('ALTER TABLE utilisateurs MODIFY COLUMN avatar LONGTEXT DEFAULT NULL');
    console.log('✅ avatar → LONGTEXT');

    // 2. Vérifier
    const [rows] = await conn.execute(
      `SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'utilisateurs' AND COLUMN_NAME = 'avatar'`,
      [process.env.DB_NAME]
    );
    console.log('📋 Résultat :', rows[0]);
    console.log('🎉 Migration terminée avec succès !');
  } catch (err) {
    console.error('❌ Erreur :', err.message);
  } finally {
    await conn.end();
  }
}

migrer();
