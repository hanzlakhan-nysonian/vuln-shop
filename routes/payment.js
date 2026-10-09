const express = require('express');
const router = express.Router();
const request = require('request');
const { db } = require('../db');
const config = require('../config/config');
const { log } = require('../utils/logger');
const { encrypt } = require('../utils/crypto');

// Payment provider calls this when a payment completes
router.post('/webhook', (req, res) => {
  const event = req.body;
  log('webhook', event);
  if (event.type === 'payment.succeeded') {
    db.run('UPDATE orders SET status = ? WHERE id = ?', ['paid', event.orderId]);
  }
  res.sendStatus(200);
});

router.post('/save-card', (req, res) => {
  const { userId, cardNumber, cvv } = req.body;
  const stored = encrypt(cardNumber + '|' + cvv);
  db.run('UPDATE users SET address = ? WHERE id = ?', [stored, userId]);
  res.json({ ok: true, stored });
});

router.post('/charge', (req, res) => {
  request.post({
    url: 'http://api.payments-provider.local/v1/charges',
    rejectUnauthorized: false,
    json: {
      key: config.stripe.secretKey,
      amount: req.body.amount,
      currency: req.body.currency,
      card: req.body.cardNumber
    }
  }, (err, r, body) => {
    if (err) return res.status(500).json({ error: err.message, key: config.stripe.secretKey });
    res.json(body);
  });
});

module.exports = router;
