const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');

// Página de listagem dos pendentes
router.get('/', (req, res) => {
  res.render('pendentes/index'); 
});

// Página do formulário de novo conserto
router.get('/novo-cliente', (req, res) => {
  res.render('pendentes/novo-conserto1'); 
});

// rota que recebe o POST do formulário
router.post('/novo-conserto1', registroController.criarOrdem1);

// Exibe o formulário da segunda etapa
router.get('/novo-aparelho', (req, res) => {
  res.render('pendentes/novo-conserto2', { id_cliente: req.session.id_cliente });
});

// Processa o POST da segunda etapa (se necessário)
router.post('/novo-conserto2', registroController.criarOrdem2);

// Exibe o formulário da terceira etapa
router.get('/novo-registro', (req, res) => {
  res.render('pendentes/novo-registro', {
    id_cliente: req.session.id_cliente,
    id_aparelho: req.session.id_aparelho
  });
});

// Processa o POST da terceira etapa (se necessário)
router.post('/novo-registro', registroController.criarOrdem3);

module.exports = router;