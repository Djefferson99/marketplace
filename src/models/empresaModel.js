const db = require('../database/connection');

const Empresa = {
    create: async (empresa) => {
        const { usuario_id, nome_empresa, apresentacao, descricao, site, instagram, facebook, youtube, foto_perfil } = empresa;
        const result = await db.query(
            'INSERT INTO empresas (usuario_id, nome_empresa, apresentacao, descricao, site, instagram, facebook, youtube, foto_perfil) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [usuario_id, nome_empresa, apresentacao, descricao, site, instagram, facebook, youtube, foto_perfil]
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
        const { nome_empresa, apresentacao, descricao, site, instagram, facebook, youtube, foto_perfil } = empresa;
        const result = await db.query(
            'UPDATE empresas SET nome_empresa = $1, apresentacao = $2, descricao = $3, site = $4, instagram = $5, facebook = $6, youtube = $7, foto_perfil = $8 WHERE id = $9 RETURNING *',
            [nome_empresa, apresentacao, descricao, site, instagram, facebook, youtube, foto_perfil, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await db.query('DELETE FROM empresas WHERE id = $1', [id]);
    }
};

module.exports = Empresa;
