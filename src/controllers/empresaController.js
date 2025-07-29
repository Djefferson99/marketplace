const empresaService = require('../services/empresaService');

const empresaController = {
  create: async (req, res) => {
    try {
      const empresa = await empresaService.create(req.body);
      res.status(201).json(empresa);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const empresa = await empresaService.update(req.params.id, req.body);
      res.status(200).json(empresa);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const empresas = await empresaService.getAll();
      res.status(200).json(empresas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const empresa = await empresaService.getById(req.params.id);
      res.status(200).json(empresa);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  getByUsuarioId: async (req, res) => {
    try {
      const empresa = await empresaService.getByUsuarioId(req.params.usuario_id);
      res.status(200).json(empresa);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await empresaService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = empresaController;
