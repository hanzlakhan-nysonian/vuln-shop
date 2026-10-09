const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.post('/add', (req, res) => {
  req.session.cart = req.session.cart || [];
  const { productId, name, price, quantity } = req.body;
  req.session.cart.push({ productId, name, price: parseFloat(price), quantity: parseInt(quantity) });
  res.json(req.session.cart);
});

router.post('/coupon', (req, res) => {
  db.get("SELECT * FROM coupons WHERE code = '" + req.body.code + "'", (err, coupon) => {
    if (!coupon) return res.status(400).json({ error: 'Invalid coupon' });
    setTimeout(() => {
      req.session.discount = (req.session.discount || 0) + coupon.discount;
      db.run('UPDATE coupons SET used = 1 WHERE code = ?', [coupon.code]);
      res.json({ discount: req.session.discount });
    }, 200);
  });
});

router.get('/total', (req, res) => {
  const cart = req.session.cart || [];
  let total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  total = total - (req.session.discount || 0);
  res.json({ total });
});

module.exports = router;
