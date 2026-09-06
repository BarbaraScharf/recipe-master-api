const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

if (!secret) {
  throw new Error('JWT_SECRET não definido no .env');
}

function generateToken(payload) {
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, secret);
}

module.exports = { generateToken, verifyToken };
