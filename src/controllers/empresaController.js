const Empresa = require('../models/empresaModel');

const empresaController = {
    create: async (req, res) => {
        try {
            const empresa = await Empresa.create(req.body);
            res.status(201).json(empresa);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const empresas = await Empresa.findAll();
            res.status(200).json(empresas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const empresa = await Empresa.findById(id);
            if (empresa) {
                res.status(200).json(empresa);
            } else {
                res.status(404).json({ message: 'Empresa não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const empresa = await Empresa.update(id, req.body);
            res.status(200).json(empresa);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await Empresa.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = empresaController;
