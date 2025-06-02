const Empresa = require('../models/empresaModel');

const empresaController = {
  create: async (req, res) => {
    try {
      // Pega os dados do corpo da requisição
      const empresaData = req.body;

      // Pega o nome do arquivo da foto enviada pelo multer (se existir)
      if (req.file) {
        empresaData.foto_perfil = req.file.filename;
      }

      const empresa = await Empresa.create(empresaData);
      res.status(201).json(empresa);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Se quiser, pode fazer a mesma coisa para update, por exemplo:
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const empresaData = req.body;
      if (req.file) {
        empresaData.foto_perfil = req.file.filename;
      }
      const empresa = await Empresa.update(id, empresaData);
      res.status(200).json(empresa);
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
