const Servico = require('../models/servicoModel');
const ServicoService = require('../services/servicoService');

const servicoController = {
    create: async (req, res) => {
        try {
            const servico = await Servico.create(req.body);
            res.status(201).json(servico);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const servicos = await Servico.findAll();
            res.status(200).json(servicos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const servico = await Servico.findById(id);
            if (servico) {
                res.status(200).json(servico);
            } else {
                res.status(404).json({ message: 'Serviço não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const servico = await Servico.update(id, req.body);
            res.status(200).json(servico);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await Servico.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getByEmpresaId: async (req, res) => {
        try {
            const { empresa_id } = req.params;
            const servicos = await ServicoService.listarPorEmpresa(empresa_id);

            if (servicos.length === 0) {
                return res.status(404).json({ message: 'Nenhum serviço encontrado para esta empresa' });
            }

            res.status(200).json(servicos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = servicoController;
