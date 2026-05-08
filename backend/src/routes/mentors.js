// =============================================
//  Route API : /api/mentors — MySQL
// =============================================

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authentifier } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// GET /api/mentors/mes-profils — récupère les profils de l'utilisateur connecté
router.get('/mes-profils', authentifier, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM mentors WHERE utilisateur_id = ? ORDER BY created_at DESC',
      [req.utilisateur.id]
    );
    res.json({ success: true, mentors: rows.map(normaliserMentor) });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

// GET /api/mentors — liste avec filtres (uniquement les approuvés pour le public)
router.get('/', async (req, res) => {
  try {
    let sql = "SELECT * FROM mentors WHERE status = 'approuve'";
    const params = [];

    if (req.query.tous === 'true') {
      sql = 'SELECT * FROM mentors WHERE 1=1'; // Pour l'admin
    }

    if (req.query.filiere && req.query.filiere !== 'tous') {
      sql += ' AND filiere = ?';
      params.push(req.query.filiere);
    }
    if (req.query.disponible !== undefined) {
      sql += ' AND disponible = ?';
      params.push(req.query.disponible === 'true' ? 1 : 0);
    }
    if (req.query.recherche) {
      sql += ' AND (nom LIKE ? OR specialite LIKE ?)';
      const terme = `%${req.query.recherche}%`;
      params.push(terme, terme);
    }
    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);
    
    // Construire manuellement les mentors pour forcer le champ telephone
    const mentors = rows.map(row => {
      const mentor = {
        id: row.id,
        nom: row.nom,
        filiere: row.filiere,
        annee: row.annee,
        specialite: row.specialite,
        bio: row.bio,
        photo: row.photo,
        telephone: row.telephone || row.whatsapp_number,
        note: row.note ? parseFloat(row.note) : 0,
        nbEtudiants: row.nb_etudiants,
        disponible: row.disponible,
        status: row.status,
        utilisateurId: row.utilisateur_id,
        createdAt: row.created_at
      };
      return mentor;
    });
    
    res.json({ success: true, total: mentors.length, mentors });
  } catch (err) {
    console.error('GET /mentors:', err.message);
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

// GET /api/mentors/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM mentors WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, erreur: 'Mentor introuvable' });
    res.json({ success: true, mentor: normaliserMentor(rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

// POST /api/mentors — créer (Postulation)
router.post('/', authentifier, async (req, res) => {
  const { nom, filiere, annee, specialite, bio, photo, telephone } = req.body;
  if (!nom || !filiere || !annee || !specialite) {
    return res.status(400).json({ success: false, erreur: 'Champs nom, filiere, annee, specialite obligatoires' });
  }
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const mentorId = uuidv4();
    
    // 1. Créer le mentor
    await connection.query(
      'INSERT INTO mentors (id, utilisateur_id, nom, filiere, annee, specialite, bio, photo, telephone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [mentorId, req.utilisateur.id, nom, filiere, annee, specialite, bio || null, photo || null, telephone || null, 'en_attente']
    );

    // 2. Notifier les admins
    const [admins] = await connection.query("SELECT id FROM utilisateurs WHERE role = 'admin'");
    for (const admin of admins) {
      await connection.query(
        'INSERT INTO notifications (id, utilisateur_id, type, titre, description, icone) VALUES (?, ?, ?, ?, ?, ?)',
        [uuidv4(), admin.id, 'info', 'Nouvelle postulation', `${nom} souhaite devenir mentor.`, 'fa-user-graduate']
      );
    }

    await connection.commit();

    const [rows] = await connection.query('SELECT * FROM mentors WHERE id = ?', [mentorId]);
    res.status(201).json({ success: true, mentor: normaliserMentor(rows[0]) });
  } catch (err) {
    await connection.rollback();
    console.error('ERREUR POST /mentors:', err);
    res.status(500).json({ success: false, erreur: 'Erreur serveur lors de la postulation: ' + err.message });
  } finally {
    connection.release();
  }
});

// PUT /api/mentors/:id/status — Approuver/Rejeter (Admin seulement)
router.put('/:id/status', authentifier, async (req, res) => {
  if (req.utilisateur.role !== 'admin') {
    return res.status(403).json({ success: false, erreur: 'Accès réservé aux administrateurs' });
  }

  const { status } = req.body;
  if (!['en_attente', 'approuve', 'rejete'].includes(status)) {
    return res.status(400).json({ success: false, erreur: 'Statut invalide' });
  }

  try {
    await pool.query('UPDATE mentors SET status = ? WHERE id = ?', [status, req.params.id]);

    // Récupérer les infos du mentor pour notifier l'utilisateur
    const [m] = await pool.query('SELECT utilisateur_id, nom FROM mentors WHERE id = ?', [req.params.id]);

    if (m.length > 0 && m[0].utilisateur_id) {
      const msg = status === 'approuve' ? 'Félicitations ! Votre demande de mentorat a été acceptée.' : 'Désolé, votre demande de mentorat a été refusée.';
      await pool.query(
        'INSERT INTO notifications (utilisateur_id, type, titre, description, icone) VALUES (?, ?, ?, ?, ?)',
        [m[0].utilisateur_id, status === 'approuve' ? 'success' : 'error', 'Statut Mentorat', msg, 'fa-graduation-cap']
      );
    }

    res.json({ success: true, message: `Mentor ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

// PUT /api/mentors/:id — modifier
router.put('/:id', async (req, res) => {
  const { nom, filiere, annee, specialite, bio, photo, telephone, disponible } = req.body;
  try {
    await pool.query(
      `UPDATE mentors SET
        nom       = COALESCE(?, nom),
        filiere   = COALESCE(?, filiere),
        annee     = COALESCE(?, annee),
        specialite= COALESCE(?, specialite),
        bio       = COALESCE(?, bio),
        photo     = COALESCE(?, photo),
        telephone = COALESCE(?, telephone),
        disponible= COALESCE(?, disponible)
      WHERE id = ?`,
      [nom, filiere, annee, specialite, bio, photo, telephone, disponible !== undefined ? (disponible ? 1 : 0) : null, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM mentors WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, erreur: 'Mentor introuvable' });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

// PUT /api/mentors/profil — mettre à jour le profil du mentor connecté
router.put('/profil', authentifier, async (req, res) => {
  try {
    const { nom, filiere, annee, specialite, bio, telephone } = req.body;
    const utilisateurId = req.utilisateur.id;

    // Vérifier que le mentor existe bien
    const [mentorCheck] = await pool.query(
      'SELECT id FROM mentors WHERE utilisateur_id = ?',
      [utilisateurId]
    );

    if (mentorCheck.length === 0) {
      return res.status(404).json({ success: false, erreur: 'Profil mentor introuvable' });
    }

    // Mettre à jour le profil
    const [result] = await pool.query(
      'UPDATE mentors SET nom = ?, filiere = ?, annee = ?, specialite = ?, bio = ?, telephone = ? WHERE utilisateur_id = ?',
      [nom, filiere, annee, specialite, bio, telephone, utilisateurId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, erreur: 'Aucune modification effectuée' });
    }

    res.json({ 
      success: true, 
      message: 'Profil mis à jour avec succès',
      mentor: {
        nom,
        filiere,
        annee,
        specialite,
        bio,
        telephone
      }
    });

  } catch (err) {
    console.error('Erreur mise à jour profil:', err);
    res.status(500).json({ success: false, erreur: 'Erreur serveur lors de la mise à jour' });
  }
});

// DELETE /api/mentors/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM mentors WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, erreur: 'Mentor introuvable' });
    res.json({ success: true, message: 'Mentor supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, erreur: 'Erreur serveur' });
  }
});

// Helper : mapper les colonnes MySQL vers le format attendu par le frontend
const normaliserMentor = (mentor) => {
  const normalized = {
    id: mentor.id,
    nom: mentor.nom,
    filiere: mentor.filiere,
    annee: mentor.annee,
    specialite: mentor.specialite,
    bio: mentor.bio,
    photo: mentor.photo,
    telephone: mentor.telephone || mentor.whatsapp_number || mentor.whatsappNumber,
    note: mentor.note ? parseFloat(mentor.note) : 0,
    nbEtudiants: mentor.nb_etudiants,
    disponible: mentor.disponible,
    status: mentor.status,
    utilisateurId: mentor.utilisateur_id,
    createdAt: mentor.created_at
  };
  
  // Supprimer explicitement whatsappNumber s'il existe
  delete normalized.whatsappNumber;
  
  return normalized;
};

module.exports = router;
