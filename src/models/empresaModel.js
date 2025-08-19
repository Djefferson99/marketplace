const db = require('../database/connection.js');

const Empresa = {
  create: async (empresa) => {
    const {
      usuario_id, nome_empresa, apresentacao, descricao,
      site, instagram, linkedin, facebook, youtube, foto_perfil = null
    } = empresa;

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

  findByUsuarioId: async (usuario_id) => {
    const result = await db.query('SELECT * FROM empresas WHERE usuario_id = $1 LIMIT 1', [usuario_id]);
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await db.query('SELECT * FROM empresas WHERE id = $1 LIMIT 1', [id]);
    return result.rows[0];
  },

  update: async (id, empresa) => {
    const {
      nome_empresa, apresentacao, descricao,
      site, instagram, linkedin, facebook, youtube, foto_perfil
    } = empresa;

    const result = await db.query(
      `UPDATE empresas SET 
        nome_empresa = $1, apresentacao = $2, descricao = $3,
        site = $4, instagram = $5, linkedin = $6,
        facebook = $7, youtube = $8, foto_perfil = $9
       WHERE id = $10 RETURNING *`,
      [nome_empresa, apresentacao, descricao, site, instagram, linkedin, facebook, youtube, foto_perfil, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM empresas WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Empresa;
