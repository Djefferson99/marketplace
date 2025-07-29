const { google } = require('googleapis');
const pool = require('../database/db'); // seu cliente pg já configurado

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

let client_id = process.env.GOOGLE_CLIENT_ID;
let client_secret = process.env.GOOGLE_CLIENT_SECRET;
let redirect_uris;

try {
  // O valor da variável precisa ser um JSON stringificado, tipo: '["https://www.indca.com.br"]'
  redirect_uris = JSON.parse(process.env.GOOGLE_REDIRECT_URIS || '["http://localhost"]');
} catch (err) {
  console.error('Erro ao fazer parse do REDIRECT_URIS:', err);
  redirect_uris = ["http://localhost"];
}

async function getOAuthClientByEmail(email) {
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
