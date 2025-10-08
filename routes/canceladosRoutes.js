const express = require('express');
const router = express.Router();
const ordensController = require('../controllers/ordensController');

router.get('/', ordensController.listarCancelados);
router.get('/detalhes/:id', ordensController.detalhesOrdem);

module.exports = router;