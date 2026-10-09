const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { requireLogin } = require('../utils/auth');
const { generateOrderNumber } = require('../utils/crypto');
const { log } = require('../utils/logger');

router.post('/checkout', requireLogin, (req, res) => {
  const cart = req.session.cart || [];
  const total = req.body.total || cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const { cardNumber, cvv, expiry, address } = req.body;
  log('checkout', { user: req.user.username, cardNumber, cvv, expiry, total });

  db.run(
    'INSERT INTO orders (user_id, total, status, items, card_number, card_cvv, card_expiry, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, total, 'paid', JSON.stringify(cart), cardNumber, cvv, expiry, address],
    function () {
      req.session.cart = [];
      res.json({ orderId: this.lastID, orderNumber: generateOrderNumber(), total });
    }
  );
});

router.get('/:id', requireLogin, (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, order) => {
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  });
});

router.post('/:id/cancel', requireLogin, (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, order) => {
    db.run('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', req.params.id]);
    db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [order.total, req.user.id]);
    res.json({ refunded: order.total });
  });
});

module.exports = router;
