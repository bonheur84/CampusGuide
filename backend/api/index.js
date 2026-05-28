require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

require('../src/config/database');

const mentorsRouter       = require('../src/routes/mentors');
const clubsRouter         = require('../src/routes/clubs');
const utilisateursRouter  = require('../src/routes/utilisateurs');
const notificationsRouter = require('../src/routes/notifications');
const evenementsRouter    = require('../src/routes/evenements');

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

module.exports = app;
