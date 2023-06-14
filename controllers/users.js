const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/user');
const {
  UNAUTHORIZED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR,
} = require('../utils/constants');
const { getGwtToken } = require('../utils/jwt');

const SALT_ROUNRDS = 10;
require('dotenv').config();

const login = (req, res) => {
  const { email, password } = req.body;

  // Проверка наличия email и пароля в запросе
  if (!email || !password) {
    return res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
  }

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
      }

      // Проверка совпадения пароля
      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
          }

          // // Добавление данных пользователя в req
          req.user = user;

          const id = user._id.toString();
          // Создание JWT токена
          const token = getGwtToken(id);

          // Отправка токена и ID пользователя клиенту
          return res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          }).send({ message: 'Успешная авторизация', user: req.user, token });
        })
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с таким id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный формат ID пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const getUserInformation = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }

      return res.send({ data: user }); // Отправляем ответ
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', error: err }));
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  // Валидация email
  if (!validator.isEmail(email)) {
    return res.status(BAD_REQUEST).send({ message: 'Некорректный формат email' });
  }

  return bcrypt.hash(password, SALT_ROUNRDS, (err, hash) => {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }

    return User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(200).send({ data: user }))
      .catch((error) => {
        if (error.name === 'ValidationError') {
          res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
        } else {
          res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
        }
      });
  });
};

const updateUsersProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные обновления профиля' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateUsersAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send({ avatar: user.avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные обновления аватара' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  login,
  getUsers,
  getUserById,
  getUserInformation,
  createUser,
  updateUsersProfile,
  updateUsersAvatar,
};
