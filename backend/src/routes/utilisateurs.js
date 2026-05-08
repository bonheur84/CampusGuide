const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { authentifier, genererToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.post('/connexion', async (req, res) => {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({ success: false, erreur: 'Email et mot de passe requis' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, erreur: 'Email ou mot de passe incorrect' });
    }

    const utilisateur = rows[0];
    let mdpValide;
    if (utilisateur.mot_de_passe.startsWith('$2') && utilisateur.mot_de_passe.length > 50) {
      mdpValide = await bcrypt.compare(motDePasse, utilisateur.mot_de_passe);
    } else {
      mdpValide = motDePasse === utilisateur.mot_de_passe;
    }

    if (!mdpValide) {
      return res.status(401).json({ success: false, erreur: 'Email ou mot de passe incorrect' });
    }

    const token = genererToken(utilisateur);
    const { mot_de_passe, ...utilisateurSansMdp } = utilisateur;

    res.json({ success: true, message: 'Connexion réussie', utilisateur: utilisateurSansMdp, token });
  } catch (err) {
    console.error('Connexion:', err.message);
    res.status(500).json({ success: false, erreur: 'Erreur serveur lors de la connexion' });
  }
});

router.get('/moi', authentifier, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nom, email, avatar, filiere, annee as promotion, role, created_at FROM utilisateurs WHERE id = ?',
      [req.utilisateur.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, erreur: 'Utilisateur introuvable' });
    res.json({ success: true, utilisateur: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nom, email, avatar, filiere, annee, role, created_at FROM utilisateurs WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, erreur: 'Utilisateur introuvable' });
    res.json({ success: true, utilisateur: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.put('/:id', authentifier, async (req, res) => {
  if (req.utilisateur.id !== req.params.id && req.utilisateur.role !== 'admin') {
    return res.status(403).json({ success: false, erreur: 'Accès refusé' });
  }

  const { nom, filiere, promotion, avatar } = req.body;
  try {
    await pool.query(
      'UPDATE utilisateurs SET nom = COALESCE(?, nom), filiere = COALESCE(?, filiere), annee = COALESCE(?, annee), avatar = COALESCE(?, avatar) WHERE id = ?',
      [nom, filiere, promotion, avatar, req.params.id]
    );
    const [rows] = await pool.query('SELECT id, nom, email, avatar, filiere, annee as promotion, role FROM utilisateurs WHERE id = ?', [req.params.id]);
    res.json({ success: true, utilisateur: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.put('/:id/mot-de-passe', authentifier, async (req, res) => {
  const { ancienMotDePasse, nouveauMotDePasse } = req.body;

  if (req.utilisateur.id !== req.params.id) {
    return res.status(403).json({ success: false, erreur: 'Accès refusé' });
  }

  try {
    const [rows] = await pool.query('SELECT mot_de_passe FROM utilisateurs WHERE id = ?', [req.params.id]);
    const utilisateur = rows[0];

    const mdpValide = await bcrypt.compare(ancienMotDePasse, utilisateur.mot_de_passe);
    if (!mdpValide) {
      return res.status(401).json({ success: false, erreur: 'Ancien mot de passe incorrect' });
    }

    const hash = await bcrypt.hash(nouveauMotDePasse, 12);
    await pool.query('UPDATE utilisateurs SET mot_de_passe = ? WHERE id = ?', [hash, req.params.id]);

    res.json({ success: true, message: 'Mot de passe modifié avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.get('/admin/tous', authentifier, async (req, res) => {
  if (req.utilisateur.role !== 'admin') {
    return res.status(403).json({ success: false, erreur: 'Accès réservé aux administrateurs' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, nom, email, filiere, annee, role, created_at FROM utilisateurs ORDER BY created_at DESC'
    );
    res.json({ success: true, utilisateurs: rows });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.delete('/:id', authentifier, async (req, res) => {
  if (req.utilisateur.id !== req.params.id && req.utilisateur.role !== 'admin') {
    return res.status(403).json({ success: false, erreur: 'Accès refusé' });
  }
  try {
    await pool.query('DELETE FROM utilisateurs WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Compte supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

module.exports = router;
