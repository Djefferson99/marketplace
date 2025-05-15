const AgendamentoModel = require('../models/agendamentoModel');

async function listar() {
  return await AgendamentoModel.listarAgendamentos();
}

async function criar(data) {
  const { cliente_id, prestador_id, servico_id, data_agendada, status } = data;

  if (!cliente_id || !prestador_id || !servico_id || !data_agendada) {
    throw new Error('Campos obrigatórios ausentes');
  }

  return await AgendamentoModel.criarAgendamento(
    cliente_id, prestador_id, servico_id, data_agendada, status || 'pendente'
  );
}

async function atualizar(id, data) {
  const { cliente_id, prestador_id, servico_id, data_agendada, status } = data;
  return await AgendamentoModel.atualizarAgendamento(
    id, cliente_id, prestador_id, servico_id, data_agendada, status
  );
}

async function deletar(id) {
  return await AgendamentoModel.deletarAgendamento(id);
}

module.exports = { listar, criar, atualizar, deletar };
