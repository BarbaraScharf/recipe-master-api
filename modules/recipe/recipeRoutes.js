const express = require('express');
const router  = express.Router();

const recipeController                                    = require('./recipeController');
const { createRecipeValidator, updateRecipeValidator }    = require('./recipeValidator');
const asyncHandler                                        = require('../../middlewares/asyncHandler');
const { isAuthenticated }                                 = require('../../middlewares/auth');
const { optionalAuth }                                    = require('../../middlewares/optionalAuth');
const upload                                              = require('../../middlewares/recipeMulter');

// POST /api/recipes — auth → multer → validator → controller
router.post(
  '/recipes',
  isAuthenticated,
  upload.single('image'),
  createRecipeValidator,
  asyncHandler(recipeController.create)
);

// GET /api/my-recipes — receitas do usuário logado
router.get(
  '/my-recipes',
  isAuthenticated,
  asyncHandler(recipeController.getMyRecipes)
);

// GET /api/recipes/:id/edit — dados para pré-preencher o formulário (só o dono)
// Deve vir ANTES de GET /api/recipes/:id para o Express não interpretar "edit" como um id
router.get(
  '/recipes/:id/edit',
  isAuthenticated,
  asyncHandler(recipeController.getRecipeForEdit)
);

// GET /api/recipes/:id — pública, tenta identificar o usuário (optionalAuth)
router.get(
  '/recipes/:id',
  optionalAuth,
  asyncHandler(recipeController.getById)
);

// PUT /api/recipes/:id — auth → multer → validator → controller
router.put(
  '/recipes/:id',
  isAuthenticated,
  upload.single('image'),
  updateRecipeValidator,
  asyncHandler(recipeController.updateRecipe)
);

// DELETE /api/recipes/:id
router.delete(
  '/recipes/:id',
  isAuthenticated,
  asyncHandler(recipeController.deleteRecipe)
);

module.exports = router;
