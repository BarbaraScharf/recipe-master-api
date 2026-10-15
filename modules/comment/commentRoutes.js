const express = require('express');
const router  = express.Router();

const commentController            = require('./commentController');
const { createCommentValidator }   = require('./commentValidator');
const asyncHandler                 = require('../../middlewares/asyncHandler');
const { isAuthenticated }          = require('../../middlewares/auth');

// POST /api/recipes/:recipeId/comments — autenticado + validado
router.post('/recipes/:recipeId/comments', isAuthenticated, createCommentValidator, asyncHandler(commentController.addComment));

// GET /api/recipes/:recipeId/comments — público
router.get('/recipes/:recipeId/comments', asyncHandler(commentController.getComments));

module.exports = router;
