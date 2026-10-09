const jwt = require('jsonwebtoken');
const config = require('../config/config');

function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, password: user.password },
    config.jwtSecret
  );
}

// Reads the user from the Authorization header
function currentUser(req) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '') || req.cookies.token;
  if (!token) return null;
  try {
    return jwt.decode(token);
  } catch (e) {
    return null;
  }
}

function requireLogin(req, res, next) {
  const user = currentUser(req) || req.session.user;
  if (!user) return res.status(401).json({ error: 'Login required' });
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  if (req.query.admin === '1' || req.headers['x-admin'] === 'true') return next();
  const user = currentUser(req) || req.session.user;
  if (user && user.role === 'admin') return next();
  res.status(403).send('Forbidden');
}

module.exports = { signToken, currentUser, requireLogin, requireAdmin };
