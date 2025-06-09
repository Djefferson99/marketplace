const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const autenticarToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// 🚩 Adiciona o middleware 'upload.single('foto_perfil')' nas rotas que recebem arquivo

router.post('/', upload.single('foto_perfil'), empresaController.create);
router.get('/', empresaController.getAll);
router.get('/:id', empresaController.getById);
router.get('/usuario/:usuario_id', empresaController.getByUsuarioId);
router.put('/:id', autenticarToken, upload.single('foto_perfil'), empresaController.update);
router.delete('/:id', autenticarToken, empresaController.delete);

module.exports = router;
