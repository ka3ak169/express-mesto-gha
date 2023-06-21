/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  UNAUTHORIZED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR,
} = require('../utils/constants');
const getGwtToken = require('../utils/jwt');

const SALT_ROUNDS = 10;
require('dotenv').config();

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error('Неправильные почта или пароль');
    error.statusCode = UNAUTHORIZED;
    throw error;
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        const error = new Error('Неправильные почта или пароль');
        error.statusCode = UNAUTHORIZED;
        next(error);
        return;
      }

      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            const error = new Error('Неправильные почта или пароль');
            error.statusCode = UNAUTHORIZED;
            next(error);
            return;
          }
          console.log(user);
          req.user = user;
          console.log(req.user);

          const id = user.id.toString();
          console.log(id);
          const token = getGwtToken(id);
          console.log(token);

          // res.cookie('jwt', token, {
          //   httpOnly: true,
          //   secure: true,
          //   sameSite: 'none',
          // }).send({ message: 'Успешная авторизация', user: req.user, token });
          res.send({ message: 'Успешная авторизация' });
        })
        .catch((error) => {
          error.message = 'Перданы1';
          error.statusCode = NOT_FOUND;
          next(error);
        });
    })
    .catch((error) => {
      error.message = 'Перданы2';
      error.statusCode = BAD_REQUEST;
      next(error);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      error.statusCode = INTERNAL_SERVER_ERROR;
      next(error);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error();
        error.statusCode = 404;
        throw error;
      }

      req.user = user;
      next();
    })
    .catch(next);
};

const getUserInformation = (req, res, next) => {
  const userId = req.user.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('Пользователь не найден');
        error.statusCode = NOT_FOUND;
        throw error;
      }
      res.send({ data: user }); // Отправляем ответ
    })
    .catch((error) => {
      error.statusCode = INTERNAL_SERVER_ERROR;
      next(error);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    if (err) {
      next(err);
      return;
    }

    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        const { password, ...userData } = user.toObject();
        res.status(200).send({ user: userData });
      })
      .catch((error) => {
        if (error.code === 11000) {
          error.message = 'Пользователь с таким email уже существует';
          error.name = 'ConflictError';
          error.statusCode = 409;
        } else if (error.name === 'ValidationError') {
          error.message = 'Переданы некорректные данные пользователя';
          error.statusCode = 400;
        }
        next(error);
      });
  });
};

const updateUsersProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user.id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        error.statusCode = BAD_REQUEST;
        error.message = 'Переданы некорректные данные обновления профиля';
      } else {
        error.statusCode = INTERNAL_SERVER_ERROR;
        error.message = 'Произошла ошибка';
      }
      next(error);
    });
};

const updateUsersAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user.id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        const error = new Error('Пользователь не найден');
        error.statusCode = NOT_FOUND;
        throw error;
      }
      res.status(200).send({ avatar: user.avatar });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        error.statusCode = BAD_REQUEST;
        error.message = 'Переданы некорректные данные обновления аватара';
      } else {
        error.statusCode = INTERNAL_SERVER_ERROR;
        error.message = 'Произошла ошибка';
      }
      next(error);
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
