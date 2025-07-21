const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const pool = require('../database/db'); // seu pool do PG já configurado
const router = express.Router();

// === Configurações Google OAuth2 ===
const CREDENTIALS_PATH = path.join(__dirname, '../google/credentials.json');
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_secret, client_id, redirect_uris } = credentials.web;

const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Função para pegar OAuth client por email (tokens salvos no banco)
async function getOAuthClientByEmail(email) {
  const res = await pool.query(
    'SELECT google_access_token, google_refresh_token FROM prestadores WHERE email = $1',
    [email]
  );

  if (res.rowCount === 0) {
    throw new Error(`Nenhum token encontrado para o email: ${email}`);
  }

  const { google_access_token, google_refresh_token } = res.rows[0];

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  oAuth2Client.setCredentials({
    access_token: google_access_token,
    refresh_token: google_refresh_token,
  });

  return oAuth2Client;
}

// === Rotas ===

// 1. Rota para iniciar autenticação Google
router.get('/auth/google', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).send('Email é obrigatório!');

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent',
    state: email, // para recuperar email no callback
  });

  res.redirect(authUrl);
});

// 2. Callback do Google OAuth2
router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const email = req.query.state;

  if (!code || !email) return res.status(400).send('Código ou email ausente.');

  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Salvar ou atualizar tokens no banco
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
    console.error('Erro no callback OAuth:', err);
    res.status(500).send('Erro ao conectar com Google.');
  }
});

// 3. Listar horários ocupados do prestador
router.get('/agenda/ocupados/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const auth = await getOAuthClientByEmail(email);
    const calendar = google.calendar({ version: 'v3', auth });

    const now = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7); // próximos 7 dias

    const result = await calendar.freebusy.query({
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: end.toISOString(),
        timeZone: 'America/Sao_Paulo',
        items: [{ id: email }],
      },
    });

    const busyTimes = result.data.calendars[email].busy;
    res.json({ ocupado: busyTimes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar horários ocupados');
  }
});

// 4. Criar evento/agendamento no Google Calendar
router.post('/agenda/agendar', async (req, res) => {
  const { prestadorEmail, clienteNome, horarioInicio, horarioFim, descricao } = req.body;

  console.log('Recebido agendamento:', { prestadorEmail, clienteNome, horarioInicio, horarioFim, descricao });

  try {
    const auth = await getOAuthClientByEmail(prestadorEmail);
    console.log('OAuth Client obtido com sucesso para:', prestadorEmail);

    const calendar = google.calendar({ version: 'v3', auth });

    const evento = {
      summary: `Agendamento com ${clienteNome}`,
      description: descricao || '',
      start: {
        dateTime: horarioInicio,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: horarioFim,
        timeZone: 'America/Sao_Paulo',
      },
    };

    console.log('Evento a ser criado:', evento);

    const result = await calendar.events.insert({
      calendarId: 'primary',
      resource: evento,
    });

    console.log('Evento criado com sucesso:', result.data);

    res.json({ sucesso: true, eventoCriado: result.data });
  } catch (err) {
    console.error('Erro ao criar evento na agenda:', err);
    res.status(500).send('Erro ao criar evento na agenda');
  }
});

module.exports = router;
