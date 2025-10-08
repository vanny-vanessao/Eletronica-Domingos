var express = require('express');
var router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [ordens] = await db.query(`
      SELECT 
        registro.*, 
        cliente.nome AS cliente_nome, 
        aparelho.nome AS aparelho_nome, 
        aparelho.problema AS aparelho_problema,
        aparelho.fotos AS aparelho_fotos
      FROM registro
      LEFT JOIN cliente ON registro.id_cliente = cliente.id
      LEFT JOIN aparelho ON registro.id_aparelho = aparelho.id
      WHERE registro.status_aparelho = 'Pendente'
    `);

    res.render('index', { usuario: req.session.usuario, ordens });
  } catch (err) {
    console.error('Erro ao buscar ordens pendentes:', err);
    res.status(500).send('Erro ao carregar a página inicial');
  }
});

router.get('/inicial', (req, res) => {
  res.render('index', { usuario: req.session.usuario });
});

module.exports = router;
