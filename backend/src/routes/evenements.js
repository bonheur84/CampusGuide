const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    let sql = 'SELECT * FROM evenements WHERE 1=1';
    const params = [];

    if (req.query.categorie && req.query.categorie !== 'tous') {
      sql += ' AND categorie = ?';
      params.push(req.query.categorie);
    }
    if (req.query.date) {
      sql += ' AND date = ?';
      params.push(req.query.date);
    }
    if (req.query.avenir === 'true') {
      sql += ' AND date >= CURDATE()';
    }

    sql += ' ORDER BY date ASC, heure ASC';

    const [rows] = await pool.query(sql, params);
    const evenements = rows.map(normaliserEvenement);
    res.json({ success: true, total: evenements.length, evenements });
  } catch (err) {
    console.error('GET /evenements:', err.message);
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM evenements WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, erreur: 'Événement introuvable' });
    res.json({ success: true, evenement: normaliserEvenement(rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.post('/', async (req, res) => {
  const { titre, description, date, heure, lieu, categorie, maxInscrits, organisateur } = req.body;
  if (!titre || !date || !categorie) {
    return res.status(400).json({ success: false, erreur: 'Titre, date et catégorie obligatoires' });
  }
  try {
    await pool.query(
      'INSERT INTO evenements (titre, description, date, heure, lieu, categorie, max_inscrits, organisateur) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [titre, description || null, date, heure || '09:00', lieu || 'Campus Principal', categorie, maxInscrits || 100, organisateur || 'Administration']
    );
    const [rows] = await pool.query('SELECT * FROM evenements WHERE titre = ? ORDER BY created_at DESC LIMIT 1', [titre]);
    res.status(201).json({ success: true, evenement: normaliserEvenement(rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.put('/:id', async (req, res) => {
  const { titre, description, date, heure, lieu, categorie, maxInscrits, organisateur } = req.body;
  try {
    await pool.query(
      `UPDATE evenements SET
        titre=COALESCE(?,titre), description=COALESCE(?,description),
        date=COALESCE(?,date), heure=COALESCE(?,heure),
        lieu=COALESCE(?,lieu), categorie=COALESCE(?,categorie),
        max_inscrits=COALESCE(?,max_inscrits), organisateur=COALESCE(?,organisateur)
      WHERE id=?`,
      [titre, description, date, heure, lieu, categorie, maxInscrits, organisateur, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM evenements WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, erreur: 'Événement introuvable' });
    res.json({ success: true, evenement: normaliserEvenement(rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.post('/:id/inscrire', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT inscrits, max_inscrits FROM evenements WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, erreur: 'Événement introuvable' });

    if (rows[0].inscrits >= rows[0].max_inscrits) {
      return res.status(400).json({ success: false, erreur: 'L\'événement est complet' });
    }

    await pool.query('UPDATE evenements SET inscrits = inscrits + 1 WHERE id = ?', [req.params.id]);
    const [updated] = await pool.query('SELECT inscrits, max_inscrits FROM evenements WHERE id = ?', [req.params.id]);
    res.json({ success: true, inscrits: updated[0].inscrits, maxInscrits: updated[0].max_inscrits });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM evenements WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, erreur: 'Événement introuvable' });
    res.json({ success: true, message: 'Événement supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

function normaliserEvenement(row) {
  const heure = row.heure ? String(row.heure).substring(0, 5) : '09:00';
  const date  = row.date instanceof Date ? row.date.toISOString().split('T')[0] : String(row.date);
  return {
    id:           row.id,
    titre:        row.titre,
    description:  row.description,
    date,
    heure,
    lieu:         row.lieu,
    categorie:    row.categorie,
    inscrits:     row.inscrits,
    maxInscrits:  row.max_inscrits,
    organisateur: row.organisateur,
    createdAt:    row.created_at,
  };
}

module.exports = router;
