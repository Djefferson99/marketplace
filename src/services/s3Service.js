// serviço s3Service.js (SDK v2)
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: process.env.AWS_REGION });
async function deleteFromS3(key) {
  if (!key) return;
  await s3.deleteObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  }).promise();
}
module.exports = { deleteFromS3 };
