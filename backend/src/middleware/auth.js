const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
    }

    // Try with primary secret, then fallback
    const secrets = [
      process.env.JWT_SECRET || 'secret',
      'secret',
      'transport2024SecretKey'
    ];

    let decoded = null;
    for (const secret of secrets) {
      try {
        decoded = jwt.verify(token, secret);
        break;
      } catch {}
    }

    if (!decoded) {
      return res.status(401).json({ error: 'Token invalide' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès admin requis' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};