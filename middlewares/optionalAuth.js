/**
 * optionalAuth.js
 *
 * Diferença em relação ao isAuthenticated:
 *   - isAuthenticated: bloqueia a requisição com 401 se não houver token válido.
 *   - optionalAuth: tenta identificar o usuário, mas NUNCA bloqueia.
 *     Se o token for válido → req.user é populado (igual ao isAuthenticated).
 *     Se não houver token ou ele for inválido → req.user = null, execução continua.
 *
 * Usado nas rotas públicas que precisam saber quem está pedindo (ex.: para
 * calcular isOwner no detalhe da receita), mas que não podem bloquear visitantes.
 */
const { verifyToken } = require('../config/jwt');

function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = verifyToken(token);
  } catch (_) {
    req.user = null;
  }

  return next();
}

module.exports = { optionalAuth };
