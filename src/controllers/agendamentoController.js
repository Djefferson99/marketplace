const db = require('../database/connection.js');
const Agendamento = require('../models/agendamentoModel');
const Horario = require('../models/horarioModel');
const { Resend } = require('resend');
const axios = require('axios');

const resend = new Resend(process.env.RESEND_API_KEY);

const agendamentoController = {
  create: async (req, res) => {
    try {
      // 1. Buscar o título do serviço pelo id enviado
      const servicoResult = await db.query(
        'SELECT titulo FROM servicos WHERE id = $1',
        [req.body.servico_id]
      );
      if (servicoResult.rows.length === 0) {
        return res.status(400).json({ error: 'Serviço inválido' });
      }
      const servico_titulo = servicoResult.rows[0].titulo;

      // 2. Buscar dados da empresa + usuário (email e telefone)
      const empresaResult = await db.query(`
        SELECT e.nome_empresa, u.email, u.telefone
        FROM empresas e
        JOIN usuarios u ON e.usuario_id = u.id
        WHERE e.id = $1
      `, [req.body.empresa_id]);
      if (empresaResult.rows.length === 0) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }
      const empresa = empresaResult.rows[0];

      // 3. Preencher o título no corpo da requisição para criar agendamento
      req.body.servico_titulo = servico_titulo;

      // 4. Criar agendamento
      const agendamento = await Agendamento.create(req.body);

      // 5. Marcar horário como indisponível
      if (req.body.horario_id) {
        await Horario.updateStatus(req.body.horario_id, false);
      }

      // 6. Enviar email para o prestador (empresa)
      await resend.emails.send({
        from: 'Agendamento <sistema@indca.com.br>',
        to: empresa.email,
        subject: 'Novo Agendamento Recebido',
        html: `
          <p>Olá ${empresa.nome_empresa},</p>
          <p>Você recebeu um novo agendamento:</p>
          <ul>
            <li>Cliente: ${req.body.nome_cliente}</li>
            <li>Serviço: ${servico_titulo}</li>
            <li>Data: ${req.body.dia_semana}</li>
            <li>Hora: ${req.body.hora}</li>
          </ul>
        `
      });

      // 7. WhatsApp para cliente confirmando agendamento
      await axios.post(`https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-messages`, {
        phone: req.body.telefone_cliente,
        message: `Olá ${req.body.nome_cliente}, seu agendamento para o serviço ${servico_titulo} foi confirmado para ${req.body.dia_semana} às ${req.body.hora}.`
      });

      // 8. WhatsApp para prestador avisando novo agendamento
      await axios.post(`https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-messages`, {
        phone: empresa.telefone,
        message: `📢 Novo agendamento!\nCliente: ${req.body.nome_cliente}\nServiço: ${servico_titulo}\nData: ${req.body.dia_semana} às ${req.body.hora}`
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
