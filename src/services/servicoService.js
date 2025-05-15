const ServicoModel = require('../models/servicoModel');

async function listar() {
  return await ServicoModel.listarServicos();
}

async function criar(data) {
  const { usuario_id, titulo, descricao, preco, instagram, facebook, linkedin } = data;
  if (!usuario_id || !titulo || !preco) {
    throw new Error('Campos obrigatórios ausentes');
  }
  return await ServicoModel.criarServico(usuario_id, titulo, descricao, preco, instagram, facebook, linkedin);
}

async function atualizar(id, data) {
  const { usuario_id, titulo, descricao, preco, instagram, facebook, linkedin } = data;
  return await ServicoModel.atualizarServico(id, usuario_id, titulo, descricao, preco, instagram, facebook, linkedin);
}


async function deletar(id) {
  return await ServicoModel.deletarServico(id);
}

module.exports = { listar, criar, atualizar, deletar };
