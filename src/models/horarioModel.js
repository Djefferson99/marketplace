const db = require('../database/connection.js');

const Horario = {
  create: async (horario) => {
    const { empresa_id, dia_semana, hora, disponivel = true } = horario;

    const result = await db.query(
      `INSERT INTO horarios_de_agendamentos (empresa_id, dia_semana, hora, disponivel)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [empresa_id, dia_semana, hora, disponivel]
    );
    return result.rows[0];
  },

  findAllByEmpresa: async (empresa_id) => {
    const result = await db.query(
      `SELECT * FROM horarios_de_agendamentos WHERE empresa_id = $1 ORDER BY dia_semana, hora`,
      [empresa_id]
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query('SELECT * FROM horarios WHERE id = $1', [id]);
    return result.rows[0];
  },

  update: async (id, horario) => {
    const { dia_semana, hora, disponivel } = horario;

    const result = await db.query(
      `UPDATE horarios_de_agendamentos SET dia_semana = $1, hora = $2, disponivel = $3
       WHERE id = $4 RETURNING *`,
      [dia_semana, hora, disponivel, id]
    );
    return result.rows[0];
  },

  updateStatus: async (id, disponivel) => {
    const result = await db.query(
      `UPDATE horarios_de_agendamentos SET disponivel = $1 WHERE id = $2 RETURNING *`,
      [disponivel, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await db.query(`DELETE FROM horarios_de_agendamentos WHERE id = $1`, [id]);
  }
};

module.exports = Horario;
