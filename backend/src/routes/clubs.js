const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    let sql = 'SELECT * FROM clubs WHERE 1=1';
    const params = [];

    if (req.query.categorie && req.query.categorie !== 'tous') {
      sql += ' AND categorie = ?';
      params.push(req.query.categorie);
    }
    if (req.query.recherche) {
      sql += ' AND (nom LIKE ? OR description LIKE ?)';
      const t = `%${req.query.recherche}%`;
      params.push(t, t);
    }
    sql += ' ORDER BY membres DESC';

    const [rows] = await pool.query(sql, params);
    const clubs = rows.map(normaliserClub);
    res.json({ success: true, total: clubs.length, clubs });
  } catch (err) {
    console.error('GET /clubs:', err.message);
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clubs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, erreur: 'Club introuvable' });
    res.json({ success: true, club: normaliserClub(rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.post('/', async (req, res) => {
  const { nom, description, categorie, categorieNom, icone, lien } = req.body;
  if (!nom || !categorie) {
    return res.status(400).json({ success: false, erreur: 'Nom et catégorie obligatoires' });
  }
  try {
    await pool.query(
      'INSERT INTO clubs (nom, description, categorie, categorie_nom, icone, lien) VALUES (?, ?, ?, ?, ?, ?)',
      [nom, description || null, categorie, categorieNom || categorie, icone || 'fa-users', lien || null]
    );
    const [rows] = await pool.query('SELECT * FROM clubs WHERE nom = ? ORDER BY created_at DESC LIMIT 1', [nom]);
    res.status(201).json({ success: true, club: normaliserClub(rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.put('/:id', async (req, res) => {
  const { nom, description, categorie, categorieNom, icone, lien } = req.body;
  try {
    await pool.query(
      `UPDATE clubs SET nom=COALESCE(?,nom), description=COALESCE(?,description),
       categorie=COALESCE(?,categorie), categorie_nom=COALESCE(?,categorie_nom),
       icone=COALESCE(?,icone), lien=COALESCE(?,lien) WHERE id=?`,
      [nom, description, categorie, categorieNom, icone, lien, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM clubs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, erreur: 'Club introuvable' });
    res.json({ success: true, club: normaliserClub(rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM clubs WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, erreur: 'Club introuvable' });
    res.json({ success: true, message: 'Club supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.post('/:id/rejoindre', async (req, res) => {
  try {
    await pool.query('UPDATE clubs SET membres = membres + 1 WHERE id = ?', [req.params.id]);
    const [rows] = await pool.query('SELECT membres FROM clubs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, erreur: 'Club introuvable' });
    res.json({ success: true, membres: rows[0].membres });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

function normaliserClub(row) {
  return {
    id:           row.id,
    nom:          row.nom,
    description:  row.description,
    membres:      row.membres,
    categorie:    row.categorie,
    categorieNom: row.categorie_nom,
    icone:        row.icone,
    lien:         row.lien,
  };
}

module.exports = router;
