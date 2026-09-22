const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Recipe = sequelize.define('Recipe',
  {
    id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId:       { type: DataTypes.INTEGER, allowNull: false },
    title:        { type: DataTypes.STRING(150), allowNull: false },
    description:  { type: DataTypes.TEXT, allowNull: true },
    ingredients:  { type: DataTypes.TEXT, allowNull: false },
    instructions: { type: DataTypes.TEXT, allowNull: false },
    category:     { type: DataTypes.STRING(80), allowNull: false },
    prepTime:     { type: DataTypes.INTEGER, allowNull: true, comment: 'Tempo de preparo em minutos' },
    servings:     { type: DataTypes.INTEGER, allowNull: true, comment: 'Número de porções' },
    image:        { type: DataTypes.STRING, allowNull: true },
    likesCount:   { type: DataTypes.INTEGER, defaultValue: 0 },
    isBlocked:    { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  {
    timestamps: true,
    tableName: 'recipes',
    indexes: [
      { fields: ['user_id'], name: 'idx_recipes_user_id' },
      { fields: ['category'], name: 'idx_recipes_category' }
    ]
  }
);

module.exports = Recipe;
