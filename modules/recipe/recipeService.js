const path = require('path');
const fs   = require('fs');

const sequelize = require('../../config/database');
const Recipe  = require('./recipeModel');
const User    = require('../user/userModel');

/**
 * Cria uma nova receita e incrementa o recipesCount do usuário.
 */
async function createRecipe(userId, data, imageFilename) {
  const recipe = await Recipe.create({
    userId,
    title:        data.title,
    description:  data.description  || null,
    ingredients:  data.ingredients,
    instructions: data.instructions,
    category:     data.category,
    prepTime:     data.prepTime  || null,
    servings:     data.servings  || null,
    image:        imageFilename  || null
  });

  await User.increment('recipesCount', { where: { id: userId } });
  return recipe;
}

/**
 * Busca uma receita pelo id, popula o autor (sem senha),
 * incrementa viewsCount, informa isOwner e isLiked.
 */
async function getRecipeById(recipeId, requestingUserId) {
  const Like = require('../like/likeModel');

  const recipe = await Recipe.findOne({
    where: { id: recipeId, isBlocked: false },
    include: [{
      model: User,
      as: 'author',
      attributes: ['id', 'username', 'fullName', 'profilePicture']
    }]
  });

  if (!recipe) {
    const err = new Error('Receita não encontrada.');
    err.status = 404;
    throw err;
  }

  // Incrementa visualizações e recarrega para retornar o valor atualizado
  await recipe.increment('viewsCount');
  await recipe.reload();

  const isOwner = requestingUserId ? recipe.userId === requestingUserId : false;

  // Verifica se o usuário já curtiu
  let isLiked = false;
  if (requestingUserId) {
    const like = await Like.findOne({ where: { userId: requestingUserId, recipeId } });
    isLiked = !!like;
  }

  return { recipe, isOwner, isLiked };
}

/**
 * Lista todas as receitas do usuário logado, da mais nova para a mais antiga.
 */
async function getMyRecipes(userId) {
  const recipes = await Recipe.findAll({
    where: { userId, isBlocked: false },
    include: [{
      model: User,
      as: 'author',
      attributes: ['id', 'username', 'fullName', 'profilePicture']
    }],
    order: [['createdAt', 'DESC']]
  });
  return recipes;
}

/**
 * Busca os dados de uma receita para pré-preencher o formulário de edição.
 * Só o dono pode acessar — 404 se não existe, 403 se não é seu.
 */
async function getRecipeForEdit(recipeId, requestingUserId) {
  const recipe = await Recipe.findOne({ where: { id: recipeId, isBlocked: false } });

  if (!recipe) {
    const err = new Error('Receita não encontrada.');
    err.status = 404;
    throw err;
  }

  if (recipe.userId !== requestingUserId) {
    const err = new Error('Você não tem permissão para editar esta receita.');
    err.status = 403;
    throw err;
  }

  return recipe;
}

/**
 * Atualiza os dados de uma receita.
 * Troca a imagem opcionalmente — apaga a antiga do disco se houver uma nova.
 * Ordem: banco primeiro, disco depois.
 */
async function updateRecipe(recipeId, requestingUserId, data, newImageFilename) {
  const recipe = await Recipe.findOne({ where: { id: recipeId, isBlocked: false } });

  if (!recipe) {
    const err = new Error('Receita não encontrada.');
    err.status = 404;
    throw err;
  }

  if (recipe.userId !== requestingUserId) {
    const err = new Error('Você não tem permissão para editar esta receita.');
    err.status = 403;
    throw err;
  }

  const oldImageFilename = recipe.image;

  // Atualiza o banco antes de mexer no disco
  await recipe.update({
    title:        data.title        !== undefined ? data.title        : recipe.title,
    description:  data.description  !== undefined ? data.description  : recipe.description,
    ingredients:  data.ingredients  !== undefined ? data.ingredients  : recipe.ingredients,
    instructions: data.instructions !== undefined ? data.instructions : recipe.instructions,
    category:     data.category     !== undefined ? data.category     : recipe.category,
    prepTime:     data.prepTime     !== undefined ? data.prepTime     : recipe.prepTime,
    servings:     data.servings     !== undefined ? data.servings     : recipe.servings,
    image:        newImageFilename || recipe.image
  });

  // Só agora apaga o arquivo antigo do disco (se foi trocado)
  if (newImageFilename && oldImageFilename) {
    const oldPath = path.join(__dirname, '../../public/uploads/recipes', oldImageFilename);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  return recipe;
}

/**
 * Exclui uma receita dentro de uma transação:
 * 1. Remove likes e comentários associados
 * 2. Remove o registro da receita
 * 3. Decrementa recipesCount do usuário
 * 4. Apaga o arquivo de imagem do disco
 */
async function deleteRecipe(recipeId, requestingUserId) {
  const Like    = require('../like/likeModel');
  const Comment = require('../comment/commentModel');

  const recipe = await Recipe.findOne({ where: { id: recipeId } });

  if (!recipe) {
    const err = new Error('Receita não encontrada.');
    err.status = 404;
    throw err;
  }

  if (recipe.userId !== requestingUserId) {
    const err = new Error('Você não tem permissão para excluir esta receita.');
    err.status = 403;
    throw err;
  }

  const imageToDelete = recipe.image;
  const ownerId       = recipe.userId;

  const t = await sequelize.transaction();
  try {
    // Remove likes e comentários antes de remover a receita
    await Like.destroy(   { where: { recipeId }, transaction: t });
    await Comment.destroy({ where: { recipeId }, transaction: t });

    // Remove a receita
    await recipe.destroy({ transaction: t });

    // Decrementa o contador do usuário
    await User.decrement('recipesCount', { where: { id: ownerId }, transaction: t });

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }

  // Apaga o arquivo do disco depois do banco confirmado
  if (imageToDelete) {
    const filePath = path.join(__dirname, '../../public/uploads/recipes', imageToDelete);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = { createRecipe, getRecipeById, getMyRecipes, getRecipeForEdit, updateRecipe, deleteRecipe };
