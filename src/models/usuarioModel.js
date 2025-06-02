const db = require('../database/connection');

const Usuario = {
  // CREATE
  create: async ({ nome, email, senha, telefone }) => {
    const result = await db.query(
      `INSERT INTO usuarios (nome, email, senha, telefone)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nome, email, senha, telefone]
    );
    return result.rows[0];
  },

  // READ ALL
  findAll: async () => {
    const result = await db.query('SELECT * FROM usuarios ORDER BY id');
    return result.rows;
  },

  // READ ONE
  findById: async (id) => {
    const result = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
  },

  // UPDATE
  update: async (id, fields) => {
    const keys = Object.keys(fields);
    const setters = keys.map((key, idx) => `${key} = $${idx + 1}`);
    const values = keys.map((k) => fields[k]);

    const query = `
      UPDATE usuarios
      SET ${setters.join(', ')}
      WHERE id = $${keys.length + 1}
      RETURNING *`;

    const result = await db.query(query, [...values, id]);
    return result.rows[0];
  },

  // DELETE
  delete: async (id) => {
    await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
  }
};

module.exports = Usuario;
