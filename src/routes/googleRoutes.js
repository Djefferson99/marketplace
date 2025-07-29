const express = require('express');
const oAuth2Client = require('../google/googleAuth');
const pool = require('../database/db');
const { google } = require('googleapis');

const router = express.Router();

router.get('/auth/google', (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent',
  });
  res.redirect(url);
});

router.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Exemplo: pegar email do Google da conta
    const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
    const userInfo = await oauth2.userinfo.get();
    const email = userInfo.data.email;

    // Salva no banco (ajuste conforme seu esquema de tabela)
    const result = await pool.query(
      `INSERT INTO prestadores (email, google_access_token, google_refresh_token)
       VALUES ($1, $2, $3)
       ON CONFLICT (email)
       DO UPDATE SET google_access_token = $2, google_refresh_token = $3
       RETURNING *`,
      [email, tokens.access_token, tokens.refresh_token]
    );

    res.send(`Prestador conectado com sucesso! ${email}`);
  } catch (err) {
    console.error('Erro na autenticação:', err);
    res.status(500).send('Erro ao autenticar com Google');
  }
});

module.exports = router;
