const db = require('../config/db');

const Registro = {
  async criar(registro) {
    const [result] = await db.query(`
      INSERT INTO Registro (data_registro, data_estimada, data_entrega, orcamento, valor, status_aparelho, obs, id_funcionario, id_aparelho)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [registro.data_registro, registro.data_estimada, registro.data_entrega, registro.orcamento, registro.valor, registro.status_aparelho, registro.obs, registro.id_funcionario, registro.id_aparelho]
    );
    return result.insertId;
  }
};

module.exports = Registro;
