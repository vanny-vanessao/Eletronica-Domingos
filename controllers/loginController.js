const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.login = async (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.render('login', { erro: 'Preencha todos os campos.' });
  }

  try {
    const [results] = await db.query('SELECT * FROM Funcionario WHERE usuario = ?', [usuario]);

    if (results.length === 0) {
      return res.render('login', { erro: 'Usuário não encontrado.' });
    }

    const funcionario = results[0];
    const confere = await bcrypt.compare(senha, funcionario.senha);

    if (confere) {
      req.session.usuario = funcionario;
      return res.redirect('/inicial');
    } else {
      return res.render('login', { erro: 'Senha incorreta.' });
    }
  } catch (err) {
    console.error(err);
    return res.render('login', { erro: 'Erro no servidor.' });
  }
};

exports.renderLogin = (req, res) => {
  res.render('login', { erro: null });
};