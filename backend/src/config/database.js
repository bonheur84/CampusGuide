const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'campusguide',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
});

pool.getConnection()
  .then(conn => {
    console.log(' MySQL connecté avec succès');
    conn.release();
  })
  .catch(err => {
    console.error(' Erreur MySQL:', err.message);
    console.warn('  Le serveur continue mais les données ne seront pas persistées.');
    console.warn('   → Vérifiez vos variables dans .env et que MySQL est démarré.');
  });

module.exports = pool;
