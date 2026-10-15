const express = require('express');
const router  = express.Router();

const likeController      = require('./likeController');
const asyncHandler        = require('../../middlewares/asyncHandler');
const { isAuthenticated } = require('../../middlewares/auth');
const { optionalAuth }    = require('../../middlewares/optionalAuth');

// POST /api/recipes/:recipeId/toggle-like — autenticado
router.post('/recipes/:recipeId/toggle-like', isAuthenticated, asyncHandler(likeController.toggleLike));

// GET /api/recipes/:recipeId/like-status — opcional (visitante retorna false)
router.get('/recipes/:recipeId/like-status', optionalAuth, asyncHandler(likeController.getLikeStatus));

// GET /api/liked-recipes — autenticado
router.get('/liked-recipes', isAuthenticated, asyncHandler(likeController.getLikedRecipes));

module.exports = router;
