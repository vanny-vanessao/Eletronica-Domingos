const Endereco = require('../models/Endereco');
const Cliente = require('../models/Cliente');
const Aparelho = require('../models/Aparelho');
const Registro = require('../models/Registro');

exports.criarOrdem1 = async (req, res) => {
  try {
    const {
      nome, fone, rg, cpf, obs, // cliente
      cidade, bairro, rua, complemento, numero, CEP, UF, // endereco
    } = req.body;

    let id_endereco = null;
    if (rua && cidade && bairro && UF && CEP) {
      id_endereco = await Endereco.criar({ rua, numero, bairro, complemento, cidade, UF, CEP });
    }

    const id_cliente = await Cliente.criar({ nome, fone, rg, cpf, obs, id_endereco });

    // Salve o id_cliente na sessão para usar na próxima etapa, se necessário
    req.session.id_cliente = id_cliente;

    res.redirect('/pendentes/novo-aparelho');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar cliente');
  }
};

exports.criarOrdem2 = async (req, res) => {
  try {
    const {
      nome, marca, cor, modelo, problema, garantia, tipo, acessorios, obs, fotos,
    } = req.body;

    const garantiaBool = garantia === 'sim' ? 1 : 0;
    const data_garantia = req.body.data_garantia === '' ? null : req.body.data_garantia;
    const id_cliente = req.body.id_cliente;

    const id_aparelho = await Aparelho.criar({
      nome,
      marca,
      cor,
      modelo,
      problema,
      garantia: garantiaBool,
      data_garantia,
      fotos,
      tipo,
      acessorios,
      obs,
      id_cliente: id_cliente,
    });

    res.redirect('/pendentes/novo-registro');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar aparelho');
  }
};

exports.criarOrdem3 = async (req, res) => {
  try {
    const {
      data_registro, data_estimada, data_entrega, orcamento, valor, status_aparelho, registro_obs, id_funcionario // registro
    } = req.body;
    
    const id_cliente = req.body.id_cliente;
    const id_aparelho = req.body.id_aparelho;

    await Registro.criar({
      data_registro,
      data_estimada,
      data_entrega,
      orcamento,
      valor,
      status_aparelho,
      obs: registro_obs,
      id_cliente: id_cliente,
      id_aparelho: id_aparelho,
    });

    res.redirect('/pendentes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar ordem de serviço');
  }
};