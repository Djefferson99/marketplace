const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

router.get('/', UsuarioController.listar);
router.post('/', UsuarioController.criar);
router.put('/:id', autenticarToken, UsuarioController.atualizar);
router.delete('/:id',autenticarToken, UsuarioController.deletar);

module.exports = router;
