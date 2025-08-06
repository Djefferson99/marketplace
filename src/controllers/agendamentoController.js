require('dotenv').config();
const db = require('../database/connection.js'); // IMPORTAÇÃO DO DB FALTANDO
const Agendamento = require('../models/agendamentoModel');
const Horario = require('../models/horarioModel');
const { Resend } = require('resend');
const axios = require('axios');

const resend = new Resend(process.env.RESEND_API_KEY);

const agendamentoController = {
  create: async (req, res) => {
    try {
      // 1. Buscar dados da empresa + usuário (email e telefone)
      const empresaId = req.body.empresa_id;
      const empresaResult = await db.query(`
        SELECT e.nome_empresa, u.email, u.telefone
        FROM empresas e
        JOIN usuarios u ON e.usuario_id = u.id
        WHERE e.id = $1
      `, [empresaId]);

      if (empresaResult.rows.length === 0) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      const empresa = empresaResult.rows[0];

      // 2. Criar agendamento
      const agendamento = await Agendamento.create(req.body);

      // 3. Marcar horário como indisponível
      if (req.body.horario_id) {
        await Horario.updateStatus(req.body.horario_id, false);
      }

      // 4. Enviar email para o prestador (empresa) avisando do novo agendamento
      await resend.emails.send({
        from: 'Agendamento <sistema@indca.com.br>',
        to: empresa.email,
        subject: 'Novo Agendamento Recebido',
        html: `
          <p>Olá ${empresa.nome_empresa},</p>
          <p>Você recebeu um novo agendamento:</p>
          <ul>
            <li>Cliente: ${req.body.nome_cliente}</li>
            <li>Serviço: ${req.body.servico_titulo || req.body.nome_servico}</li>
            <li>Data: ${req.body.dia_semana}</li>
            <li>Hora: ${req.body.hora}</li>
          </ul>
        `
      });

      // 5. Enviar WhatsApp para o cliente confirmando agendamento
      await axios.post(`https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-messages`, {
        phone: req.body.telefone_cliente, // telefone do cliente no formato 55xx...
        message: `Olá ${req.body.nome_cliente}, seu agendamento para o serviço ${req.body.servico_titulo || req.body.nome_servico} foi confirmado para ${req.body.dia_semana} às ${req.body.hora}.`
      });

      // 6. Enviar WhatsApp para o prestador avisando novo agendamento
      await axios.post(`https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-messages`, {
        phone: empresa.telefone, // telefone do prestador no formato 55xx...
        message: `📢 Novo agendamento!\nCliente: ${req.body.nome_cliente}\nServiço: ${req.body.servico_titulo || req.body.nome_servico}\nData: ${req.body.dia_semana} às ${req.body.hora}`
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
