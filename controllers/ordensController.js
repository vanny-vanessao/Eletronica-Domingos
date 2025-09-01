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
                cliente.nome AS cliente_nome, 
                aparelho.nome AS aparelho_nome, 
                aparelho.problema AS aparelho_problema,
                aparelho.fotos AS aparelho_fotos
            FROM registro
            LEFT JOIN cliente ON registro.id_cliente = cliente.id
            LEFT JOIN aparelho ON registro.id_aparelho = aparelho.id
            WHERE registro.id = ?
        `, [req.params.id]);
        res.render('pendentes/detalhes', { ordem: result[0] });
    } catch (err) {
        res.status(500).send('Erro ao buscar detalhes da ordem');
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
            WHERE registro.status_aparelho = 'Concluido'
        `);
        res.render('concluidos/index', { ordens: results });
    } catch (err) {
        res.status(500).send('Erro ao buscar ordens concluídas');
    }
};