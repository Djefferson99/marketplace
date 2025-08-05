const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

router.post('/', empresaController.create);
router.get('/', empresaController.getAll);
router.get('/:id', empresaController.getById);
router.get('/usuario/:usuario_id', empresaController.getByUsuarioId);
router.put('/:id', empresaController.update);
router.delete('/:id', empresaController.delete);

module.exports = router;
