const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horariosController');

router.post('/', horarioController.create);
router.get('/empresa/:empresa_id', horarioController.getByEmpresaId);
router.get('/:id', horarioController.getById);
router.put('/:id', horarioController.update);
router.delete('/:id', horarioController.delete);

module.exports = router;
