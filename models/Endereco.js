const db = require('../config/db');

const Endereco = {
  async criar(endereco) {
    const [result] = await db.query(`
      INSERT INTO Endereco (rua, numero, bairro, complemento, cidade, UF, CEP)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [endereco.rua, endereco.numero, endereco.bairro, endereco.complemento, endereco.cidade, endereco.UF, endereco.CEP]
    );
    return result.insertId;
  },

  async atualizar({ id, rua, numero, bairro, complemento, cidade, UF, CEP }) {
    const sql = `
      UPDATE Endereco
      SET rua = ?, numero = ?, bairro = ?, complemento = ?, cidade = ?, UF = ?, CEP = ?
      WHERE id = ?
    `;
    const params = [rua, numero, bairro, complemento, cidade, UF, CEP, id];
    await db.query(sql, params);
  }
};

module.exports = Endereco;
