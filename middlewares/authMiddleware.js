const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/constants');
const { isAuthorized } = require('../utils/jwt');
const User = require('../models/user');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const tokenWithBearer = req.headers.authorization;
  const token = tokenWithBearer.split(' ')[1];

  const isAuth = await isAuthorized(token);
  if (!isAuth) return res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(401).send({ message: 'Пользователь не найден' });
        }
        // console.log(user);
        req.user = user;

        next();
      })
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
  } catch (error) {
    return res.status(401).send({ message: 'Недействительный авторизационный токен' });
  }
};
