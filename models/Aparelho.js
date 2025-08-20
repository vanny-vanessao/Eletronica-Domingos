const db = require('../config/db');

const Aparelho = {
  async criar(aparelho) {
    const [result] = await db.query(`
      INSERT INTO Aparelho (nome, marca, cor, modelo, problema, garantia, data_garantia, fotos, tipo, acessorios, obs, id_cliente)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [aparelho.nome, aparelho.marca, aparelho.cor, aparelho.modelo, aparelho.problema, aparelho.garantia, aparelho.data_garantia, aparelho.fotos, aparelho.tipo, aparelho.acessorios, aparelho.obs, aparelho.id_cliente]
    );
    return result.insertId;
  }
};

module.exports = Aparelho;
