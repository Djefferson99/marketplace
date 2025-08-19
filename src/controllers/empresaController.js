const Empresa = require('../models/empresaModel');

const empresaController = {
  create: async (req, res) => {
    console.log('📁 req.file =', req.file);   
    console.log('📄 req.body =', req.body);

    try {
      const empresaData = { ...req.body };
      if (req.file) empresaData.foto_perfil = req.file.filename;
      else if (req.body.foto_perfil) empresaData.foto_perfil = req.body.foto_perfil;

      const empresa = await Empresa.create(empresaData);
      res.status(201).json(empresa);
    } catch (error) {
      console.error('Erro no create empresa:', error);
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const empresaData = { ...req.body };
      if (req.file) empresaData.foto_perfil = req.file.filename;
      else if (req.body.foto_perfil) empresaData.foto_perfil = req.body.foto_perfil;

      const empresa = await Empresa.update(id, empresaData);
      if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });

      res.status(200).json(empresa);
    } catch (error) {
      console.error('Erro no update empresa:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const empresas = await Empresa.findAll();
      res.status(200).json(empresas);
    } catch (error) {
      console.error('Erro no getAll empresa:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getByUsuarioId: async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const empresa = await Empresa.findByUsuarioId(usuario_id);
      if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada para este usuário' });
      res.status(200).json(empresa);
    } catch (error) {
      console.error('Erro no getByUsuarioId:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const empresa = await Empresa.findById(id);
      if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });
      res.status(200).json(empresa);
    } catch (error) {
      console.error('Erro no getById:', error);
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Empresa.delete(id);
      if (!deleted) return res.status(404).json({ message: 'Empresa não encontrada' });
      res.status(200).json({ message: 'Empresa deletada com sucesso' });
    } catch (error) {
      console.error('Erro no delete empresa:', error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = empresaController;
