// empresaModel.js + rota Express com upload e campo linkedin

const express = require('express');
const multer = require('multer');
const db = require('../database/connection');

const router = express.Router();

// Model Empresa
const Empresa = {
  create: async (empresa) => {
    const { usuario_id, nome_empresa, apresentacao, descricao, site, instagram, linkedin, facebook, youtube, foto_perfil } = empresa;
    const result = await db.query(
      `INSERT INTO empresas 
        (usuario_id, nome_empresa, apresentacao, descricao, site, instagram, linkedin, facebook, youtube, foto_perfil) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [usuario_id, nome_empresa, apresentacao, descricao, site, instagram, linkedin, facebook, youtube, foto_perfil]
    );
    return result.rows[0];
  },

  findAll: async () => {
    const result = await db.query('SELECT * FROM empresas');
    return result.rows;
  },

  findById: async (id) => {
    const result = await db.query('SELECT * FROM empresas WHERE id = $1', [id]);
    return result.rows[0];
  },

  update: async (id, empresa) => {
    const { nome_empresa, apresentacao, descricao, site, instagram, linkedin, facebook, youtube, foto_perfil } = empresa;
    const result = await db.query(
      `UPDATE empresas SET 
        nome_empresa = $1, apresentacao = $2, descricao = $3, site = $4, instagram = $5, linkedin = $6, facebook = $7, youtube = $8, foto_perfil = $9
       WHERE id = $10 RETURNING *`,
      [nome_empresa, apresentacao, descricao, site, instagram, linkedin, facebook, youtube, foto_perfil, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await db.query('DELETE FROM empresas WHERE id = $1', [id]);
  }
};

// Configuração do multer para upload da foto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // pasta onde vai salvar as fotos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  }
});

const upload = multer({ storage });

// Rota para criar empresa com upload da foto e campos incluindo linkedin
router.post('/empresas', upload.single('foto_perfil'), async (req, res) => {
  try {
    const { usuario_id, nome_empresa, apresentacao, descricao, site, instagram, linkedin, facebook, youtube } = req.body;
    const foto_perfil = req.file ? req.file.filename : null;

    if (!usuario_id || !nome_empresa) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios ausentes' });
    }

    const novaEmpresa = await Empresa.create({
      usuario_id,
      nome_empresa,
      apresentacao,
      descricao,
      site,
      instagram,
      linkedin,
      facebook,
      youtube,
      foto_perfil
    });

    res.status(201).json(novaEmpresa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao criar empresa' });
  }
});

module.exports = router;
