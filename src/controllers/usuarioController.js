const UsuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const usuarioController = {
  // CREATE
  create: async (req, res) => {
    try {
      const { nome, email, senha, telefone } = req.body;

      if (!nome || !email || !senha || !telefone) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
      }

      const hash = await bcrypt.hash(senha, SALT_ROUNDS);

      const novoUsuario = await UsuarioModel.create({
        nome,
        email,
        senha: hash,
        telefone
      });

      res.status(201).json(novoUsuario);
    } catch (err) {
      console.error('Erro no create:', err);
      res.status(500).json({ mensagem: 'Erro ao criar usuário', erro: err.message });
    }
  },

  // READ ALL
  findAll: async (req, res) => {
    try {
      const usuarios = await UsuarioModel.findAll();
      res.json(usuarios);
    } catch (err) {
      console.error('Erro no findAll:', err);
      res.status(500).json({ mensagem: 'Erro ao buscar usuários' });
    }
  },

  // READ ONE
  findById: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await UsuarioModel.findById(id);

      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      res.json(usuario);
    } catch (err) {
      console.error('Erro no findById:', err);
      res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
    }
  },

  // UPDATE
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, email, senha, telefone } = req.body;

      if (!nome || !email || !telefone) {
        return res.status(400).json({ mensagem: 'Nome, email e telefone são obrigatórios' });
      }

      let senhaCriptografada;
      if (senha) {
        senhaCriptografada = await bcrypt.hash(senha, SALT_ROUNDS);
      }

      const camposParaAtualizar = {
        nome,
        email,
        telefone,
      };

      if (senhaCriptografada) {
        camposParaAtualizar.senha = senhaCriptografada;
      }

      const usuarioAtualizado = await UsuarioModel.update(id, camposParaAtualizar);

      if (!usuarioAtualizado) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      res.json(usuarioAtualizado);
    } catch (err) {
      console.error('Erro no update:', err);
      res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
    }
  },

  // DELETE
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      await UsuarioModel.delete(id);

      res.json({ mensagem: 'Usuário deletado com sucesso' });
    } catch (err) {
      console.error('Erro no delete:', err);
      res.status(500).json({ mensagem: 'Erro ao deletar usuário' });
    }
  }
};

module.exports = usuarioController;