const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pasta onde as imagens serão salvas
const uploadsDir = path.resolve(__dirname, '..', '..', 'img', 'imgPerfil');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Somente imagens são permitidas!'), false);
};

module.exports = multer({ storage, fileFilter });
