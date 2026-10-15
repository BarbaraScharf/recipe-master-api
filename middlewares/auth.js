const { verifyToken } = require('../config/jwt');

function isAuthenticated(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token não fornecido.',
      errors: []
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado.',
      errors: []
    });
  }
}

module.exports = { isAuthenticated };
