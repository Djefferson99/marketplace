const db = require('../database/connection');

async function listarUsuarios() {
  const res = await db.query('SELECT * FROM usuarios');
  return res.rows;
}

async function criarUsuario(nome, email, senha, tipo_usuario, telefone) {
  const res = await db.query(
    'INSERT INTO usuarios (nome, email, senha, tipo_usuario, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nome, email, senha, tipo_usuario, telefone]
  );
  return res.rows[0];
}

async function atualizarUsuario(id, nome, email, senha, tipo_usuario, telefone) {
  const res = await db.query(
    `UPDATE usuarios 
     SET nome = $1, email = $2, senha = $3, tipo_usuario = $4, telefone = $5 
     WHERE id = $6 
     RETURNING *`,
    [nome, email, senha, tipo_usuario, telefone, id]
  );
  return res.rows[0];
}

async function deletarUsuario(id) {
  const res = await db.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
}

module.exports = {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
};

