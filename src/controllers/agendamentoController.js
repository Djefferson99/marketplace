require('dotenv').config();
const Agendamento = require('../models/agendamentoModel');
const Horario = require('../models/horarioModel');
const { Resend } = require('resend');
const axios = require('axios');

const resend = new Resend(process.env.RESEND_API_KEY);

const agendamentoController = {
  create: async (req, res) => {
    try {
      // Criar agendamento
      const agendamento = await Agendamento.create(req.body);

      // Marcar horário como indisponível
      if (req.body.horario_id) {
        await Horario.updateStatus(req.body.horario_id, false);
      }

      // Enviar email de confirmação para o cliente
    await resend.emails.send({
      from: 'Agendamento <sistema@indca.com.br>',
      to: req.body.email_cliente,
      subject: 'Confirmação de Agendamento',
      html: `<p>Olá ${req.body.nome_cliente}, seu agendamento para o serviço <strong>${req.body.servico_titulo}</strong> foi confirmado no dia <strong>${req.body.data}</strong> às <strong>${req.body.hora}</strong>.</p>`,
    });

    // Enviar WhatsApp para a empresa avisando do novo agendamento
    await axios.post(`https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-messages`, {
      phone: req.body.telefone_empresa, // formato: 5511999999999
      message: `📢 Novo agendamento!\nCliente: ${req.body.nome_cliente}\nServiço: ${req.body.servico_titulo}\nData: ${req.body.data} às ${req.body.hora}`
    });

      res.status(201).json(agendamento);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
  },

  getByEmpresa: async (req, res) => {
    try {
      const agendamentos = await Agendamento.findByEmpresa(req.params.empresa_id);
      res.json(agendamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const agendamento = await Agendamento.findById(req.params.id);
      if (!agendamento) return res.status(404).json({ error: 'Agendamento não encontrado' });
      res.json(agendamento);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await Agendamento.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = agendamentoController;
