const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.renderCadastro = (req, res) => {
  res.render('cadastro', { erro: null, sucesso: null });
};

exports.cadastrarFuncionario = async (req, res) => {
  const { nome, email, usuario, senha, confirmar_senha } = req.body;

  if (!nome || !email || !usuario || !senha || !confirmar_senha) {
    return res.render('cadastro', { erro: 'Preencha todos os campos.', sucesso: null });
  }

  if (senha !== confirmar_senha) {
    return res.render('cadastro', { erro: 'As senhas não conferem.', sucesso: null });
  }

  try {
    const [results] = await db.query(
      'SELECT * FROM Funcionario WHERE email = ? OR usuario = ?',
      [email, usuario]
    );

    if (results.length > 0) {
      return res.render('cadastro', {
        erro: 'Já existe um funcionário com este email ou usuário.',
        sucesso: null
      });
    }

    const hash = await bcrypt.hash(senha, 10);

    await db.query(
      'INSERT INTO Funcionario (nome, email, senha, usuario) VALUES (?, ?, ?, ?)',
      [nome, email, hash, usuario]
    );

    return res.render('cadastro', {
      erro: null,
      sucesso: 'Funcionário cadastrado com sucesso!'
    });
  } catch (err) {
    console.error(err);
    return res.render('cadastro', { erro: 'Erro ao cadastrar funcionário.', sucesso: null });
  }
};