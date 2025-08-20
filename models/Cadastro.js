const db = require('../config/db');

const Cadastro = {
  async criar(cadastro) {
    const [result] = await db.query(`
      INSERT INTO Funcionario (nome, email, senha, usuario)
      VALUES (?, ?, ?, ?)`,
      [cadastro.nome, cadastro.email, cadastro.senha, cadastro.usuario]
    );
    return result.insertId;
  }
};

module.exports = Cadastro;
