const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const pool = require('../db'); // seu cliente pg já configurado

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

let credentials;
let { client_secret, client_id, redirect_uris } = {};

// Carrega credenciais uma vez só
function loadCredentials() {
  if (!credentials) {
    credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const c = credentials.installed || credentials.web;
    client_id = c.client_id;
    client_secret = c.client_secret;
    redirect_uris = c.redirect_uris;
  }
}

async function getOAuthClientByEmail(email) {
  loadCredentials();

  // Busca tokens no banco para o email do prestador
  const res = await pool.query(
    'SELECT google_access_token, google_refresh_token FROM prestadores WHERE email = $1',
    [email]
  );

  if (res.rowCount === 0) {
    throw new Error(`Nenhum token encontrado para o email: ${email}`);
  }

  const { google_access_token, google_refresh_token } = res.rows[0];

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Setar tokens no cliente
  oAuth2Client.setCredentials({
    access_token: google_access_token,
    refresh_token: google_refresh_token,
  });

  return oAuth2Client;
}

module.exports = {
  getOAuthClientByEmail,
};
