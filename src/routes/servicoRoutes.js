const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController');

router.post('/', servicoController.create);
router.get('/', servicoController.getAll);
router.get('/:id', servicoController.getById);
router.put('/:id', servicoController.update);
router.delete('/:id', servicoController.delete);

module.exports = router;
