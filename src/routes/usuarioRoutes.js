const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticarToken = require('../middlewares/authMiddleware');

router.get('/', usuarioController.listar);
router.get('/:id',autenticarToken, usuarioController.buscarPorId);
router.post('/', usuarioController.criar);
router.put('/:id', autenticarToken, usuarioController.atualizar);
router.delete('/:id',autenticarToken, usuarioController.deletar);

module.exports = router;
