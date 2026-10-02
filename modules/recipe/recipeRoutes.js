const express = require('express');
const router  = express.Router();

const recipeController          = require('./recipeController');
const { createRecipeValidator } = require('./recipeValidator');
const asyncHandler              = require('../../middlewares/asyncHandler');
const { isAuthenticated }       = require('../../middlewares/auth');
const { optionalAuth }          = require('../../middlewares/optionalAuth');
const upload                    = require('../../middlewares/recipeMulter');

// POST /api/recipes — auth → multer → validator → controller
router.post(
  '/recipes',
  isAuthenticated,
  upload.single('image'),
  createRecipeValidator,
  asyncHandler(recipeController.create)
);

// GET /api/recipes/:id — pública, tenta identificar o usuário (optionalAuth)
router.get(
  '/recipes/:id',
  optionalAuth,
  asyncHandler(recipeController.getById)
);

// GET /api/feed movido para userRoutes (feed é visão do usuário logado)

module.exports = router;
