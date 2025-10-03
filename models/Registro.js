const db = require('../config/db');

const Registro = {
  async criar(registro) {
    const [result] = await db.query(`
      INSERT INTO Registro (data_estimada, orcamento, status_aparelho, obs, id_cliente, id_aparelho, id_endereco)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [registro.data_estimada, registro.orcamento, registro.status_aparelho || 'Pendente', registro.obs, registro.id_cliente, registro.id_aparelho, registro.id_endereco]
    );
    return result.insertId;
  }
};

module.exports = Registro;
