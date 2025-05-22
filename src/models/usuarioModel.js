const db = require('../database/connection');

const Usuario = {
    create: async (usuario) => {
        const { nome, email, senha, telefone, tipo_usuario } = usuario;
        const result = await db.query(
            `INSERT INTO usuarios 
             (nome, email, senha, telefone, tipo_usuario) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nome, email, senha, telefone, tipo_usuario]
        );
        return result.rows[0];
    },

    findAll: async () => {
        const result = await db.query('SELECT * FROM usuarios');
        return result.rows;
    },

    findById: async (id) => {
        const result = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        return result.rows[0];
    },

    update: async (id, usuario) => {
        const { nome, email, senha, telefone, tipo_usuario } = usuario;
        const result = await db.query(
            `UPDATE usuarios SET 
               nome = $1, 
               email = $2, 
               senha = $3, 
               telefone = $4, 
               tipo_usuario = $5 
             WHERE id = $6 
             RETURNING *`,
            [nome, email, senha, telefone, tipo_usuario, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
    }
};

module.exports = Usuario;
