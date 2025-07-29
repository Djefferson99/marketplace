const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

if (!process.env.AWS_BUCKET_NAME) {
  throw new Error('AWS_BUCKET_NAME não definido nas variáveis de ambiente');
}
if (!process.env.AWS_REGION) {
  throw new Error('AWS_REGION não definido nas variáveis de ambiente');
}

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const storage = multerS3({
  s3,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: 'public-read', // ou remova se bucket privado
  metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
  key: (req, file, cb) => cb(null, `uploads/${Date.now()}_${file.originalname}`),
});

module.exports = multer({ storage });