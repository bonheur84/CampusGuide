const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function createAdmin() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campusguide'
  });

  try {
    const email = 'nzaubonheur84@gmail.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminId = uuidv4();

    await pool.query(
      'INSERT INTO utilisateurs (id, nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)',
      [adminId, 'Admin', email, hashedPassword, 'admin']
    );

    console.log('✅ Utilisateur admin créé avec succès!');
    console.log('Email:', email);
    console.log('Mot de passe:', password);
    console.log('ID:', adminId);

    await pool.end();
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('⚠️ Un utilisateur avec cet email existe déjà.');
    } else {
      console.error('❌ Erreur:', error.message);
    }
    await pool.end();
    process.exit(1);
  }
}

createAdmin();
