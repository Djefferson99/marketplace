const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const usuarioController = {
  // CREATE
  create: async (req, res) => {
    try {
      const { nome, email, senha, telefone, tipo_usuario } = req.body;
      if (!nome || !email || !senha || !telefone) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
      }
      const hash = await bcrypt.hash(senha, SALT_ROUNDS);
      const novoUsuario = await Usuario.create({
        nome, email, senha: hash, telefone, tipo_usuario
      });
      res.status(201).json(novoUsuario);
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensagem: 'Erro ao criar usuário' });
    }
  },

  // READ ALL
  findAll: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensagem: 'Erro ao buscar usuários' });
    }
  },

  // READ ONE
  findById: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findById(id);
      if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      res.json(usuario);
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
    }
  },

  // UPDATE
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, email, senha, telefone } = req.body;
      if (!nome || !email || !telefone) {
        return res.status(400)
          .json({ mensagem: 'Nome, email, telefone e tipo de usuário são obrigatórios' });
      }
      const fields = { nome, email, telefone, tipo_usuario };
      if (senha) {
        fields.senha = await bcrypt.hash(senha, SALT_ROUNDS);
      }
      const atualizado = await Usuario.update(id, fields);
      if (!atualizado) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      res.json(atualizado);
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
    }
  },

  // DELETE
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Usuario.delete(id);
      res.json({ mensagem: 'Usuário deletado com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensagem: 'Erro ao deletar usuário' });
    }
  }
};

module.exports = usuarioController;
