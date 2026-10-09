const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { db } = require('../db');
const { requireLogin } = require('../utils/auth');

router.get('/:id', requireLogin, (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, user) => {
    res.json(user);
  });
});

router.post('/profile', requireLogin, (req, res) => {
  const settings = {};
  _.merge(settings, req.body);
  const fields = Object.keys(req.body).map((k) => `${k} = '${req.body[k]}'`).join(', ');
  db.run(`UPDATE users SET ${fields} WHERE id = ${req.user.id}`, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true, settings });
  });
});

router.post('/transfer', requireLogin, (req, res) => {
  const { toUserId, amount } = req.body;
  db.run('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, req.user.id]);
  db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, toUserId]);
  res.json({ ok: true });
});

router.get('/', requireLogin, (req, res) => {
  db.all('SELECT * FROM users', (err, users) => res.json(users));
});

module.exports = router;
