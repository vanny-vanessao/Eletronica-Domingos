const db = require('../config/db');

const Endereco = {
  async criar(endereco) {
    const [result] = await db.query(`
      INSERT INTO Endereco (rua, numero, bairro, complemento, cidade, UF, CEP)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [endereco.rua, endereco.numero, endereco.bairro, endereco.complemento, endereco.cidade, endereco.UF, endereco.CEP]
    );
    return result.insertId;
  }
};

module.exports = Endereco;
