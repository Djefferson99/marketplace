const UsuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');

// LISTAR TODOS OS USUÁRIOS
async function listar() {
  return await UsuarioModel.listarUsuarios();
}

// CRIAR UM USUÁRIO
async function criar(data) {
  const { nome, email, senha, telefone } = data;

  if (!nome || !email || !senha || !telefone) {
    throw new Error('Dados obrigatórios ausentes');
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  return await UsuarioModel.criarUsuario(nome, email, senhaCriptografada, telefone);
}

// ATUALIZAR UM USUÁRIO
async function atualizar(id, data) {
  const { nome, email, senha, telefone } = data;

  if (!nome || !email || !telefone) {
    throw new Error('Dados obrigatórios ausentes');
  }

  let senhaCriptografada = undefined;

  if (senha) {
    senhaCriptografada = await bcrypt.hash(senha, 10);
  }

  return await UsuarioModel.atualizarUsuario(
    id, nome, email, senhaCriptografada, telefone
  );
}

// DELETAR UM USUÁRIO
async function deletar(id) {
  return await UsuarioModel.deletarUsuario(id);
}

module.exports = {
  listar,
  criar,
  atualizar,
  deletar,
};
