const recipeService = require('./recipeService');
const { success } = require('../../middlewares/apiResponse');

// POST /api/recipes
exports.create = async (req, res) => {
  const imageFilename = req.file ? req.file.filename : null;
  const recipe = await recipeService.createRecipe(req.user.id, req.body, imageFilename);
  return success(res, recipe, 'Receita publicada com sucesso!', 201);
};

// GET /api/recipes/:id — pública (optionalAuth)
exports.getById = async (req, res) => {
  const recipeId       = parseInt(req.params.id);
  const requestingUser = req.user ? req.user.id : null;
  const { recipe, isOwner } = await recipeService.getRecipeById(recipeId, requestingUser);
  return success(res, { ...recipe.toJSON(), isOwner });
};
