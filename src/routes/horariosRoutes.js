const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

router.post('/', horarioController.create);
router.get('/empresa/:empresa_id', horarioController.getByEmpresaId);
router.put('/:id', horarioController.update);
router.delete('/:id', horarioController.delete);

module.exports = router;
