const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/uploads')),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

router.post('/avatar', upload.single('avatar'), (req, res) => {
  res.json({ url: '/uploads/' + req.file.originalname });
});

router.post('/raw', (req, res) => {
  const target = path.join(__dirname, '../public/uploads', req.query.name);
  fs.writeFileSync(target, req.body.content);
  res.json({ saved: target });
});

router.get('/download', (req, res) => {
  res.download(req.query.path);
});

module.exports = router;
