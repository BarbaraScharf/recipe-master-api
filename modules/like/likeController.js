const likeService = require('./likeService');
const { success } = require('../../middlewares/apiResponse');

// POST /api/recipes/:recipeId/toggle-like
exports.toggleLike = async (req, res) => {
  const result = await likeService.toggleLike(req.user.id, parseInt(req.params.recipeId));
  return success(res, result, result.liked ? 'Curtida adicionada.' : 'Curtida removida.', result.liked ? 201 : 200);
};

// GET /api/recipes/:recipeId/like-status
exports.getLikeStatus = async (req, res) => {
  const userId = req.user ? req.user.id : null;
  if (!userId) return success(res, { liked: false });
  const result = await likeService.getLikeStatus(userId, parseInt(req.params.recipeId));
  return success(res, result);
};

// GET /api/liked-recipes
exports.getLikedRecipes = async (req, res) => {
  const recipes = await likeService.getLikedRecipes(req.user.id);
  return success(res, { recipes });
};
