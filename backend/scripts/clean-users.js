require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const emailsAGarder = [
  'jeankasongo@gmail.com',
  'makalexaucee@gmail.com',
  'lubakijonathan@gmail.com',
  'nzaubonheur@gmail.com',
  'allegrabaruani@gmail.com',
  'benitakapenga@gmail.com',
  'gradimunkana@gmail.com',
  'merveilleMbanza@gmail.com',
  'lunaNgoie@gmail.com',
  'divinelubilanji@gmail.com',
  'nzaubonheur84@gmail.com',
];

async function nettoyerComptes() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host:     process.env.DB_HOST || 'localhost',
      port:     parseInt(process.env.DB_PORT) || 3306,
      user:     process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'campusguide',
      charset:  'utf8mb4'
    });

    const placeholders = emailsAGarder.map(() => '?').join(', ');
    const [aSupprimer] = await connection.execute(
      `SELECT id, nom, email FROM utilisateurs WHERE email NOT IN (${placeholders})`,
      emailsAGarder
    );

    if (aSupprimer.length === 0) {
      console.log('Aucun compte a supprimer. La base est deja propre.');
      return;
    }

    console.log(`${aSupprimer.length} compte(s) a supprimer :`);
    aSupprimer.forEach(u => console.log(`  - ${u.nom} (${u.email})`));

    const [result] = await connection.execute(
      `DELETE FROM utilisateurs WHERE email NOT IN (${placeholders})`,
      emailsAGarder
    );

    console.log(`\n${result.affectedRows} compte(s) supprime(s) avec succes.`);
  } catch (err) {
    console.error('Erreur:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

nettoyerComptes();
