const db = require('../config/db'); 

exports.listarPendentes = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT 
                registro.*, 
                cliente.nome AS cliente_nome, 
                aparelho.nome AS aparelho_nome, 
                aparelho.problema AS aparelho_problema,
                aparelho.fotos AS aparelho_fotos
            FROM registro
            LEFT JOIN cliente ON registro.id_cliente = cliente.id
            LEFT JOIN aparelho ON registro.id_aparelho = aparelho.id
            WHERE registro.status_aparelho = 'Pendente'
        `);
        res.render('pendentes/index', { ordens: results });
    } catch (err) {
        res.status(500).send('Erro ao buscar ordens pendentes');
    }
};

exports.detalhesOrdem = async (req, res) => {
    try {
        const [result] = await db.query(`
        SELECT 
            registro.*,

            cliente.id AS cliente_id,
            cliente.nome AS cliente_nome,
            cliente.fone AS cliente_fone,
            cliente.rg AS cliente_rg,
            cliente.cpf AS cliente_cpf,
            cliente.obs AS cliente_obs,

            aparelho.id AS aparelho_id,
            aparelho.nome AS aparelho_nome,
            aparelho.marca AS aparelho_marca,
            aparelho.modelo AS aparelho_modelo,
            aparelho.cor AS aparelho_cor,
            aparelho.problema AS aparelho_problema,
            aparelho.tipo AS aparelho_tipo,
            aparelho.data_garantia AS aparelho_data_garantia,
            aparelho.acessorios AS aparelho_acessorios,
            aparelho.obs AS aparelho_obs,
            aparelho.fotos AS aparelho_fotos,

            endereco.id AS endereco_id,
            endereco.cep AS endereco_cep,
            endereco.rua AS endereco_rua,
            endereco.numero AS endereco_numero,
            endereco.complemento AS endereco_complemento,
            endereco.bairro AS endereco_bairro,
            endereco.cidade AS endereco_cidade,
            endereco.uf AS endereco_uf,

            funcionario.id AS funcionario_id,
            funcionario.nome AS funcionario_nome

        FROM registro
        LEFT JOIN cliente ON registro.id_cliente = cliente.id
        LEFT JOIN aparelho ON registro.id_aparelho = aparelho.id
        LEFT JOIN endereco ON registro.id_endereco = endereco.id
        LEFT JOIN funcionario ON registro.id_funcionario = funcionario.id
        WHERE registro.id = ?
    `, [req.params.id]);

        // Determina a view com base na URL
        const baseUrl = req.baseUrl;
        let viewPath = 'pendentes/detalhes';
        if (baseUrl.includes('cancelados')) {
            viewPath = 'cancelados/detalhes';
        } else if (baseUrl.includes('concluidos')) {
            viewPath = 'concluidos/detalhes';
        }

        res.render(viewPath, { ordem: result[0], usuario: req.usuario });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar detalhes da ordem');
    }
};

exports.cancelar = async (req, res) => {
  const { id_ordem, obs } = req.body;

  try {
    await db.query(
      "UPDATE registro SET status_aparelho = 'Cancelado', obs = ? WHERE id = ?",
      [obs, id_ordem]
    );
    res.redirect('/cancelados');
  } catch (err) {
    console.error("Erro ao cancelar ordem:", err);
    res.status(500).send("Erro ao cancelar ordem");
  }
};

exports.concluir = async (req, res) => {
  const { id_ordem, data_entrega, valor } = req.body;

  try {
    await db.query(
      "UPDATE registro SET status_aparelho = 'Concluído', data_entrega = ?, valor = ? WHERE id = ?",
      [data_entrega, valor, id_ordem]
    );

    console.log("Dados recebidos:", id_ordem, data_entrega, valor);

    res.redirect('/concluidos'); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao concluir ordem");
  }
};

exports.listarCancelados = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT 
                registro.*, 
                cliente.nome AS cliente_nome, 
                aparelho.nome AS aparelho_nome, 
                aparelho.problema AS aparelho_problema,
                aparelho.fotos AS aparelho_fotos
            FROM registro
            LEFT JOIN cliente ON registro.id_cliente = cliente.id
            LEFT JOIN aparelho ON registro.id_aparelho = aparelho.id
            WHERE registro.status_aparelho = 'Cancelado'
        `);
        res.render('cancelados/index', { ordens: results });
    } catch (err) {
        res.status(500).send('Erro ao buscar ordens canceladas');
    }
};

exports.listarConcluidos = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT 
                registro.*, 
                cliente.nome AS cliente_nome, 
                aparelho.nome AS aparelho_nome, 
                aparelho.problema AS aparelho_problema,
                aparelho.fotos AS aparelho_fotos
            FROM registro
            LEFT JOIN cliente ON registro.id_cliente = cliente.id
            LEFT JOIN aparelho ON registro.id_aparelho = aparelho.id
            WHERE registro.status_aparelho = 'Concluído'
        `);
        res.render('concluidos/index', { ordens: results });
    } catch (err) {
        res.status(500).send('Erro ao buscar ordens concluídas');
    }
};