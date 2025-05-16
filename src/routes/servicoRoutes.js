const express = require('express');
const router = express.Router();
const ServicoController = require('../controllers/servicoController');
const autenticarToken = require('../middlewares/authMiddleware');

router.get('/', autenticarToken, servicoController.listar);
router.post('/', autenticarToken, servicoController.criar);
router.put('/:id', ServicoController.atualizar);
router.delete('/:id', ServicoController.deletar);

module.exports = router;
