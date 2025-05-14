const UsuarioService = require('../services/usuarioService');

async function listar(req, res) {
  try {
    const usuarios = await UsuarioService.listar();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function criar(req, res) {
  try {
    const novo = await UsuarioService.criar(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const atualizado = await UsuarioService.atualizar(id, req.body);
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

async function deletar(req, res) {
  try {
    const { id } = req.params;
    const deletado = await UsuarioService.deletar(id);
    if (!deletado) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json({ mensagem: 'Usuário removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = {
  listar,
  criar,
  atualizar,
  deletar,
};
