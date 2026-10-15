const recipeService = require('./recipeService');
const { success }   = require('../../middlewares/apiResponse');

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
  const { recipe, isOwner, isLiked } = await recipeService.getRecipeById(recipeId, requestingUser);
  return success(res, { ...recipe.toJSON(), isOwner, isLiked });
};

// GET /api/my-recipes — receitas do usuário logado
exports.getMyRecipes = async (req, res) => {
  const recipes = await recipeService.getMyRecipes(req.user.id);
  return success(res, { recipes });
};

// GET /api/recipes/:id/edit — dados para pré-preencher o formulário (só o dono)
exports.getRecipeForEdit = async (req, res) => {
  const recipe = await recipeService.getRecipeForEdit(parseInt(req.params.id), req.user.id);
  return success(res, recipe);
};

// PUT /api/recipes/:id — edita título/descrição e troca imagem opcionalmente
exports.updateRecipe = async (req, res) => {
  const newImageFilename = req.file ? req.file.filename : null;
  const recipe = await recipeService.updateRecipe(
    parseInt(req.params.id),
    req.user.id,
    req.body,
    newImageFilename
  );
  return success(res, recipe, 'Receita atualizada com sucesso.');
};

// DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res) => {
  await recipeService.deleteRecipe(parseInt(req.params.id), req.user.id);
  return success(res, null, 'Receita excluída com sucesso.');
};
