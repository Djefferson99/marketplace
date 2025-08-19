const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const upload = require('../middlewares/upload');  

router.post('/', upload.single('foto_perfil'), empresaController.create);
router.get('/', empresaController.getAll);
router.get('/usuario/:usuario_id', empresaController.getByUsuarioId); // <— antes de /:id
router.get('/:id', empresaController.getById);
router.put('/:id', upload.single('foto_perfil'), empresaController.update);
router.delete('/:id', empresaController.delete);

module.exports = router;
