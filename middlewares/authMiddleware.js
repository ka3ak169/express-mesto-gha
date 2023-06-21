/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/constants');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new Error('Необходима авторизация');
    error.statusCode = UNAUTHORIZED;
    return next(error);
  }

  // Извлечение токена
  const token = authorization.replace('Bearer ', '');

  try {
    // const payload = jwt.verify(token, process.env.JWT_SECRET);
    const payload = jwt.verify(token, 'super_secret_key');
    req.user = payload; // Записываем пейлоуд в объект запроса
    next();
  } catch (error) {
    error.statusCode = UNAUTHORIZED;
    next(error);
  }
};

