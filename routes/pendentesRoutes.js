const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');
const ordensController = require('../controllers/ordensController');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/aparelhos/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


// Página de listagem dos pendentes
router.get('/', ordensController.listarPendentes);


// Páginas do formulário de novo conserto
router.get('/novo-cliente', (req, res) => {
  res.render('pendentes/novo-conserto1'); 
});
router.post('/novo-conserto1', registroController.criarOrdem1);

router.get('/novo-aparelho', (req, res) => {
  res.render('pendentes/novo-conserto2', { id_cliente: req.session.id_cliente });
});
router.post('/novo-conserto2', upload.single('fotos'), registroController.criarOrdem2);

router.get('/novo-registro', (req, res) => {
  res.render('pendentes/novo-registro', {
    id_cliente: req.session.id_cliente,
    id_aparelho: req.session.id_aparelho
  });
});
router.post('/novo-registro', registroController.criarOrdem3);

module.exports = router;