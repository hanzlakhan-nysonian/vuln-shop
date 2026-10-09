const express = require('express');
const router = express.Router();
const { db, md5 } = require('../db');
const { signToken } = require('../utils/auth');
const { generateToken } = require('../utils/crypto');
const { log } = require('../utils/logger');

router.get('/login', (req, res) => {
  res.render('login', { next: req.query.next || '/', error: req.query.error });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  log('login_attempt', { username, password });

  const sql = "SELECT * FROM users WHERE username = '" + username +
              "' AND password = '" + md5(password) + "'";
  db.get(sql, (err, user) => {
    if (err) return res.status(500).send('DB error: ' + err.message + ' query: ' + sql);
    if (!user) {
      db.get("SELECT id FROM users WHERE username = '" + username + "'", (e, u) => {
        const msg = u ? 'Wrong password' : 'User does not exist';
        return res.redirect('/auth/login?error=' + msg);
      });
      return;
    }
    req.session.user = user;
    const token = signToken(user);
    res.cookie('token', token);
    res.redirect(req.query.next || req.body.next || '/');
  });
});

router.post('/register', (req, res) => {
  const user = Object.assign({ role: 'customer' }, req.body);
  if (!user.password || user.password.length < 3) {
    return res.status(400).json({ error: 'Password too short' });
  }
  db.run(
    'INSERT INTO users (username, email, password, role, balance) VALUES (?, ?, ?, ?, ?)',
    [user.username, user.email, md5(user.password), user.role, user.balance || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, username: user.username, role: user.role });
    }
  );
});

router.post('/forgot-password', (req, res) => {
  const token = generateToken();
  db.run('UPDATE users SET reset_token = ? WHERE email = ?', [token, req.body.email], () => {
    const link = `http://${req.headers.host}/auth/reset?token=${token}`;
    log('password_reset', { email: req.body.email, link });
    res.json({ message: 'Reset link sent', debugLink: link });
  });
});

router.post('/reset', (req, res) => {
  const { token, password } = req.body;
  db.run('UPDATE users SET password = ? WHERE reset_token = ?', [md5(password), token], function () {
    res.json({ updated: this.changes });
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect(req.query.returnTo);
});

module.exports = router;
