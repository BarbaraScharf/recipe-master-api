const sequelize = require('../../config/database');
const Like   = require('./likeModel');
const Recipe = require('../recipe/recipeModel');

/**
 * toggleLike — curte ou descurte uma receita.
 * Usa transação para garantir que a linha e o contador são sempre consistentes.
 * Retorna { liked, likesCount }.
 */
async function toggleLike(userId, recipeId) {
  const recipe = await Recipe.findOne({ where: { id: recipeId, isBlocked: false } });
  if (!recipe) {
    const err = new Error('Receita não encontrada.');
    err.status = 404;
    throw err;
  }

  const t = await sequelize.transaction();
  try {
    const existing = await Like.findOne({ where: { userId, recipeId }, transaction: t });

    let liked;
    if (existing) {
      // Descurtir
      await existing.destroy({ transaction: t });
      await Recipe.decrement('likesCount', { where: { id: recipeId }, transaction: t });
      liked = false;
    } else {
      // Curtir
      await Like.create({ userId, recipeId }, { transaction: t });
      await Recipe.increment('likesCount', { where: { id: recipeId }, transaction: t });
      liked = true;
    }

    await t.commit();
    await recipe.reload();
    return { liked, likesCount: recipe.likesCount };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * getLikeStatus — verifica se um usuário curtiu uma receita.
 */
async function getLikeStatus(userId, recipeId) {
  const recipe = await Recipe.findOne({ where: { id: recipeId, isBlocked: false } });
  if (!recipe) {
    const err = new Error('Receita não encontrada.');
    err.status = 404;
    throw err;
  }
  const like = await Like.findOne({ where: { userId, recipeId } });
  return { liked: !!like, likesCount: recipe.likesCount };
}

/**
 * getLikedRecipes — lista todas as receitas curtidas pelo usuário, com autor.
 */
async function getLikedRecipes(userId) {
  const User = require('../user/userModel');

  const likes = await Like.findAll({
    where: { userId },
    include: [{
      model: Recipe,
      as: 'recipe',
      where: { isBlocked: false },
      required: true,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'fullName', 'profilePicture']
      }]
    }],
    order: [['createdAt', 'DESC']]
  });

  return likes.map(l => l.recipe);
}

module.exports = { toggleLike, getLikeStatus, getLikedRecipes };
