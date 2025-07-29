// routes/s3.js
const express = require("express");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
const { S3Client } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const mime = require("mime-types");

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.post("/s3/presign", async (req, res) => {
  try {
    const { fileName, fileType, folder = "uploads" } = req.body;
    if (!fileName || !fileType) {
      return res.status(400).json({ error: "fileName e fileType são obrigatórios" });
    }

    const ext = mime.extension(fileType) || "bin";
    const key = `${folder}/${Date.now()}-${uuidv4()}.${ext}`;
    const maxBytes = (Number(process.env.MAX_UPLOAD_MB) || 10) * 1024 * 1024;

    const { url, fields } = await createPresignedPost(s3, {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Conditions: [
        ["content-length-range", 0, maxBytes],
        ["starts-with", "$Content-Type", fileType.split("/")[0] + "/"],
      ],
      Expires: 60, // segundos
    });

    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    res.json({ url, fields, key, publicUrl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Falha ao gerar URL assinada" });
  }
});

module.exports = router;
