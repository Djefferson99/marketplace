const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController');
const autenticarToken = require('../middlewares/authMiddleware');

router.post('/servicos',autenticarToken, servicoController.create);
router.get('/servicos', servicoController.getAll);
router.get('/servicos/:id', servicoController.getById);
router.put('/servicos/:id',autenticarToken, servicoController.update);
router.delete('/servicos/:id',autenticarToken, servicoController.delete);

module.exports = router;
