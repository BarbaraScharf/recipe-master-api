const express = require('express');
const router = express.Router();
const userController = require('./userController');
const { registerValidator, loginValidator, profileUpdateValidator } = require('./userValidator');
const asyncHandler = require('../../middlewares/asyncHandler');
const { isAuthenticated } = require('../../middlewares/auth');
const { optionalAuth }    = require('../../middlewares/optionalAuth');
const upload = require('../../middlewares/profileMulter');

router.post('/register', registerValidator, asyncHandler(userController.register));
router.post('/login', loginValidator, asyncHandler(userController.login));
router.post('/logout', isAuthenticated, userController.logout);

// /profile/me ANTES de /profile/:username — ordem importa
router.get('/profile/me', isAuthenticated, asyncHandler(userController.getMyProfile));
router.put('/profile/me', isAuthenticated, upload.single('profilePicture'), profileUpdateValidator, asyncHandler(userController.updateProfile));

// /profile/:username com optionalAuth — popula req.user para calcular isOwner
router.get('/profile/:username', optionalAuth, asyncHandler(userController.getPublicProfile));

// Feed — visão do usuário logado, paginada
router.get('/feed', isAuthenticated, asyncHandler(userController.getFeed));

module.exports = router;
