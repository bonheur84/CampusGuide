// =============================================
//  Script de création d'utilisateurs pour CampusGuide
//  Crée 10 étudiants et 1 administrateur
// =============================================

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// Données des étudiants
const etudiants = [
  { nom: 'Jean Kasongo',      email: 'jeankasongo@gmail.com',     filiere: 'informatique',                              annee: 'L1' },
  { nom: 'Makal Exaucee',     email: 'makalexaucee@gmail.com',    filiere: 'medecine',                                  annee: 'L2' },
  { nom: 'Lubaki Jonathan',   email: 'lubakijonathan@gmail.com',  filiere: 'droit',                                     annee: 'L3' },
  { nom: 'Bonheur Nzauboni',  email: 'nzaubonheur@gmail.com',     filiere: 'science technologique',                     annee: 'M1' },
  { nom: 'Allegra Baruani',   email: 'allegrabaruani@gmail.com',  filiere: 'science des aliments et de l\'environnement', annee: 'M2' },
  { nom: 'Benita Kapenga',    email: 'benitakapenga@gmail.com',   filiere: 'gestion',                                   annee: 'L1' },
  { nom: 'Gradi Munkana',     email: 'gradimunkana@gmail.com',    filiere: 'architecture',                              annee: 'L2' },
  { nom: 'Merveille Mbanza',  email: 'merveilleMbanza@gmail.com', filiere: 'SIC/multimedia',                            annee: 'L3' },
  { nom: 'Luna Ngoie',        email: 'lunaNgoie@gmail.com',       filiere: 'informatique',                              annee: 'M1' },
  { nom: 'Divine Lubilanji',  email: 'divinelubilanji@gmail.com', filiere: 'medecine',                                  annee: 'M2' }
];

// Données de l'administrateur
const admin = {
  nom: 'Administrateur CampusGuide',
  email: 'nzaubonheur84@gmail.com',
  role: 'admin'
};

// Mot de passe par défaut pour tous les utilisateurs
const motDePasseDefaut = 'campus123';

async function creerUtilisateurs() {
  let connection;
  
  try {
    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'campusguide',
      charset: 'utf8mb4'
    });

    console.log(' Connexion à la base de données établie');

    // Hash du mot de passe
    const hashMotDePasse = await bcrypt.hash(motDePasseDefaut, 12);
    console.log(' Mot de passe hashé avec succès');

    // Création des étudiants
    console.log('\ Création des étudiants...');
    for (const etudiant of etudiants) {
      try {
        const [result] = await connection.execute(
          'INSERT INTO utilisateurs (nom, email, mot_de_passe, filiere, annee, role) VALUES (?, ?, ?, ?, ?, ?)',
          [etudiant.nom, etudiant.email, hashMotDePasse, etudiant.filiere, etudiant.annee, 'etudiant']
        );
        console.log(` Étudiant créé: ${etudiant.nom} (${etudiant.email})`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`  L'étudiant ${etudiant.email} existe déjà`);
        } else {
          console.error(` Erreur lors de la création de ${etudiant.email}:`, error.message);
        }
      }
    }

    // Création de l'administrateur
    console.log('\n Création de l\'administrateur...');
    try {
      const [result] = await connection.execute(
        'INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
        [admin.nom, admin.email, hashMotDePasse, admin.role]
      );
      console.log(` Administrateur créé: ${admin.nom} (${admin.email})`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`  L'administrateur ${admin.email} existe déjà`);
      } else {
        console.error(` Erreur lors de la création de l'administrateur:`, error.message);
      }
    }

    // Affichage du résumé
    console.log('\n Résumé de la création:');
    console.log(` ${etudiants.length} étudiants créés`);
    console.log(` 1 administrateur créé`);
    console.log(` Mot de passe par défaut pour tous: "${motDePasseDefaut}"`);
    console.log('\n Utilisateurs créés avec succès!');

  } catch (error) {
    console.error(' Erreur générale:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log(' Connexion à la base de données fermée');
    }
  }
}

// Exécution du script
if (require.main === module) {
  creerUtilisateurs();
}

module.exports = { creerUtilisateurs };
