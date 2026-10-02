const express = require('express');
const router = express.Router();
const userController = require('./userController');
const { registerValidator, loginValidator, profileUpdateValidator } = require('./userValidator');
const asyncHandler = require('../../middlewares/asyncHandler');
const { isAuthenticated } = require('../../middlewares/auth');
const upload = require('../../middlewares/profileMulter');

router.post('/register', registerValidator, asyncHandler(userController.register));
router.post('/login', loginValidator, asyncHandler(userController.login));
router.post('/logout', isAuthenticated, userController.logout);

// /profile/me ANTES de /profile/:username — ordem importa
router.get('/profile/me', isAuthenticated, asyncHandler(userController.getMyProfile));
router.put('/profile/me', isAuthenticated, upload.single('profilePicture'), profileUpdateValidator, asyncHandler(userController.updateProfile));
router.get('/profile/:username', asyncHandler(userController.getPublicProfile));

// Feed — visão do usuário logado, paginada
router.get('/feed', isAuthenticated, asyncHandler(userController.getFeed));

module.exports = router;
