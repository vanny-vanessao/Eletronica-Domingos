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

    req.session.id_cliente = id_cliente;
    req.session.id_endereco = id_endereco;

    res.redirect('/pendentes/novo-aparelho');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar cliente');
  }
};

exports.criarOrdem2 = async (req, res) => {
  try {
    const {
      nome,
      marca,
      cor,
      modelo,
      problema,
      garantia,
      data_garantia,
      tipo,
      acessorios,
      obs
    } = req.body;

    const garantiaBool = garantia === 'sim' ? 1 : 0;
    const dataGarantia = data_garantia === '' ? null : data_garantia;
    const id_cliente = req.body.id_cliente;
    const fotos = req.file ? '/aparelhos/' + req.file.filename : null;

    const id_aparelho = await Aparelho.criar({
      nome,
      marca,
      cor,
      modelo,
      problema,
      garantia: garantiaBool,
      data_garantia: dataGarantia,
      fotos: fotos,
      tipo,
      acessorios,
      obs,
      id_cliente: id_cliente,
    });

    req.session.id_aparelho = id_aparelho;
    res.redirect('/pendentes/novo-registro');

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar aparelho');
  }
};

exports.criarOrdem3 = async (req, res) => {
  try {
     const {
        data_estimada,
        orcamento,
        status_aparelho,
        obs } = req.body;

      const id_cliente = req.body.id_cliente;
      /*const id_funcionario = req.session.cookie.httpOnly;
      console.log("TA AQUI ----------------------")
      console.log(req.session.cookie.httpOnly);
      console.log("TA AQUI ----------------------")*/

      
      if (!id_cliente) {
        return res.status(400).send('Cliente não informado!');
      }
      const id_endereco = req.body.id_endereco || req.session.id_endereco;
      const id_aparelho = req.body.id_aparelho || req.session.id_aparelho;
        if (!id_aparelho) {
          return res.status(400).send('Aparelho não informado!');
        }

    await Registro.criar({
      data_estimada,
      orcamento,
      status_aparelho,
      obs,
      id_cliente: id_cliente,
      id_aparelho: id_aparelho,
      id_endereco: id_endereco,
    });


    res.redirect('/pendentes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar ordem de serviço');
  }
};