const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const autenticarToken = require('../middlewares/authMiddleware');

router.post('/',autenticarToken, empresaController.create);
router.get('/', empresaController.getAll);
router.get('/:id', empresaController.getById);
router.put('/:id',autenticarToken, empresaController.update);
router.delete('/:id',autenticarToken, empresaController.delete);

module.exports = router;
