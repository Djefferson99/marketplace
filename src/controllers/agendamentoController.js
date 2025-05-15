const AgendamentoService = require('../services/agendamentoService');

async function listar(req, res) {
  try {
    const agendamentos = await AgendamentoService.listar();
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function criar(req, res) {
  try {
    const novo = await AgendamentoService.criar(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const atualizado = await AgendamentoService.atualizar(id, req.body);
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

async function deletar(req, res) {
  try {
    const { id } = req.params;
    const deletado = await AgendamentoService.deletar(id);
    if (!deletado) return res.status(404).json({ erro: 'Agendamento não encontrado' });
    res.json({ mensagem: 'Agendamento removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = { listar, criar, atualizar, deletar };
