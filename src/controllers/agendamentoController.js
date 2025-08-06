const db = require('../database/connection.js');
const Agendamento = require('../models/agendamentoModel');
const Horario = require('../models/horarioModel');
const { Resend } = require('resend');
const axios = require('axios');

const resend = new Resend(process.env.RESEND_API_KEY);

const agendamentoController = {
  create: async (req, res) => {
  const { servico_titulo, nome_cliente, telefone_cliente, empresa_id, dia_semana, hora, horario_id } = req.body;

  if (!servico_titulo || !nome_cliente || !telefone_cliente || !empresa_id || !dia_semana || !hora) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  try {
    // Buscar dados da empresa + usuário (email e telefone)
    const empresaResult = await db.query(`
      SELECT e.nome_empresa, u.email, u.telefone
      FROM empresas e
      JOIN usuarios u ON e.usuario_id = u.id
      WHERE e.id = $1
    `, [empresa_id]);

    if (empresaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    const empresa = empresaResult.rows[0];

    // Criar agendamento
    const agendamento = await Agendamento.create(req.body);

    // Marcar horário como indisponível
    if (horario_id) {
      await Horario.updateStatus(horario_id, false);
    }

    // Enviar e-mail ao prestador
    await resend.emails.send({
      from: 'Agendamento <sistema@indca.com.br>',
      to: empresa.email,
      subject: 'Novo Agendamento Recebido',
      html: `
        <p>Olá ${empresa.nome_empresa},</p>
        <p>Você recebeu um novo agendamento:</p>
        <ul>
          <li>Cliente: ${nome_cliente}</li>
          <li>Serviço: ${servico_titulo}</li>
          <li>Data: ${dia_semana}</li>
          <li>Hora: ${hora}</li>
        </ul>
      `
    });

    // // WhatsApp para cliente
    // try{
    //       await axios.post(`https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-messages`, {
    //   phone: telefone_cliente,
    //   message: `Olá ${nome_cliente}, seu agendamento para o serviço ${servico_titulo} foi confirmado.`
    // });

    // // WhatsApp para prestador
    // await axios.post(`https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-messages`, {
    //   phone: empresa.telefone,
    //   message: `📢 Novo agendamento!\nCliente: ${nome_cliente}\nServiço: ${servico_titulo}\nData: ${dia_semana} às ${hora}`
    // });
    // }catch (error) {
    //   if (error.response) {
    //     console.error('Erro resposta API:', error.response.data);
    //   } else {
    //     console.error('Erro:', error.message);
    //   }
    //   res.status(500).json({ error: 'Erro ao criar agendamento' });
    // }



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
