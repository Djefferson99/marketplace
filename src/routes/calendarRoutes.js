const express = require('express');
const { google } = require('googleapis');
const { getOAuthClientByEmail } = require('../google/calendarUtils');

const router = express.Router();

// Listar eventos ocupados
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

// Criar evento (agendamento)
router.post('/agenda/agendar', async (req, res) => {
  const { prestadorEmail, clienteNome, horarioInicio, horarioFim, descricao } = req.body;

  try {
    const auth = await getOAuthClientByEmail(prestadorEmail);
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

    const result = await calendar.events.insert({
      calendarId: 'primary',
      resource: evento,
    });

    res.json({ sucesso: true, eventoCriado: result.data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar evento na agenda');
  }
});

module.exports = router;
