const commentService = require('./commentService');
const { success } = require('../../middlewares/apiResponse');

// POST /api/recipes/:recipeId/comments
exports.addComment = async (req, res) => {
  const comment = await commentService.addComment(
    req.user.id,
    parseInt(req.params.recipeId),
    req.body.content
  );
  return success(res, comment, 'Comentário adicionado.', 201);
};

// GET /api/recipes/:recipeId/comments
exports.getComments = async (req, res) => {
  const comments = await commentService.getComments(parseInt(req.params.recipeId));
  return success(res, { comments });
};
