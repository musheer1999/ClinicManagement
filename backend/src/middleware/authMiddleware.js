const { verifyToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.cd_token;
    if (!token) return res.status(401).json({ error: 'Not authenticated. Please login.' });

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired. Please login again.' });
  }
}

function adminMiddleware(req, res, next) {
  try {
    const token = req.cookies?.cd_token;
    if (!token) return res.status(401).json({ error: 'Not authenticated.' });

    const decoded = verifyToken(token);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin access required.' });

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired. Please login again.' });
  }
}

module.exports = { authMiddleware, adminMiddleware };
