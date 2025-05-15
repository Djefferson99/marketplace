const db = require('../database/connection');

async function listarServicos() {
  const res = await db.query('SELECT * FROM servicos');
  return res.rows;
}

async function criarServico(usuario_id, titulo, descricao, preco, instagram, facebook, linkedin) {
  const res = await db.query(
    `INSERT INTO servicos 
     (usuario_id, titulo, descricao, preco, instagram, facebook, linkedin) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING *`,
    [usuario_id, titulo, descricao, preco, instagram, facebook, linkedin]
  );
  return res.rows[0];
}

async function atualizarServico(id, usuario_id, titulo, descricao, preco, instagram, facebook, linkedin) {
  const res = await db.query(
    `UPDATE servicos 
     SET usuario_id = $1, titulo = $2, descricao = $3, preco = $4, instagram = $5, facebook = $6, linkedin = $7
     WHERE id = $8 
     RETURNING *`,
    [usuario_id, titulo, descricao, preco, instagram, facebook, linkedin, id]
  );
  return res.rows[0];
}

async function deletarServico(id) {
  const res = await db.query('DELETE FROM servicos WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
}

module.exports = {
  listarServicos,
  criarServico,
  atualizarServico,
  deletarServico,
};
