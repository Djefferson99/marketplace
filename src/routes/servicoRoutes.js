const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController');
const autenticarToken = require('../middlewares/authMiddleware');

router.post('/',autenticarToken, servicoController.create);
router.get('/', servicoController.getAll);
router.get('/:id', servicoController.getById);
router.put('/:id',autenticarToken, servicoController.update);
router.delete('/:id',autenticarToken, servicoController.delete);

module.exports = router;
