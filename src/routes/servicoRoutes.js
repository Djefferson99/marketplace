const express = require('express');
const router = express.Router();
const ServicoController = require('../controllers/servicoController');
const autenticarToken = require('../middlewares/authMiddleware');

router.get('/', autenticarToken, ServicoController.listar);
router.post('/', autenticarToken, ServicoController.criar);
router.put('/:id', autenticarToken, ServicoController.atualizar);
router.delete('/:id', autenticarToken, ServicoController.deletar);

module.exports = router;
