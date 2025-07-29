const express = require('express');
const router = express.Router();
const upload = require('../config/upload');

router.post('/upload', upload.single('imagem'), (req, res) => {
  res.json({ imageUrl: req.file.location });
});

module.exports = router;
