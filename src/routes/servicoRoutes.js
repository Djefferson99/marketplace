// routes/servicos.js
const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController');
const autenticarToken = require('../middlewares/authMiddleware');

router.post('/', autenticarToken, servicoController.create);
router.get('/', servicoController.getAll);

// específica ANTES da genérica + parâmetros numéricos
router.get('/empresa/:empresa_id(\\d+)', servicoController.getByEmpresaId);

router.get('/:id(\\d+)', servicoController.getById);
router.put('/:id(\\d+)', autenticarToken, servicoController.update);
router.delete('/:id(\\d+)', autenticarToken, servicoController.delete);

module.exports = router;