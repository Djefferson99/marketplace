const Horario = require('../models/horarioModel');

const horarioController = {
  create: async (req, res) => {
    try {
      const novoHorario = await Horario.create(req.body);
      res.status(201).json(novoHorario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getByEmpresaId: async (req, res) => {
    try {
      const horarios = await Horario.findAllByEmpresa(req.params.empresa_id);
      res.json(horarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
  try {
    const horario = await Horario.findById(req.params.id);
    if (!horario) {
      return res.status(404).json({ message: 'Horário não encontrado' });
    }
    res.json(horario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
  update: async (req, res) => {
    try {
      const horarioAtualizado = await Horario.update(req.params.id, req.body);
      res.json(horarioAtualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await Horario.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = horarioController;
