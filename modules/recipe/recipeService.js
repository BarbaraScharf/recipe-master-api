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

  // Incrementa o contador de receitas do usuário
  await User.increment('recipesCount', { where: { id: userId } });

  return recipe;
}

module.exports = { createRecipe };
