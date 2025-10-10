const db = require('../config/db');

const Registro = {
  async criar(registro) {
    const [result] = await db.query(`
      INSERT INTO Registro (data_estimada, orcamento, status_aparelho, obs, id_cliente, id_aparelho, id_endereco, id_funcionario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [registro.data_estimada, registro.orcamento, registro.status_aparelho || 'Pendente', registro.obs, registro.id_cliente, registro.id_aparelho, registro.id_endereco, registro.id_funcionario]
    );
    return result.insertId;
  },

  async atualizar({ id, data_estimada, orcamento, obs }) {
    const sql = `UPDATE Registro SET data_estimada = ?, orcamento = ?, obs = ? WHERE id = ?`;
    const params = [data_estimada || null, orcamento || null, obs || null, id];
    await db.query(sql, params);
  }
};

module.exports = Registro;
