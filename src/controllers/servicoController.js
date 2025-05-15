const ServicoService = require('../services/servicoService');

async function listar(req, res) {
  try {
    const servicos = await ServicoService.listar();
    res.json(servicos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function criar(req, res) {
  try {
    const novo = await ServicoService.criar(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const atualizado = await ServicoService.atualizar(id, req.body);
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

async function deletar(req, res) {
  try {
    const { id } = req.params;
    const deletado = await ServicoService.deletar(id);
    if (!deletado) return res.status(404).json({ erro: 'Serviço não encontrado' });
    res.json({ mensagem: 'Serviço removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = { listar, criar, atualizar, deletar };
