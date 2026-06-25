const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authentifier } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

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

    // Ajouter les statistiques de rating pour chaque club
    for (const club of clubs) {
      const [stats] = await pool.query(
        'SELECT AVG(note) as moyenne, COUNT(*) as total FROM ratings_clubs WHERE club_id = ?',
        [club.id]
      );
      club.moyenneRating = parseFloat(stats[0].moyenne || 0).toFixed(1);
      club.totalVotes = stats[0].total;
    }

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
  const { nom, description, categorie, categorieNom, icone, lien, competences } = req.body;
  if (!nom || !categorie) {
    return res.status(400).json({ success: false, erreur: 'Nom et catégorie obligatoires' });
  }
  try {
    await pool.query(
      'INSERT INTO clubs (nom, description, categorie, categorie_nom, icone, lien, competences) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, description || null, categorie, categorieNom || categorie, icone || 'fa-users', lien || null, competences ? JSON.stringify(competences) : null]
    );
    const [rows] = await pool.query('SELECT * FROM clubs WHERE nom = ? ORDER BY created_at DESC LIMIT 1', [nom]);
    res.status(201).json({ success: true, club: normaliserClub(rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

router.put('/:id', async (req, res) => {
  const { nom, description, categorie, categorieNom, icone, lien, competences } = req.body;
  try {
    await pool.query(
      `UPDATE clubs SET nom=COALESCE(?,nom), description=COALESCE(?,description),
       categorie=COALESCE(?,categorie), categorie_nom=COALESCE(?,categorie_nom),
       icone=COALESCE(?,icone), lien=COALESCE(?,lien), competences=COALESCE(?,competences) WHERE id=?`,
      [nom, description, categorie, categorieNom, icone, lien, competences ? JSON.stringify(competences) : null, req.params.id]
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

// POST /api/clubs/:id/rate — Noter un club
router.post('/:id/rate', authentifier, async (req, res) => {
  const { note } = req.body;
  if (!note || note < 1 || note > 5) {
    return res.status(400).json({ success: false, erreur: 'La note doit être entre 1 et 5' });
  }

  try {
    const ratingId = uuidv4();
    
    // Insérer ou mettre à jour le vote (ON DUPLICATE KEY UPDATE)
    await pool.query(
      `INSERT INTO ratings_clubs (id, club_id, utilisateur_id, note) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE note = ?, updated_at = CURRENT_TIMESTAMP`,
      [ratingId, req.params.id, req.utilisateur.id, note, note]
    );

    // Récupérer les statistiques mises à jour
    const [stats] = await pool.query(
      'SELECT AVG(note) as moyenne, COUNT(*) as total FROM ratings_clubs WHERE club_id = ?',
      [req.params.id]
    );

    res.json({ 
      success: true, 
      moyenne: parseFloat(stats[0].moyenne || 0).toFixed(1),
      totalVotes: stats[0].total
    });
  } catch (err) {
    console.error('Erreur notation:', err);
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

// GET /api/clubs/:id/ratings — Obtenir les statistiques de notation
router.get('/:id/ratings', async (req, res) => {
  try {
    const [stats] = await pool.query(
      'SELECT AVG(note) as moyenne, COUNT(*) as total FROM ratings_clubs WHERE club_id = ?',
      [req.params.id]
    );

    res.json({ 
      success: true, 
      moyenne: parseFloat(stats[0].moyenne || 0).toFixed(1),
      totalVotes: stats[0].total
    });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

// GET /api/clubs/:id/my-rating — Obtenir la note de l'utilisateur connecté
router.get('/:id/my-rating', authentifier, async (req, res) => {
  try {
    const [rating] = await pool.query(
      'SELECT note FROM ratings_clubs WHERE club_id = ? AND utilisateur_id = ?',
      [req.params.id, req.utilisateur.id]
    );

    res.json({ 
      success: true, 
      note: rating.length > 0 ? rating[0].note : null
    });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

function normaliserClub(row) {
  let competences = null;
  if (row.competences) {
    try {
      // Si c'est déjà un tableau, l'utiliser directement
      if (Array.isArray(row.competences)) {
        competences = row.competences;
      } else if (typeof row.competences === 'string') {
        // Essayer de parser comme JSON d'abord
        try {
          competences = JSON.parse(row.competences);
        } catch (e) {
          // Si ça échoue, traiter comme une chaîne séparée par des virgules
          competences = row.competences.split(',').map(comp => comp.trim());
        }
      }
    } catch (e) {
      console.error('Erreur parsing competences:', e);
      competences = null;
    }
  }
  
  return {
    id:           row.id,
    nom:          row.nom,
    description:  row.description,
    membres:      row.membres,
    categorie:    row.categorie,
    categorieNom: row.categorie_nom,
    icone:        row.icone,
    lien:         row.lien,
    competences:  competences,
  };
}

module.exports = router;
