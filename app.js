const express = require('express');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');
const pool = require('./config/db'); // <-- ADICIONADO: pool para consultar o banco

// --- Try to load jsonwebtoken, but don't crash if the module is not installed ---
let jwt = null;
let JWT_SECRET = process.env.JWT_SECRET || 'troque_por_seguro';
try {
  jwt = require('jsonwebtoken');
} catch (err) {
  console.warn('Aviso: pacote "jsonwebtoken" não está instalado. JWT será desabilitado. Para habilitar execute: npm install jsonwebtoken');
  jwt = null;
}

//   Configurações gerais
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use(methodOverride('_method'));

//   Suas rotas
const pendentesRouter = require('./routes/pendentesRoutes');
const indexRoutes = require('./routes/indexRoutes');
const loginRoutes = require('./routes/loginRoutes');
const cadastroRoutes = require('./routes/cadastroRoutes');
const concluidosRoutes = require('./routes/concluidosRoutes');
const canceladosRoutes = require('./routes/canceladosRoutes');

//   Middleware de sessão
app.use(session({
  secret: 'segredo',
  resave: false,
  saveUninitialized: false
}));

// novo: aceitar token JWT via header Authorization e popular sessão
app.use(async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    // apenas tentar verificar token se o módulo estiver disponível e houver Authorization Bearer
    if (jwt && !req.session.usuario && auth.startsWith('Bearer ')) {
      const token = auth.slice(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.usuario) {
          req.session.usuario = decoded.usuario;
        }
      } catch (err) {
        // token inválido -> ignore e prossiga sem sessão
      }
    }
  } catch (err) {
    // ignore
  }
  next();
});

// Expor usuario para todas as views (evita ReferenceError quando templates acessam usuario)
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// NOVA ROTA: pesquisa clientes por CPF (ou por nome se preferir)
app.get('/clientes', async (req, res) => {
  try {
    const { cpf, nome } = req.query;
    if (cpf) {
      const digits = ('' + cpf).replace(/\D/g, ''); // só dígitos
      // compara CPF no banco removendo pontos/traço/espaços
      const sql = `
        SELECT c.id, c.nome, c.cpf, c.rg, c.fone,
               e.rua AS endereco_rua, e.numero AS endereco_numero, e.bairro AS endereco_bairro
        FROM Cliente c
        LEFT JOIN Endereco e ON c.id_endereco = e.id
        WHERE REPLACE(REPLACE(REPLACE(c.cpf, '.', ''), '-', ''), ' ', '') LIKE ?
        LIMIT 20
      `;
      const [rows] = await pool.query(sql, [`%${digits}%`]);
      return res.json(rows);
    } else if (nome) {
      const sql = `
        SELECT c.id, c.nome, c.cpf, c.rg, c.fone,
               e.rua AS endereco_rua, e.numero AS endereco_numero, e.bairro AS endereco_bairro
        FROM Cliente c
        LEFT JOIN Endereco e ON c.id_endereco = e.id
        WHERE c.nome LIKE ?
        LIMIT 20
      `;
      const [rows] = await pool.query(sql, [`%${nome}%`]);
      return res.json(rows);
    } else {
      return res.json([]);
    }
  } catch (err) {
    console.error('Erro /clientes:', err);
    res.status(500).json({ error: 'Erro ao consultar clientes' });
  }
});

// Implementação simples de login que retorna JWT + seta sessão
// Substitua a verificação por consulta ao banco e verificação de senha conforme sua lógica
app.post('/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    // TODO: substituir por autenticação real (consulta ao banco, bcrypt compare, etc.)
    if (!usuario || !senha) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    // carregar dados reais do DB aqui; exemplo simplificado:
    const user = { nome: usuario };

    // criar sessão
    req.session.usuario = user;

    // emitir JWT somente se o módulo estiver instalado
    if (jwt) {
      const token = jwt.sign({ usuario: user }, JWT_SECRET, { expiresIn: '8h' });
      return res.json({ token, usuario: user });
    } else {
      // fallback: retornar somente usuario (sem token)
      return res.json({ usuario: user, warning: 'JWT não disponível (jsonwebtoken ausente no servidor)' });
    }
  } catch (err) {
    console.error('Erro no POST /login', err);
    res.status(500).json({ error: 'Erro no login' });
  }
});

//   Rotas
app.use('/', loginRoutes);
// rotas públicas
app.use('/cadastro', cadastroRoutes);

// rotas protegidas (exigem sessão/autenticação)
app.use('/pendentes', protegerRota, pendentesRouter);
app.use('/inicial', protegerRota, indexRoutes);
app.use('/concluidos', protegerRota, concluidosRoutes);
app.use('/cancelados', protegerRota, canceladosRoutes);

//   Função de proteção de rota
function protegerRota(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  }
  // no caso de requisições AJAX/API, pode retornar 401 em vez de redirect
  return res.redirect('/login');
}

//   Rotas diretas
app.get('/login', (req, res) => {
  res.render('login',{ erro: null });
});

app.get('/', protegerRota, (req, res) => {
  res.render('index', { usuario: req.session.usuario });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

/* ADICIONADO: fallback para redirecionar qualquer rota não encontrada para /login
   Isso faz com que digitar texto aleatório na URL leve o usuário à tela de login. */
app.use((req, res) => {
  return res.redirect('/login');
});

//   Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
