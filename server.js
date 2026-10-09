const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('./config/config');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
app.use(cookieParser());
app.use(session({
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: false, secure: false }
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(__dirname));

app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/orders', require('./routes/orders'));
app.use('/users', require('./routes/users'));
app.use('/admin', require('./routes/admin'));
app.use('/upload', require('./routes/upload'));
app.use('/payment', require('./routes/payment'));

app.get('/', (req, res) => res.redirect('/products'));

app.get('/debug/env', (req, res) => {
  res.json({ env: process.env, config });
});

app.use((err, req, res, next) => {
  res.status(500).send(`<h1>Error</h1><pre>${err.stack}</pre><p>${req.url}</p>`);
});

app.listen(config.port, '0.0.0.0', () => console.log('ShopKart running on ' + config.port));
