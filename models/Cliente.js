const db = require('../config/db');

const Cliente = {
  async criar(cliente) {
    const [result] = await db.query(`
      INSERT INTO Cliente (nome, fone, rg, cpf, obs, id_endereco)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [cliente.nome, cliente.fone, cliente.rg, cliente.cpf, cliente.obs, cliente.id_endereco]
    );
    return result.insertId;
  },

  async atualizar({ id, nome, fone, rg, cpf, obs, id_endereco }) {
    const sql = `UPDATE Cliente SET nome = ?, fone = ?, rg = ?, cpf = ?, obs = ?, id_endereco = ? WHERE id = ?`;
    const params = [nome || null, fone || null, rg || null, cpf || null, obs || null, id_endereco || null, id];
    await db.query(sql, params);
  }
};

module.exports = Cliente;
