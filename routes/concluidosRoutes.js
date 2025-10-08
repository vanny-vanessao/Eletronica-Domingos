const express = require('express');
const router = express.Router();
const ordensController = require('../controllers/ordensController');

router.get('/', ordensController.listarConcluidos);
router.get('/detalhes/:id', ordensController.detalhesOrdem);

module.exports = router;