var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { usuario: req.session.usuario });
});

router.get('/inicial', (req, res) => {
  res.render('index', { usuario: req.session.usuario });
});

module.exports = router;
