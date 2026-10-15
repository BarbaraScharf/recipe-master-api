const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

/**
 * Like — representa uma curtida de um usuário numa receita.
 *
 * O índice único composto (userId + recipeId) garante que a mesma
 * pessoa não possa curtir a mesma receita duas vezes — essa restrição
 * vive no banco, não só no código, porque qualquer chamada direta à API
 * (sem passar pelo service) também seria barrada.
 */
const Like = sequelize.define('Like',
  {
    id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId:   { type: DataTypes.INTEGER, allowNull: false },
    recipeId: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    timestamps: true,
    tableName: 'likes',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'recipe_id'],
        name: 'idx_unique_like'
      }
    ]
  }
);

module.exports = Like;
