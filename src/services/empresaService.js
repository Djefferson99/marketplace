const Empresa = require('../models/empresaModel');

const empresaService = {
  create: async (data) => {
    // Validação simples: nome da empresa obrigatório
    if (!data.nome_empresa || data.nome_empresa.trim() === '') {
      throw new Error('Nome da empresa é obrigatório.');
    }

    // Aqui você pode adicionar outras validações ou regras de negócio

    // Chama o model para criar no banco
    return await Empresa.create(data);
  },

  update: async (id, data) => {
    if (!id) {
      throw new Error('ID da empresa é obrigatório para atualização.');
    }

    // Pode validar campos que quer atualizar, se quiser
    // Exemplo: não deixa nome_empresa vazio
    if (data.nome_empresa && data.nome_empresa.trim() === '') {
      throw new Error('Nome da empresa não pode ser vazio.');
    }

    // Atualiza no banco
    return await Empresa.update(id, data);
  },

  getAll: async () => {
    return await Empresa.findAll();
  },

  getById: async (id) => {
    if (!id) throw new Error('ID da empresa é obrigatório.');
    const empresa = await Empresa.findById(id);
    if (!empresa) throw new Error('Empresa não encontrada.');
    return empresa;
  },

  getByUsuarioId: async (usuario_id) => {
    if (!usuario_id) throw new Error('ID do usuário é obrigatório.');
    const empresa = await Empresa.findByUsuarioId(usuario_id);
    if (!empresa) throw new Error('Empresa não encontrada para este usuário.');
    return empresa;
  },

  delete: async (id) => {
    if (!id) throw new Error('ID da empresa é obrigatório para deletar.');
    await Empresa.delete(id);
  }
};

module.exports = empresaService;
