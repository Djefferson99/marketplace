const db = require('../database/connection');

const Servico = {
    create: async (servico) => {
        const { empresa_id, titulo, descricao_servico, valor, prazo } = servico;
        const result = await db.query(
            'INSERT INTO servicos (empresa_id, titulo, descricao_servico, valor, prazo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [empresa_id, titulo, descricao_servico, valor, prazo]
        );
        return result.rows[0];
    },

    findAll: async () => {
        const result = await db.query('SELECT * FROM servicos');
        return result.rows;
    },

    findById: async (id) => {
        const result = await db.query('SELECT * FROM servicos WHERE id = $1', [id]);
        return result.rows[0];
    },

    update: async (id, servico) => {
        const { titulo, descricao_servico, valor, prazo } = servico;
        const result = await db.query(
            'UPDATE servicos SET titulo = $1, descricao_servico = $2, valor = $3, prazo = $4 WHERE id = $5 RETURNING *',
            [titulo, descricao_servico, valor, prazo, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await db.query('DELETE FROM servicos WHERE id = $1', [id]);
    },
    
    findByEmpresaId: async (empresa_id) => {
    const result = await db.query(
        'SELECT * FROM servicos WHERE empresa_id = $1',
        [empresa_id]
    );
    return result.rows;
    }
};

module.exports = Servico;
