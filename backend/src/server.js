require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

require('./config/database');

const mentorsRouter       = require('./routes/mentors');
const clubsRouter         = require('./routes/clubs');
const utilisateursRouter  = require('./routes/utilisateurs');
const notificationsRouter = require('./routes/notifications');
const evenementsRouter    = require('./routes/evenements');

app.use('/api/mentors',       mentorsRouter);
app.use('/api/clubs',         clubsRouter);
app.use('/api/utilisateurs',  utilisateursRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/evenements',    evenementsRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'CampusGuide API — Serveur operationnel',
    version: '2.0.0',
    stack: 'Node.js + Express + MySQL + JWT',
  });
});

app.use((req, res) => {
  res.status(404).json({ erreur: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.message);
  res.status(500).json({ erreur: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`CampusGuide API demarree sur http://localhost:${PORT}`);
  console.log(`Base de donnees: ${process.env.DB_NAME || 'campusguide'}`);
});
