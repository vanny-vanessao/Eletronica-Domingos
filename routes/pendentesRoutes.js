const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');
const ordensController = require('../controllers/ordensController');
const multer = require('multer');
const fs = require("fs");
const path = require('path');
const pool = require('../config/db'); // usa o pool em config/db.js

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../public/aparelhos");

    // cria a pasta caso não exista
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir); // só chama depois de garantir que existe
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// Página de listagem dos pendentes
router.get('/', ordensController.listarPendentes);
router.get('/detalhes/:id', ordensController.detalhesOrdem);
router.post('/concluir', ordensController.concluir);
router.post('/cancelar', ordensController.cancelar);

// Páginas do formulário de novo conserto
router.get('/novo-cliente', (req, res) => {
  res.render('pendentes/novo-conserto1'); 
});
router.post('/novo-conserto1', registroController.criarOrdem1);

router.get('/novo-aparelho', (req, res) => {
  res.render('pendentes/novo-conserto2', { id_cliente: req.session.id_cliente });
});
router.post('/novo-conserto2', upload.single('fotos'), registroController.criarOrdem2);

router.get('/novo-registro', (req, res) => {
  res.render('pendentes/novo-registro', {
    id_cliente: req.session.id_cliente,
    id_aparelho: req.session.id_aparelho
  });
});
router.post('/novo-registro', registroController.criarOrdem3);

// Rota para atualizar ordem (cliente / endereco / aparelho / registro)
router.post('/editar/:id', async (req, res) => {
  const id_registro = req.params.id;

  // ids vindos do form (hidden inputs)
  const id_cliente = req.body.id_cliente;
  const id_aparelho = req.body.id_aparelho;
  const id_endereco = req.body.id_endereco || null;

  // Normalize funções utilitárias
  const emptyToNull = v => (v === undefined || v === '' ? null : v);
  const toNumberOrNull = v => (v === undefined || v === '' ? null : v);

  // Cliente
  const cliente = {
    nome: emptyToNull(req.body.nome),
    fone: emptyToNull(req.body.fone),
    rg: emptyToNull(req.body.rg),
    cpf: emptyToNull(req.body.cpf),
  };

  // Endereço
  const endereco = {
    rua: emptyToNull(req.body.end_rua),
    numero: emptyToNull(req.body.end_numero),
    bairro: emptyToNull(req.body.end_bairro),
    complemento: emptyToNull(req.body.end_complemento) || '',
    cidade: emptyToNull(req.body.end_cidade),
    UF: emptyToNull(req.body.end_uf),
    CEP: emptyToNull(req.body.end_cep)
  };

  // Aparelho
  const aparelho = {
    nome: emptyToNull(req.body.aparelho_nome),
    problema: emptyToNull(req.body.aparelho_problema),
    marca: emptyToNull(req.body.aparelho_marca),
    modelo: emptyToNull(req.body.aparelho_modelo),
    cor: emptyToNull(req.body.aparelho_cor),
    data_garantia: emptyToNull(req.body.aparelho_data_garantia),
    acessorios: emptyToNull(req.body.aparelho_acessorios)
  };

  // Registro
  const registro = {
    data_estimada: emptyToNull(req.body.data_estimada),
    orcamento: toNumberOrNull(req.body.orcamento),
    obs: emptyToNull(req.body.obs)
  };

  try {
    // Atualiza Cliente (se id_cliente presente)
    if (id_cliente) {
      const sqlCliente = `UPDATE Cliente SET nome = ?, fone = ?, rg = ?, cpf = ? WHERE id = ?`;
      await pool.query(sqlCliente, [cliente.nome, cliente.fone, cliente.rg, cliente.cpf, id_cliente]);
    }

    // Endereço: se existe id_endereco e foram enviados dados, atualiza; caso contrário, se não tem id e foi enviado endereço, cria
    if ( (id_endereco && (endereco.rua || endereco.bairro || endereco.cidade || endereco.CEP)) ) {
      const sqlEndereco = `UPDATE Endereco SET rua = ?, numero = ?, bairro = ?, complemento = ?, cidade = ?, UF = ?, CEP = ? WHERE id = ?`;
      await pool.query(sqlEndereco, [endereco.rua, endereco.numero, endereco.bairro, endereco.complemento, endereco.cidade, endereco.UF, endereco.CEP, id_endereco]);
    } else if (!id_endereco && (endereco.rua || endereco.bairro || endereco.cidade || endereco.CEP)) {
      const sqlInsertEndereco = `INSERT INTO Endereco (rua, numero, bairro, complemento, cidade, UF, CEP) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const [result] = await pool.query(sqlInsertEndereco, [endereco.rua, endereco.numero, endereco.bairro, endereco.complemento, endereco.cidade, endereco.UF, endereco.CEP]);
      const novoIdEndereco = result.insertId;
      if (id_cliente && novoIdEndereco) {
        const sqlAtualizaCliente = `UPDATE Cliente SET id_endereco = ? WHERE id = ?`;
        await pool.query(sqlAtualizaCliente, [novoIdEndereco, id_cliente]);
      }
    }

    // Atualiza Aparelho
    if (id_aparelho) {
      const sqlAparelho = `UPDATE Aparelho SET nome = ?, problema = ?, marca = ?, modelo = ?, cor = ?, data_garantia = ?, acessorios = ? WHERE id = ?`;
      await pool.query(sqlAparelho, [
        aparelho.nome,
        aparelho.problema,
        aparelho.marca,
        aparelho.modelo,
        aparelho.cor,
        aparelho.data_garantia,
        aparelho.acessorios,
        id_aparelho
      ]);
    }

    // Atualiza Registro
    const sqlRegistro = `UPDATE Registro SET data_estimada = ?, orcamento = ?, obs = ? WHERE id = ?`;
    await pool.query(sqlRegistro, [registro.data_estimada, registro.orcamento, registro.obs, id_registro]);

    // Redireciona de volta para a página de detalhes
    res.redirect(`/pendentes/detalhes/${id_registro}`);
  } catch (err) {
    console.error('Erro ao atualizar ordem:', err);
    res.status(500).send('Erro ao atualizar ordem');
  }
});

module.exports = router;