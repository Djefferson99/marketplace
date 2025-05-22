const usuarioModel = require('../models/usuarioModel');

const usuarioController = {
    listar: (req, res) => {
        const usuarios = usuarioModel.listar();
        res.json(usuarios);
    },

    buscarPorId: (req, res) => {
        const id = parseInt(req.params.id);
        const usuario = usuarioModel.buscarPorId(id);

        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
    },

    criar: (req, res) => {
        const { nome, email } = req.body;
        if (!nome || !email) {
            return res.status(400).json({ mensagem: 'Nome e email são obrigatórios' });
        }

        const novoUsuario = usuarioModel.criar({ nome, email });
        res.status(201).json(novoUsuario);
    },

    atualizar: (req, res) => {
        const id = parseInt(req.params.id);
        const { nome, email } = req.body;

        const usuarioAtualizado = usuarioModel.atualizar(id, { nome, email });

        if (usuarioAtualizado) {
            res.json(usuarioAtualizado);
        } else {
            res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
    },

    deletar: (req, res) => {
        const id = parseInt(req.params.id);
        const deletado = usuarioModel.deletar(id);

        if (deletado) {
            res.json({ mensagem: 'Usuário deletado com sucesso' });
        } else {
            res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
    },
};

module.exports = usuarioController;
