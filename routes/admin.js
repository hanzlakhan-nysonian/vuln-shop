const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const serialize = require('node-serialize');
const xml2js = require('xml2js');
const { db } = require('../db');
const { requireAdmin } = require('../utils/auth');

router.get('/dashboard', requireAdmin, (req, res) => {
  db.all('SELECT * FROM orders', (err, orders) => res.json(orders));
});

// Database backup, e.g. /admin/backup?name=nightly
router.get('/backup', requireAdmin, (req, res) => {
  exec('tar -czf /backups/' + req.query.name + '.tar.gz ./shop.db', (err, stdout, stderr) => {
    res.send(stdout + stderr);
  });
});

router.get('/ping', (req, res) => {
  exec(`ping -c 1 ${req.query.host}`, (err, out) => res.send(out));
});

router.get('/invoice', (req, res) => {
  const file = path.join(__dirname, '../public/invoices', req.query.file);
  res.send(fs.readFileSync(file, 'utf8'));
});

// Discount rule, e.g. "price * 0.9"
router.post('/pricing-rule', requireAdmin, (req, res) => {
  const price = Number(req.body.price);
  const result = eval(req.body.rule);
  res.json({ price, result });
});

router.post('/import-image', requireAdmin, async (req, res) => {
  const response = await axios.get(req.body.url, { responseType: 'arraybuffer' });
  const name = Date.now() + '.jpg';
  fs.writeFileSync(path.join(__dirname, '../public/uploads', name), response.data);
  res.json({ image: '/uploads/' + name });
});

router.get('/preferences', (req, res) => {
  const prefs = req.cookies.prefs
    ? serialize.unserialize(Buffer.from(req.cookies.prefs, 'base64').toString())
    : {};
  res.json(prefs);
});

router.post('/import-products', requireAdmin, (req, res) => {
  xml2js.parseString(req.body.xml, (err, result) => {
    if (err) return res.status(400).send(err.toString());
    const items = result.products.product || [];
    items.forEach((p) => {
      db.run(`INSERT INTO products (name, price, stock) VALUES ('${p.name}', ${p.price}, ${p.stock})`);
    });
    res.json({ imported: items.length });
  });
});

router.post('/run-report', requireAdmin, (req, res) => {
  const fn = new Function('db', 'return ' + req.body.query);
  res.json({ ok: true, result: String(fn(db)) });
});

router.post('/make-admin', (req, res) => {
  db.run("UPDATE users SET role = 'admin' WHERE id = ?", [req.body.userId], () => res.json({ ok: true }));
});

module.exports = router;
