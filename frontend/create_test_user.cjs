// Script pour créer un utilisateur de test via l'API frontend (CommonJS)
const http = require('http');

// Créer un utilisateur de test
const createTestUser = () => {
  console.log('Création d\\'un utilisateur de test via API...');
  
  const userData = {
    email: 'jean@test.com',
    motDePasse: 'password123',
    nom: 'Jean Dupont',
    filiere: 'informatique',
    annee: 'L1'
  };

  const postData = JSON.stringify(userData);
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/utilisateurs/inscription',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
      
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('Utilisateur créé avec succès');
          console.log('Email: jean@test.com');
          console.log('Mot de passe: password123');
          
          // Tester la connexion immédiatement
          testLogin();
        } else {
          console.log('Erreur lors de la création:', response.erreur);
        }
      } catch (e) {
        console.log('Erreur parsing:', e.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Erreur de création:', error.message);
  });

  req.write(postData);
  req.end();
};

// Tester la connexion
const testLogin = () => {
  console.log('\nTest de connexion...');
  
  const loginData = {
    email: 'jean@test.com',
    motDePasse: 'password123'
  };

  const postData = JSON.stringify(loginData);
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/utilisateurs/connexion',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
      
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('✅ Connexion réussie!');
          console.log('Token:', response.token.substring(0, 50) + '...');
          console.log('Utilisateur:', response.utilisateur.nom);
          console.log('Email:', response.utilisateur.email);
        } else {
          console.log('❌ Erreur de connexion:', response.erreur);
        }
      } catch (e) {
        console.log('Erreur parsing:', e.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Erreur de connexion:', error.message);
  });

  req.write(postData);
  req.end();
};

createTestUser();
