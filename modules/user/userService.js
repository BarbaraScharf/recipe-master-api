const User = require('./userModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../config/jwt');

async function registerUser(username, email, password, fullName) {
  const emailExists = await User.findOne({ where: { email } });
  const usernameExists = await User.findOne({ where: { username } });

  if (emailExists || usernameExists) {
    throw new Error('Este e-mail ou usuário já está cadastrado.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    fullName
  });

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email
  };
}

async function loginUser(email, password) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('Credenciais inválidas.');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error('Credenciais inválidas.');
  }

  if (user.isBlocked) {
    throw new Error('Esta conta foi bloqueada.');
  }

  const token = generateToken({
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      isAdmin: user.isAdmin
    }
  };
}

async function getUserProfile(userId) {
  const user = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'username', 'email', 'fullName', 'bio', 'profilePicture', 'followersCount', 'followingCount', 'recipesCount', 'isAdmin']
  });

  if (!user) {
    const error = new Error('Usuário não encontrado.');
    error.status = 404;
    throw error;
  }

  return user;
}

async function getPublicProfile(username) {
  const user = await User.findOne({
    where: { username },
    attributes: ['id', 'username', 'fullName', 'bio', 'profilePicture', 'followersCount', 'followingCount', 'recipesCount']
  });

  if (!user) {
    const error = new Error('Usuário não encontrado.');
    error.status = 404;
    throw error;
  }

  return user;
}

module.exports = { registerUser, loginUser, getUserProfile, getPublicProfile };
