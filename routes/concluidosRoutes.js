const express = require('express');
const router = express.Router();

router.get('/concluidos', (req, res) => {
  res.render('concluidos/index'); 
});

module.exports = router;