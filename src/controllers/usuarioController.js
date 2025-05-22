const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

const usuarioController = {
    // Criar usuário
    create: async (req, res) => {
        try {
            const { nome, email, senha, telefone, tipo_usuario } = req.body;
            if (!nome || !email || !senha || !telefone || !tipo_usuario) {
                return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
            }
            const hash = await bcrypt.hash(senha, SALT_ROUNDS);
            const novoUsuario = await Usuario.create({ nome, email, senha: hash, telefone, tipo_usuario });
            res.status(201).json(novoUsuario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensagem: 'Erro ao criar usuário' });
        }
    },

    // Listar todos
    findAll: async (req, res) => {
        try {
            const usuarios = await Usuario.findAll();
            res.json(usuarios);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensagem: 'Erro ao buscar usuários' });
        }
    },

    // Buscar por ID
    findById: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findById(id);
            if (usuario) {
                res.json(usuario);
            } else {
                res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
        }
    },

    // Atualizar
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, email, senha, telefone, tipo_usuario } = req.body;
            if (!nome || !email || !senha || !telefone || !tipo_usuario) {
                return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
            }
            let hash;
            if (senha) {
              hash = await bcrypt.hash(senha, SALT_ROUNDS);
            }

            const usuarioAtualizado = await Usuario.update(id, { nome, email, senha: hash, telefone, tipo_usuario });
            if (usuarioAtualizado) {
                res.json(usuarioAtualizado);
            } else {
                res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
        }
    },

    // Deletar
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await Usuario.delete(id);
            res.json({ mensagem: 'Usuário deletado com sucesso' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensagem: 'Erro ao deletar usuário' });
        }
    }
};

module.exports = usuarioController;
