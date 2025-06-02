const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/agendamentoController');

router.get('/', AgendamentoController.listar);
router.post('/', AgendamentoController.criar);
router.put('/:id', AgendamentoController.atualizar);
router.delete('/:id', AgendamentoController.deletar);

module.exports = router;
