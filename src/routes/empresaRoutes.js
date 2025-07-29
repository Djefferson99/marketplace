// const express = require('express');
// const router = express.Router();
// const empresaController = require('../controllers/empresaController');
// // a seguir, certifique-se que o caminho bate com onde você criou:
// const upload = require('../middlewares/upload');  

// router.post('/', upload.single('foto_perfil'), empresaController.create);
// router.get('/', empresaController.getAll);
// router.get('/:id', empresaController.getById);
// router.get('/usuario/:usuario_id', empresaController.getByUsuarioId);
// router.put('/:id', upload.single('foto_perfil'), empresaController.update);
// router.delete('/:id', empresaController.delete);

// module.exports = router;


const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

// CREATE (sem multer): espera foto_url e foto_key no body
router.post('/', empresaController.create);

// LIST
router.get('/', empresaController.getAll);

// ESPECÍFICA DO USUÁRIO (coloque antes de /:id)
router.get('/usuario/:usuario_id', empresaController.getByUsuarioId);

// BY ID (com regex numérico para não capturar "usuario")
router.get('/:id(\\d+)', empresaController.getById);

// UPDATE (sem multer)
router.put('/:id(\\d+)', empresaController.update);

// DELETE
router.delete('/:id(\\d+)', empresaController.delete);

module.exports = router;
