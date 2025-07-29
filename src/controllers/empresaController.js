const Empresa = require('../models/empresaModel');

function extractImageFromRequest(req) {
  // Cenário A: multer-s3 (upload passado pelo backend)
  // req.file: { location, key, ... }
  if (req.file && (req.file.location || req.file.key)) {
    return {
      foto_url: req.file.location || null,
      foto_key: req.file.key || null,
    };
  }

  // Cenário B: Presigned POST (upload direto do front para o S3)
  // front envia no body: foto_url, foto_key
  if (req.body && (req.body.foto_url || req.body.foto_key)) {
    return {
      foto_url: req.body.foto_url || null,
      foto_key: req.body.foto_key || null,
    };
  }

  // Legado: se ainda vier "foto_perfil" (antiga URL salva)
  if (req.body && req.body.foto_perfil) {
    return {
      foto_url: req.body.foto_perfil,
      foto_key: null,
    };
  }

  return { foto_url: null, foto_key: null };
}

const empresaController = {
  create: async (req, res) => {
    const t0 = Date.now();
    try {
      const {
        usuario_id, nome_empresa, apresentacao, descricao,
        site, instagram, linkedin, facebook, youtube
      } = req.body;

      const { foto_url, foto_key } = extractImageFromRequest(req);

      // Monta payload para o Model (model já tem fallback para foto_perfil)
      const empresaData = {
        usuario_id,
        nome_empresa,
        apresentacao,
        descricao,
        site,
        instagram,
        linkedin,
        facebook,
        youtube,
        foto_url,
        foto_key,
        // foto_perfil: não é mais necessário, mas se quiser manter compat:
        // foto_perfil: req.body.foto_perfil
      };

      const created = await Empresa.create(empresaData);
      res
        .status(201)
        .set('X-Controller-Time', (Date.now() - t0).toString())
        .json(created);
    } catch (error) {
      console.error('Erro no create empresa:', error);
      res.status(500).json({ error: 'Falha ao criar empresa' });
    }
  },

  update: async (req, res) => {
    const t0 = Date.now();
    try {
      const { id } = req.params;

      const {
        nome_empresa, apresentacao, descricao,
        site, instagram, linkedin, facebook, youtube
      } = req.body;

      const { foto_url, foto_key } = extractImageFromRequest(req);

      const empresaData = {
        nome_empresa,
        apresentacao,
        descricao,
        site,
        instagram,
        linkedin,
        facebook,
        youtube,
      };

      // Só envia ao model se veio valor novo (evita sobrescrever com null sem querer)
      if (foto_url !== null) empresaData.foto_url = foto_url;
      if (foto_key !== null) empresaData.foto_key = foto_key;

      const updated = await Empresa.update(id, empresaData);
      res
        .status(200)
        .set('X-Controller-Time', (Date.now() - t0).toString())
        .json(updated);
    } catch (error) {
      console.error('Erro no update empresa:', error);
      res.status(500).json({ error: 'Falha ao atualizar empresa' });
    }
  },

  getAll: async (req, res) => {
    const t0 = Date.now();
    try {
      const empresas = await Empresa.findAll();
      res
        .status(200)
        .set('X-Controller-Time', (Date.now() - t0).toString())
        .json(empresas);
    } catch (error) {
      console.error('Erro no getAll empresas:', error);
      res.status(500).json({ error: 'Falha ao listar empresas' });
    }
  },

  getByUsuarioId: async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const empresa = await Empresa.findByUsuarioId(usuario_id);
      if (!empresa) {
        return res.status(404).json({ message: 'Empresa não encontrada para este usuário' });
      }
      res.status(200).json(empresa);
    } catch (error) {
      console.error('Erro no getByUsuarioId:', error);
      res.status(500).json({ error: 'Falha ao obter empresa por usuário' });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const empresa = await Empresa.findById(id);
      if (!empresa) {
        return res.status(404).json({ message: 'Empresa não encontrada' });
      }
      res.status(200).json(empresa);
    } catch (error) {
      console.error('Erro no getById:', error);
      res.status(500).json({ error: 'Falha ao obter empresa' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // (Opcional) se você guarda foto_key, pode excluir do S3 aqui
      // const empresa = await Empresa.findById(id);
      // if (empresa?.foto_key) await s3Service.deleteFromS3(empresa.foto_key);

      await Empresa.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Erro no delete empresa:', error);
      res.status(500).json({ error: 'Falha ao excluir empresa' });
    }
  }
};

module.exports = empresaController;
