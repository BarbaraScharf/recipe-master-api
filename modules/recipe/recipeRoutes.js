const express = require('express');
const router  = express.Router();

const recipeController   = require('./recipeController');
const { createRecipeValidator } = require('./recipeValidator');
const asyncHandler       = require('../../middlewares/asyncHandler');
const { isAuthenticated } = require('../../middlewares/auth');
const upload             = require('../../middlewares/recipeMulter');

// Ordem obrigatória: auth → multer → validator → controller
router.post(
  '/recipes',
  isAuthenticated,
  upload.single('image'),
  createRecipeValidator,
  asyncHandler(recipeController.create)
);

module.exports = router;
