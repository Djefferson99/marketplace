const db = require('../database/connection');

async function listarAgendamentos() {
  const res = await db.query('SELECT * FROM agendamentos');
  return res.rows;
}

async function criarAgendamento(cliente_id, prestador_id, servico_id, data_agendada, status) {
  const res = await db.query(
    `INSERT INTO agendamentos 
     (cliente_id, prestador_id, servico_id, data_agendada, status) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [cliente_id, prestador_id, servico_id, data_agendada, status]
  );
  return res.rows[0];
}

async function atualizarAgendamento(id, cliente_id, prestador_id, servico_id, data_agendada, status) {
  const res = await db.query(
    `UPDATE agendamentos 
     SET cliente_id = $1, prestador_id = $2, servico_id = $3, data_agendada = $4, status = $5 
     WHERE id = $6 
     RETURNING *`,
    [cliente_id, prestador_id, servico_id, data_agendada, status, id]
  );
  return res.rows[0];
}

async function deletarAgendamento(id) {
  const res = await db.query('DELETE FROM agendamentos WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
}

module.exports = {
  listarAgendamentos,
  criarAgendamento,
  atualizarAgendamento,
  deletarAgendamento,
};
