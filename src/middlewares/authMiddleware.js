const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_super_segura';

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' });

    req.usuario = usuario;
    next();
  });
}

module.exports = autenticarToken;
