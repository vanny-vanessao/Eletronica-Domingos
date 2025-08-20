const db = require('../config/db');

const Cliente = {
  async criar(cliente) {
    const [result] = await db.query(`
      INSERT INTO Cliente (nome, fone, rg, cpf, obs, id_endereco)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [cliente.nome, cliente.fone, cliente.rg, cliente.cpf, cliente.obs, cliente.id_endereco]
    );
    return result.insertId;
  }
};

module.exports = Cliente;
