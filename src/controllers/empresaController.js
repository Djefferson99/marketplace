const Empresa = require('../models/empresaModel');
const fs = require("fs");
const Picture = require("../models/Picture");

const empresaController = {
  create: async (req, res) => {
    try {
      // Pega os dados do corpo da requisição
      const empresaData = req.body;

        try {
        const { name } = req.body;

        const file = req.file;
        const picture = new Picture({
          name,
          src: file.path,
        });

        await picture.save();
        res.json(picture);
      } catch (err) {
        res.status(500).json({ message: "Erro ao salvar a imagem." });
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

getByUsuarioId: async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const empresa = await Empresa.findByUsuarioId(usuario_id);

    if (empresa) {
      res.status(200).json(empresa);
    } else {
      res.status(404).json({ message: 'Empresa não encontrada para este usuário' });
    }
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
      try {
        const picture = await Picture.findById(req.params.id);
        if (!picture) {
          return res.status(404).json({ message: "Imagem não encontrada" });
        }
        fs.unlinkSync(picture.src);
        await picture.remove();
        res.json({ message: "Imagem removida com sucesso" });
      } catch (err) {
        res.status(500).json({ message: "Erro ao remover a imagem" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = empresaController;
