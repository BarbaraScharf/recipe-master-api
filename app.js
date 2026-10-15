var express = require('express');
var logger = require('morgan');
var cors = require('cors');
var path = require('path');
require('dotenv').config();

var indexRouter = require('./routes/index');
var searchRoutes = require('./modules/search/searchRoutes');
var userRoutes = require('./modules/user/userRoutes');
var recipeRoutes = require('./modules/recipe/recipeRoutes');
var likeRoutes = require('./modules/like/likeRoutes');
var commentRoutes = require('./modules/comment/commentRoutes');
var errorHandler = require('./middlewares/errorHandler');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Servir arquivos estáticos (uploads de perfil)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api', indexRouter);
app.use('/api', searchRoutes);
app.use('/api', userRoutes);
app.use('/api', recipeRoutes);
app.use('/api', likeRoutes);
app.use('/api', commentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada.',
    errors: []
  });
});

app.use(errorHandler);

// Associações devem ser carregadas ANTES do sync
require('./config/associations');

const sequelize = require('./config/database');
sequelize.sync({ alter: true })
  .then(() => console.log('Banco de dados sincronizado!'))
  .catch(err => console.error('Erro ao sincronizar banco:', err));

module.exports = app;
