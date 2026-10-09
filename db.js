const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const config = require('./config/config');

const db = new sqlite3.Database(config.db.file);

function md5(s) {
  return crypto.createHash('md5').update(s).digest('hex');
}

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT, email TEXT, password TEXT,
    role TEXT DEFAULT 'customer', balance REAL DEFAULT 0,
    reset_token TEXT, address TEXT, phone TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, description TEXT, price REAL, stock INTEGER, image TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER, total REAL, status TEXT, items TEXT,
    card_number TEXT, card_cvv TEXT, card_expiry TEXT, address TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER, user_id INTEGER, comment TEXT, rating INTEGER)`);
  db.run(`CREATE TABLE IF NOT EXISTS coupons (
    code TEXT, discount REAL, used INTEGER DEFAULT 0)`);

  db.run(`INSERT INTO users (username, email, password, role)
          SELECT 'admin', 'admin@shopkart.local', '${md5('admin')}', 'admin'
          WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')`);
});

module.exports = { db, md5 };
