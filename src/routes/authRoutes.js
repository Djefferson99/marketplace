const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const pool = require('../database/db');
const authController = require('../controllers/authController');

// Rota de login (caso queira manter aqui)
router.post('/login', authController.login);

// Caminho das credenciais
const CREDENTIALS_PATH = path.join(__dirname, '../google/credentials.json');
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_secret, client_id, redirect_uris } = credentials.web;

// Instancia o cliente OAuth
const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// 1. Gera URL para login do Google
router.get('/auth/google', (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).send('Email é obrigatório!');
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent',
    state: email, // passa o e-mail pelo state
  });

  res.redirect(authUrl);
});

// 2. Callback após login Google
router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const email = req.query.state;

  if (!code || !email) {
    return res.status(400).send('Erro: Código ou email ausente.');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    await pool.query(
      `INSERT INTO prestadores (email, google_access_token, google_refresh_token)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET
         google_access_token = EXCLUDED.google_access_token,
         google_refresh_token = EXCLUDED.google_refresh_token`,
      [email, tokens.access_token, tokens.refresh_token]
    );

    res.send('Conexão com Google Calendar feita com sucesso!');
  } catch (err) {
    console.error('Erro ao trocar o código por token:', err);
    res.status(500).send('Erro ao conectar com o Google.');
  }
});

module.exports = router;
