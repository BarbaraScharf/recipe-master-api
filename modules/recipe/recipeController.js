const recipeService = require('./recipeService');
const { success } = require('../../middlewares/apiResponse');

// POST /api/recipes
exports.create = async (req, res) => {
  const imageFilename = req.file ? req.file.filename : null;
  const recipe = await recipeService.createRecipe(req.user.id, req.body, imageFilename);
  return success(res, recipe, 'Receita publicada com sucesso!', 201);
};
