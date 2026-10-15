/**
 * config/associations.js
 *
 * Centraliza TODAS as associações entre models do Sequelize.
 *
 * Por que um arquivo separado?
 * Se User importasse Recipe e Recipe importasse User, teríamos uma referência
 * circular entre módulos — Node.js resolveria um dos dois como objeto vazio,
 * causando erros silenciosos. Ao importar os dois aqui e só aqui, quebramos
 * esse ciclo: nenhum model precisa conhecer o outro diretamente.
 *
 * Deve ser carregado em app.js ANTES de sequelize.sync().
 */
const User    = require('../modules/user/userModel');
const Recipe  = require('../modules/recipe/recipeModel');
const Like    = require('../modules/like/likeModel');
const Comment = require('../modules/comment/commentModel');

// Recipe ↔ User
User.hasMany(Recipe,   { foreignKey: 'userId', as: 'recipes',  onDelete: 'CASCADE' });
Recipe.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Like ↔ User / Recipe
User.hasMany(Like,    { foreignKey: 'userId',   as: 'likes',            onDelete: 'CASCADE' });
Like.belongsTo(User,  { foreignKey: 'userId',   as: 'user' });
Recipe.hasMany(Like,  { foreignKey: 'recipeId', as: 'likes',            onDelete: 'CASCADE' });
Like.belongsTo(Recipe,{ foreignKey: 'recipeId', as: 'recipe' });

// Comment ↔ User / Recipe
User.hasMany(Comment,    { foreignKey: 'userId',   as: 'comments',      onDelete: 'CASCADE' });
Comment.belongsTo(User,  { foreignKey: 'userId',   as: 'author' });
Recipe.hasMany(Comment,  { foreignKey: 'recipeId', as: 'comments',      onDelete: 'CASCADE' });
Comment.belongsTo(Recipe,{ foreignKey: 'recipeId', as: 'recipe' });

module.exports = { User, Recipe, Like, Comment };
