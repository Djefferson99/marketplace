const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
// a seguir, certifique-se que o caminho bate com onde você criou:
const upload = require('../middlewares/upload');  

router.post('/', upload.single('foto_perfil'), empresaController.create);
router.get('/', empresaController.getAll);
router.get('/:id', empresaController.getById);
router.get('/usuario/:usuario_id', empresaController.getByUsuarioId);
router.put('/:id', upload.single('foto_perfil'), empresaController.update);
router.delete('/:id', empresaController.delete);

module.exports = router;
