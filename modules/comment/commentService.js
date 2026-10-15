const sequelize = require('../../config/database');
const Comment = require('./commentModel');
const Recipe  = require('../recipe/recipeModel');
const User    = require('../user/userModel');

/**
 * addComment — cria um comentário e incrementa commentsCount na receita.
 * Usa transação para garantir consistência entre a linha e o contador.
 * Retorna o comentário com o autor populado.
 */
async function addComment(userId, recipeId, content) {
  const recipe = await Recipe.findOne({ where: { id: recipeId, isBlocked: false } });
  if (!recipe) {
    const err = new Error('Receita não encontrada.');
    err.status = 404;
    throw err;
  }

  const t = await sequelize.transaction();
  try {
    const comment = await Comment.create({ userId, recipeId, content }, { transaction: t });
    await Recipe.increment('commentsCount', { where: { id: recipeId }, transaction: t });
    await t.commit();

    // Recarrega o comentário com o autor para devolver completo
    const full = await Comment.findOne({
      where: { id: comment.id },
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'fullName', 'profilePicture'] }]
    });
    return full;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * getComments — lista comentários de uma receita, do mais novo para o mais antigo.
 */
async function getComments(recipeId) {
  const recipe = await Recipe.findOne({ where: { id: recipeId, isBlocked: false } });
  if (!recipe) {
    const err = new Error('Receita não encontrada.');
    err.status = 404;
    throw err;
  }

  const comments = await Comment.findAll({
    where: { recipeId },
    include: [{ model: User, as: 'author', attributes: ['id', 'username', 'fullName', 'profilePicture'] }],
    order: [['createdAt', 'DESC']]
  });

  return comments;
}

module.exports = { addComment, getComments };
