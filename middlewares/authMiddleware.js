const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/constants');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(UNAUTHORIZED).send({ message: 'Недействительный авторизационный токен' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next();
};
