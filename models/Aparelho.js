const db = require('../config/db');

const Aparelho = {
  async criar(aparelho) {
    const [result] = await db.query(`
      INSERT INTO Aparelho (nome, marca, cor, modelo, problema, garantia, data_garantia, fotos, tipo, acessorios, obs, id_cliente)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [aparelho.nome, aparelho.marca, aparelho.cor, aparelho.modelo, aparelho.problema, aparelho.garantia, aparelho.data_garantia, aparelho.fotos, aparelho.tipo, aparelho.acessorios, aparelho.obs, aparelho.id_cliente]
    );
    return result.insertId;
  },

  async atualizar({ id, nome, marca, cor, modelo, problema, garantia, data_garantia, fotos, tipo, acessorios, obs }) {
    const sql = `UPDATE Aparelho SET nome = ?, marca = ?, cor = ?, modelo = ?, problema = ?, garantia = ?, data_garantia = ?, fotos = ?, tipo = ?, acessorios = ?, obs = ? WHERE id = ?`;
    const params = [
      nome || null,
      marca || null,
      cor || null,
      modelo || null,
      problema || null,
      garantia != null ? garantia : null,
      data_garantia || null,
      fotos || null,
      tipo || null,
      acessorios || null,
      obs || null,
      id
    ];
    await db.query(sql, params);
  }
};

module.exports = Aparelho;
