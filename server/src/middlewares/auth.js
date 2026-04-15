const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - decoded:', decoded);

    const [result] = await pool.query(
      'SELECT id, username, email, role, is_active, avatar, nom, prenom, telephone, club_id FROM users WHERE id = ?',
      [decoded.id]
    );
    console.log('Auth middleware - query result:', result);

    if (result.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const user = result[0];
    if (!user.is_active) {
      return res.status(401).json({ success: false, message: 'Account is disabled' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

module.exports = auth;