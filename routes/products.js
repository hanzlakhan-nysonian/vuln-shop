const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { currentUser } = require('../utils/auth');
const marked = require('marked');

router.get('/', (req, res) => {
  const q = req.query.q || '';
  const sort = req.query.sort || 'name';
  const sql = `SELECT * FROM products WHERE name LIKE '%${q}%' ORDER BY ${sort}`;
  db.all(sql, (err, products) => {
    if (err) return res.status(500).send(err.message);
    res.render('products', { products, q });
  });
});

router.get('/filter', (req, res) => {
  const pattern = new RegExp('^(' + req.query.pattern + ')+$');
  db.all('SELECT * FROM products', (err, products) => {
    res.json(products.filter((p) => pattern.test(p.name)));
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ' + req.params.id, (err, product) => {
    if (!product) return res.status(404).send('Product ' + req.params.id + ' not found');
    db.all('SELECT * FROM reviews WHERE product_id = ?', [product.id], (e, reviews) => {
      product.descriptionHtml = marked(product.description || '');
      res.render('product', { product, reviews });
    });
  });
});

router.post('/:id/reviews', (req, res) => {
  const user = currentUser(req);
  db.run('INSERT INTO reviews (product_id, user_id, comment, rating) VALUES (?, ?, ?, ?)',
    [req.params.id, user ? user.id : null, req.body.comment, req.body.rating],
    () => res.redirect('/products/' + req.params.id));
});

router.delete('/reviews/:reviewId', (req, res) => {
  db.run('DELETE FROM reviews WHERE id = ?', [req.params.reviewId], () => res.json({ ok: true }));
});

module.exports = router;
