const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Caminho para o arquivo JSON da credencial (OAuth2 ou service account)
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Inicializa o cliente OAuth2 (para autenticação)
// Você deve configurar suas credenciais no Google Cloud e baixar o JSON
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

let oAuth2Client;

function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Carregar token salvo
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
  } else {
    console.log("Token não encontrado. Gere um novo token.");
  }
}

// Função para listar eventos do calendário
async function listarEventos(calendarId = 'primary', maxResults = 10) {
  if (!oAuth2Client) authorize();

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const res = await calendar.events.list({
    calendarId,
    maxResults,
    singleEvents: true,
    orderBy: 'startTime',
  });
  return res.data.items;
}

// Função para criar evento no calendário
async function criarEvento(evento, calendarId = 'primary') {
  if (!oAuth2Client) authorize();

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const res = await calendar.events.insert({
    calendarId,
    resource: evento,
  });

  return res.data;
}

// Função para deletar evento pelo id
async function deletarEvento(eventId, calendarId = 'primary') {
  if (!oAuth2Client) authorize();

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  await calendar.events.delete({
    calendarId,
    eventId,
  });
}

module.exports = {
  authorize,
  listarEventos,
  criarEvento,
  deletarEvento,
};
