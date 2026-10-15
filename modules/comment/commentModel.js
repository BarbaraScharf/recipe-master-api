const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Comment = sequelize.define('Comment',
  {
    id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId:   { type: DataTypes.INTEGER, allowNull: false },
    recipeId: { type: DataTypes.INTEGER, allowNull: false },
    content:  { type: DataTypes.TEXT, allowNull: false }
  },
  {
    timestamps: true,
    tableName: 'comments',
    indexes: [
      { fields: ['recipe_id'], name: 'idx_comments_recipe_id' },
      { fields: ['user_id'],   name: 'idx_comments_user_id'   }
    ]
  }
);

module.exports = Comment;
