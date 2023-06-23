/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/UnauthorizedError');

require('dotenv').config();

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  // Извлечение токена
  const token = authorization.replace('Bearer ', '');

  try {
    // const payload = jwt.verify(token, process.env.JWT_SECRET);
    const payload = jwt.verify(token, 'super_secret_key');
    req.user = payload; // Записываем пейлоуд в объект запроса
    next();
  } catch (error) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
};
