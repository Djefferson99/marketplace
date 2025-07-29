const db = require('../database/connection.js');

const Empresa = {
  create: async (empresa) => {
    const {
      usuario_id,
      nome_empresa,
      apresentacao,
      descricao,
      site,
      instagram,
      linkedin,
      facebook,
      youtube,
      // novos campos
      foto_url,
      foto_key,
      // legado: se ainda vier
      foto_perfil,
    } = empresa;

    // Fallback: se vier só foto_perfil (legado), usa como foto_url
    const final_foto_url = foto_url || foto_perfil || null;
    const final_foto_key = foto_key || null;

    const result = await db.query(
      `INSERT INTO empresas (
        usuario_id, nome_empresa, apresentacao, descricao,
        site, instagram, linkedin, facebook, youtube,
        foto_url, foto_key
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
      )
      RETURNING *`,
      [
        usuario_id, nome_empresa, apresentacao, descricao,
        site, instagram, linkedin, facebook, youtube,
        final_foto_url, final_foto_key
      ]
    );
    return result.rows[0];
  },

  findAll: async () => {
    const result = await db.query(
      'SELECT * FROM empresas ORDER BY id DESC'
    );
    return result.rows;
  },

  findByUsuarioId: async (usuario_id) => {
    const result = await db.query(
      'SELECT * FROM empresas WHERE usuario_id = $1 LIMIT 1',
      [usuario_id]
    );
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await db.query(
      'SELECT * FROM empresas WHERE id = $1 LIMIT 1',
      [id]
    );
    return result.rows[0];
  },

  update: async (id, empresa) => {
    const {
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
      foto_perfil, // legado
    } = empresa;

    // Fallback para foto_url
    const final_foto_url = (foto_url !== undefined && foto_url !== '') ? foto_url
                          : (foto_perfil !== undefined ? foto_perfil : null);

    const result = await db.query(
      `UPDATE empresas SET
        nome_empresa = COALESCE($1, nome_empresa),
        apresentacao = COALESCE($2, apresentacao),
        descricao    = COALESCE($3, descricao),
        site         = COALESCE($4, site),
        instagram    = COALESCE($5, instagram),
        linkedin     = COALESCE($6, linkedin),
        facebook     = COALESCE($7, facebook),
        youtube      = COALESCE($8, youtube),
        foto_url     = COALESCE($9, foto_url),
        foto_key     = COALESCE($10, foto_key)
      WHERE id = $11
      RETURNING *`,
      [
        nome_empresa,
        apresentacao,
        descricao,
        site,
        instagram,
        linkedin,
        facebook,
        youtube,
        final_foto_url,
        (foto_key !== undefined ? foto_key : null),
        id
      ]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await db.query('DELETE FROM empresas WHERE id = $1', [id]);
  }
};

module.exports = Empresa;
