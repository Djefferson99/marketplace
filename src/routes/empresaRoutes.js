const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const autenticarToken = require('../middlewares/authMiddleware');

router.post('/empresas', empresaController.create);
router.get('/empresas', empresaController.getAll);
router.get('/empresas/:id', empresaController.getById);
router.put('/empresas/:id',autenticarToken, empresaController.update);
router.delete('/empresas/:id',autenticarToken, empresaController.delete);

module.exports = router;
