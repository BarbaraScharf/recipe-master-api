const userService = require('./userService');
const { success } = require('../../middlewares/apiResponse');

exports.register = async (req, res) => {
  const { username, email, password, fullName } = req.body;
  const newUser = await userService.registerUser(username, email, password, fullName);
  return success(res, newUser, 'Conta criada com sucesso! Faça login para continuar.', 201);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.loginUser(email, password);
  return success(res, result, 'Login realizado com sucesso.');
};

exports.logout = (req, res) => {
  return success(res, null, 'Logout realizado com sucesso.');
};

exports.getMyProfile = async (req, res) => {
  const user = await userService.getUserProfile(req.user.id);
  return success(res, user);
};

exports.updateProfile = async (req, res) => {
  const { fullName, bio } = req.body;
  const newProfilePicture = req.file ? req.file.filename : undefined;
  const updated = await userService.updateUserProfile(req.user.id, { fullName, bio, newProfilePicture });
  return success(res, updated, 'Perfil atualizado com sucesso.');
};

exports.getPublicProfile = async (req, res) => {
  const user = await userService.getPublicProfile(req.params.username);
  return success(res, user);
};

// GET /api/feed — feed paginado (visão do usuário logado)
exports.getFeed = async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await userService.getFeed(page, limit);
  return success(res, result);
};
