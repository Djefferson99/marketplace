const db = require('../database/connection.js');

const Agendamento = {
  create: async (agendamento) => {
    const {
      empresa_id, servico_titulo, nome_cliente,
      telefone_cliente, dia_semana, hora
    } = agendamento;

    const result = await db.query(
      `INSERT INTO agendamentos
        (empresa_id, servico_titulo, nome_cliente, telefone_cliente, dia_semana, hora)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [empresa_id, servico_titulo, nome_cliente, telefone_cliente, dia_semana, hora]
    );

    return result.rows[0];
  },

  findByEmpresa: async (empresa_id) => {
    const result = await db.query(
      `SELECT * FROM agendamentos WHERE empresa_id = $1 ORDER BY dia_semana, hora`,
      [empresa_id]
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await db.query(`SELECT * FROM agendamentos WHERE id = $1`, [id]);
    return result.rows[0];
  },

  delete: async (id) => {
    await db.query(`DELETE FROM agendamentos WHERE id = $1`, [id]);
  }
};

module.exports = Agendamento;
