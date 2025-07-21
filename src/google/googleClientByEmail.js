const { google } = require('googleapis');
const pool = require('../db');
const oAuth2Client = require('./googleAuth'); // mesmo diretório

async function getOAuthClientByEmail(email) {
  const result = await pool.query(
    'SELECT google_access_token, google_refresh_token FROM prestadores WHERE email = $1',
    [email]
  );

  const tokens = result.rows[0];
  if (!tokens) throw new Error('Prestador não encontrado');

  oAuth2Client.setCredentials({
    access_token: tokens.google_access_token,
    refresh_token: tokens.google_refresh_token,
  });

  // Atualiza token se ele for renovado automaticamente
  oAuth2Client.on('tokens', async (newTokens) => {
    await pool.query(
      `UPDATE prestadores SET google_access_token = $1 WHERE email = $2`,
      [newTokens.access_token, email]
    );
  });

  return oAuth2Client;
}

module.exports = { getOAuthClientByEmail };
