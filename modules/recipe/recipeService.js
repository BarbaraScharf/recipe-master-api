const { Op } = require('sequelize');
const Recipe = require('./recipeModel');
const User   = require('../user/userModel');

/**
 * Cria uma nova receita e incrementa o recipesCount do usuário.
 */
async function createRecipe(userId, data, imageFilename) {
  const recipe = await Recipe.create({
    userId,
    title:        data.title,
    description:  data.description  || null,
    ingredients:  data.ingredients,
    instructions: data.instructions,
    category:     data.category,
    prepTime:     data.prepTime  || null,
    servings:     data.servings  || null,
    image:        imageFilename  || null
  });

  await User.increment('recipesCount', { where: { id: userId } });
  return recipe;
}

/**
 * Busca uma receita pelo id, popula o autor (sem senha),
 * incrementa viewsCount e informa se quem está pedindo é o dono.
 */
async function getRecipeById(recipeId, requestingUserId) {
  const recipe = await Recipe.findOne({
    where: { id: recipeId, isBlocked: false },
    include: [{
      model: User,
      as: 'author',
      attributes: ['id', 'username', 'fullName', 'profilePicture']
    }]
  });

  if (!recipe) {
    const err = new Error('Receita não encontrada.');
    err.status = 404;
    throw err;
  }

  // Incrementa visualizações
  await recipe.increment('viewsCount');
  await recipe.reload();

  const isOwner = requestingUserId ? recipe.userId === requestingUserId : false;

  return { recipe, isOwner };
}

module.exports = { createRecipe, getRecipeById };
