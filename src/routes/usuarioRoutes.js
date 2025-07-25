const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticarToken = require('../middlewares/authMiddleware'); 

// Rotas públicas
router.post('/', usuarioController.create);
router.get('/',  usuarioController.findAll);
router.get('/:id', usuarioController.findById);

// Rotas protegidas
router.put('/:id', autenticarToken, usuarioController.update);
router.delete('/:id', autenticarToken, usuarioController.delete);

module.exports = router;
