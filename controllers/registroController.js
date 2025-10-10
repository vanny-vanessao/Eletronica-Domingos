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

    // ...novo campo vindo do formulário quando "Cliente já cadastrado?" é usado...
    const id_cliente_existing = req.body.id_cliente_existing || null;

    let id_endereco = null;
    let id_cliente = null;

    if (!id_cliente_existing) {
      // Só cria endereço/cliente quando NÃO foi selecionado cliente existente
      if (rua && cidade && bairro && UF && CEP) {
        id_endereco = await Endereco.criar({ rua, numero, bairro, complemento, cidade, UF, CEP });
      }

      id_cliente = await Cliente.criar({ nome, fone, rg, cpf, obs, id_endereco });
      req.session.id_cliente = id_cliente;
      req.session.id_endereco = id_endereco;
    } else {
      // Cliente existente: usa o id informado, NÃO cria novo cliente nem endereço
      id_cliente = id_cliente_existing;
      // manter id_endereco na sessão como antes (null ou existente) — não sobrescreve
      req.session.id_cliente = id_cliente;
      // não alterar req.session.id_endereco quando cliente existente selecionado
    }

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
      const id_funcionario = req.session.usuario.id
      const id_endereco = req.body.id_endereco || req.session.id_endereco;
      const id_aparelho = req.body.id_aparelho || req.session.id_aparelho;
      
      
      
      
      
      if (!id_funcionario) {
        return res.status(400).send('Funcionário não informado!');
      }
      if (!id_cliente) {
        return res.status(400).send('Cliente não informado!');
      }
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
      id_funcionario: id_funcionario,
    });


    res.redirect('/pendentes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar ordem de serviço');
  }
};

// nova ação: atualiza cliente / endereco / aparelho / registro
exports.editarOrdem = async (req, res) => {
  try {
    const id_registro = req.params.id;
    // ids recebidos do form (hidden inputs)
    const { id_cliente, id_aparelho, id_endereco } = req.body;

    // campos Cliente
    const clienteData = {
      id: id_cliente,
      nome: req.body.nome,
      fone: req.body.fone,
      rg: req.body.rg,
      cpf: req.body.cpf,
    };

    // campos Endereco (pode ser vazio se não existir)
    const enderecoData = {
      id: id_endereco || null,
      rua: req.body.end_rua,
      numero: req.body.end_numero,
      bairro: req.body.end_bairro,
      cidade: req.body.end_cidade,
      UF: req.body.end_uf,
      CEP: req.body.end_cep,
    };

    // campos Aparelho
    const aparelhoData = {
      id: id_aparelho,
      nome: req.body.aparelho_nome,
      problema: req.body.aparelho_problema,
      marca: req.body.aparelho_marca,
      modelo: req.body.aparelho_modelo,
      cor: req.body.aparelho_cor,
      data_garantia: req.body.aparelho_data_garantia || null,
      acessorios: req.body.aparelho_acessorios,
    };

    // campos Registro
    const registroData = {
      id: id_registro,
      data_estimada: req.body.data_estimada || null,
      orcamento: req.body.orcamento || null,
      obs: req.body.obs || null,
    };

    // Atualiza Cliente
    if (clienteData.id) {
      await Cliente.atualizar(clienteData);
    }

    // Atualiza/Cria Endereco (se o usuário enviou endereço)
    if (enderecoData.rua || enderecoData.bairro || enderecoData.cidade || enderecoData.CEP) {
      if (enderecoData.id) {
        await Endereco.atualizar(enderecoData);
      } else {
        // caso não exista id_endereco, cria e vincula ao cliente (opcional)
        const novoIdEndereco = await Endereco.criar({
          rua: enderecoData.rua,
          numero: enderecoData.numero,
          bairro: enderecoData.bairro,
          complemento: req.body.end_complemento || '',
          cidade: enderecoData.cidade,
          UF: enderecoData.UF,
          CEP: enderecoData.CEP
        });
        // atualiza cliente para referenciar novo endereco
        if (clienteData.id && novoIdEndereco) {
          await Cliente.atualizar({ id: clienteData.id, id_endereco: novoIdEndereco });
        }
      }
    }

    // Atualiza Aparelho
    if (aparelhoData.id) {
      await Aparelho.atualizar(aparelhoData);
    }

    // Atualiza Registro
    await Registro.atualizar(registroData);

    // redireciona de volta para a página de detalhes
    res.redirect('/pendentes/detalhes/' + id_registro);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar ordem');
  }
};