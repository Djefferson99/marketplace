const UsuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');

async function listar() {
  return await UsuarioModel.listarUsuarios();
}

async function criar(data) {
  const { nome, email, senha, tipo_usuario, telefone } = data;

  if (!nome || !email || !senha || !tipo_usuario || !telefone) {
    throw new Error('Dados obrigatórios ausentes');
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  return await UsuarioModel.criarUsuario(nome, email, senhaCriptografada, tipo_usuario, telefone);
}

async function atualizar(id, data) {
  const { nome, email, senha, tipo_usuario, telefone } = data;

  if (!nome || !email || !senha || !tipo_usuario) {
    throw new Error('Dados obrigatórios ausentes');
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  return await UsuarioModel.atualizarUsuario(
    id, nome, email, senhaCriptografada, tipo_usuario, telefone
  );
}

async function deletar(id) {
  return await UsuarioModel.deletarUsuario(id);
}

module.exports = {
  listar,
  criar,
  atualizar,
  deletar,
};
