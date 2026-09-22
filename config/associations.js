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
const User   = require('../modules/user/userModel');
const Recipe = require('../modules/recipe/recipeModel');

// Um usuário pode ter muitas receitas; cada receita pertence a um usuário.
User.hasMany(Recipe,   { foreignKey: 'userId', as: 'recipes',     onDelete: 'CASCADE' });
Recipe.belongsTo(User, { foreignKey: 'userId', as: 'author' });

module.exports = { User, Recipe };
