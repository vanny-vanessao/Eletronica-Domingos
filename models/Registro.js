const db = require('../config/db');

const Registro = {
  async criar(registro) {
    const [result] = await db.query(`
      INSERT INTO Registro (data_registro, data_estimada, data_entrega, orcamento, valor, status_aparelho, obs, id_cliente, id_aparelho, id_endereco)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [registro.data_registro, registro.data_estimada, registro.data_entrega, registro.orcamento, registro.valor, registro.status_aparelho || 'Pendente', registro.obs, registro.id_cliente, registro.id_aparelho, registro.id_endereco]
    );
    return result.insertId;
  }
};

module.exports = Registro;
