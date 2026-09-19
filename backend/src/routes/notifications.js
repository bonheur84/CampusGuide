const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authentifier } = require('../middleware/auth');

const buildNotificationResult = (rows = []) => rows.map((notification) => ({
  ...notification,
  lue: notification.lu === 1 || notification.lue === 1,
  lu: notification.lu === 1 || notification.lue === 1,
}));

router.get('/', authentifier, async (req, res) => {
  try {
    const userId = req.utilisateur.id;

    const [notifications] = await pool.query(
      `SELECT n.*,
         CASE
           WHEN n.type = 'message' THEN (SELECT nom FROM utilisateurs WHERE id = n.utilisateur_id)
           WHEN n.type = 'mentor' THEN (SELECT nom FROM mentors WHERE id = n.utilisateur_id)
           ELSE NULL
         END as source_nom
       FROM notifications n
       WHERE n.utilisateur_id = ?
       ORDER BY n.created_at DESC
       LIMIT 50`,
      [userId]
    );

    res.json({ success: true, notifications: buildNotificationResult(notifications) });
  } catch (error) {
    console.error('Erreur récupération notifications:', error);
    res.status(500).json({ success: false, erreur: 'Erreur lors de la récupération des notifications' });
  }
});

router.get('/:userId', authentifier, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.utilisateur.id !== userId && req.utilisateur.role !== 'admin') {
      return res.status(403).json({ success: false, erreur: 'Accès refusé' });
    }

    const [notifications] = await pool.query(
      `SELECT n.*,
         CASE
           WHEN n.type = 'message' THEN (SELECT nom FROM utilisateurs WHERE id = n.utilisateur_id)
           WHEN n.type = 'mentor' THEN (SELECT nom FROM mentors WHERE id = n.utilisateur_id)
           ELSE NULL
         END as source_nom
       FROM notifications n
       WHERE n.utilisateur_id = ?
       ORDER BY n.created_at DESC
       LIMIT 50`,
      [userId]
    );

    res.json({ success: true, notifications: buildNotificationResult(notifications) });
  } catch (error) {
    console.error('Erreur récupération notifications:', error);
    res.status(500).json({ success: false, erreur: 'Erreur lors de la récupération des notifications' });
  }
});

router.put('/:id/lire', authentifier, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE notifications SET lu = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Notification marquée comme lue' });
  } catch (error) {
    console.error('Erreur marquer notification lue:', error);
    res.status(500).json({ success: false, erreur: 'Erreur lors du marquage de la notification' });
  }
});

router.put('/:id/lu', authentifier, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE notifications SET lu = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Notification marquée comme lue' });
  } catch (error) {
    console.error('Erreur marquer notification lue:', error);
    res.status(500).json({ success: false, erreur: 'Erreur lors du marquage de la notification' });
  }
});

router.put('/lire-tout', authentifier, async (req, res) => {
  try {
    const userId = req.utilisateur.id;
    await pool.query('UPDATE notifications SET lu = 1 WHERE utilisateur_id = ?', [userId]);
    res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    console.error('Erreur marquer tout lu:', error);
    res.status(500).json({ success: false, erreur: 'Erreur lors du marquage des notifications' });
  }
});

router.put('/:userId/tout-lu', authentifier, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.utilisateur.id !== userId && req.utilisateur.role !== 'admin') {
      return res.status(403).json({ success: false, erreur: 'Accès refusé' });
    }

    await pool.query('UPDATE notifications SET lu = 1 WHERE utilisateur_id = ?', [userId]);
    res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    console.error('Erreur marquer tout lu:', error);
    res.status(500).json({ success: false, erreur: 'Erreur lors du marquage des notifications' });
  }
});

router.post('/', authentifier, async (req, res) => {
  try {
    const { utilisateur_id, type, titre, description, icone } = req.body;

    if (!utilisateur_id || !type || !titre) {
      return res.status(400).json({ success: false, erreur: 'Champs requis: utilisateur_id, type, titre' });
    }

    if (req.utilisateur.id !== utilisateur_id && req.utilisateur.role !== 'admin') {
      return res.status(403).json({ success: false, erreur: 'Accès refusé' });
    }

    const [result] = await pool.query(
      'INSERT INTO notifications (utilisateur_id, type, titre, description, icone, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [utilisateur_id, type, titre, description || null, icone || 'fa-bell']
    );

    res.status(201).json({ success: true, message: 'Notification créée avec succès', id: result.insertId });
  } catch (error) {
    console.error('Erreur création notification:', error);
    res.status(500).json({ success: false, erreur: 'Erreur lors de la création de la notification' });
  }
});

router.get('/:userId/non-lues', authentifier, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.utilisateur.id !== userId && req.utilisateur.role !== 'admin') {
      return res.status(403).json({ success: false, erreur: 'Accès refusé' });
    }

    const [result] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE utilisateur_id = ? AND lu = 0',
      [userId]
    );

    res.json({ success: true, nonLues: result[0].count });
  } catch (error) {
    console.error('Erreur compteur notifications:', error);
    res.status(500).json({ success: false, erreur: 'Erreur lors du comptage des notifications' });
  }
});

router.delete('/:id', authentifier, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM notifications WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, erreur: 'Notification introuvable' });
    }
    res.json({ success: true, message: 'Notification supprimée' });
  } catch (error) {
    console.error('Erreur suppression notification:', error);
    res.status(500).json({ success: false, erreur: 'Erreur lors de la suppression de la notification' });
  }
});

module.exports = router;
