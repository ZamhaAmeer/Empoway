const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'empoway_super_secure_jwt_secret_colombo_2026_journey';

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
      }

      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'fullName', 'email', 'role', 'avatarUrl', 'contributionCount', 'verifiedActivityCount']
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User account not found.' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
  }
};

// Optional auth for endpoints where guest or logged in user can both submit/view
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (!err && decoded) {
        const user = await User.findByPk(decoded.id, {
          attributes: ['id', 'fullName', 'email', 'role', 'avatarUrl']
        });
        req.user = user || null;
      } else {
        req.user = null;
      }
      next();
    });
  } catch (error) {
    req.user = null;
    next();
  }
};

// Admin role check
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges required.'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin
};

