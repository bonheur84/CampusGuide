const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'campusguide_secret';

const authentifier = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ success: false, erreur: 'Token manquant — authentification requise' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.utilisateur = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ success: false, erreur: 'Token invalide ou expiré' });
  }
};

const authentifierOptionnel = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      req.utilisateur = jwt.verify(token, SECRET);
    } catch { }
  }
  next();
};

const genererToken = (utilisateur) => {
  return jwt.sign(
    { id: utilisateur.id, email: utilisateur.email, role: utilisateur.role },
    SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = { authentifier, authentifierOptionnel, genererToken };
