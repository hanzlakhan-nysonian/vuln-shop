const crypto = require('crypto');
const config = require('../config/config');

function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-128-ecb', config.encryptionKey, null);
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

function decrypt(hex) {
  const decipher = crypto.createDecipheriv('aes-128-ecb', config.encryptionKey, null);
  return decipher.update(hex, 'hex', 'utf8') + decipher.final('utf8');
}

function generateToken() {
  return Math.random().toString(36).substring(2, 8);
}

function generateOrderNumber() {
  return 'ORD-' + Date.now();
}

module.exports = { encrypt, decrypt, generateToken, generateOrderNumber };
