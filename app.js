const express = require('express');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');

//   Configurações gerais
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
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

//   Rotas
app.use('/', loginRoutes);
app.use('/pendentes', pendentesRouter);
app.use('/cadastro', cadastroRoutes);
app.use('/inicial', indexRoutes);
app.use('/concluidos', concluidosRoutes);
app.use('/cancelados', canceladosRoutes);

//   Função de proteção de rota
function protegerRota(req, res, next) {
  if (req.session.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
}

//   Rotas diretas
app.get('/login', (req, res) => {
  res.render('login',{ erro: null });
});

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
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

//   Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
