// controllers/servicoController.js
const Servico = require('../models/servicoModel');
const ServicoService = require('../services/servicoService');

const servicoController = {
  create: async (req, res) => {
    try {
      const servico = await Servico.create(req.body);
      return res.status(201).json(servico);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const servicos = await Servico.findAll();
      return res.status(200).json(servicos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      const servico = await Servico.findById(id); // ou findByPk(id), conforme seu model
      if (!servico) {
        return res.status(404).json({ message: 'Serviço não encontrado' });
      }
      return res.status(200).json(servico);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      const servico = await Servico.update(id, req.body);
      return res.status(200).json(servico);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      await Servico.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getByEmpresaId: async (req, res) => {
    try {
      const empresaId = Number(req.params.empresa_id);
      if (!Number.isInteger(empresaId)) {
        return res.status(400).json({ message: 'empresa_id inválido' });
      }

      const servicos = await ServicoService.listarPorEmpresa(empresaId);

      // ✅ Sempre 200; se vazio, devolve []
      return res.status(200).json(Array.isArray(servicos) ? servicos : []);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = servicoController;
