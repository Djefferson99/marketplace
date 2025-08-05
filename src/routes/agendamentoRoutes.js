const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

router.post('/', agendamentoController.create);
router.get('/empresa/:empresa_id', agendamentoController.getByEmpresa);
router.get('/:id', agendamentoController.getById);
router.delete('/:id', agendamentoController.delete);

module.exports = router;
