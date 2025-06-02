const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const autenticarToken = require('../middlewares/authMiddleware'); 

// Rotas públicas
router.post('/usuarios', usuarioController.create);
router.get('/usuarios',  usuarioController.findAll);

// Rotas protegidas
router.get('/usuarios/:id', autenticarToken, usuarioController.findById);
router.put('/usuarios/:id', autenticarToken, usuarioController.update);
router.delete('/usuarios/:id', autenticarToken, usuarioController.delete);

module.exports = router;
