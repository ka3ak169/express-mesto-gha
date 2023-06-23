/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
const bcrypt = require('bcrypt');
const User = require('../models/user');

const { BadRequestError } = require('../utils/BadRequestError');
const { NotFoundError } = require('../utils/NotFoundError');
const { UnauthorizedError } = require('../utils/UnauthorizedError');
const { ConflictError } = require('../utils/ConflictError');

const getJwtToken = require('../utils/jwt');

const SALT_ROUNDS = 10;
require('dotenv').config();

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Неправильные почта или пароль'));
        return;
      }

      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            next(new UnauthorizedError('Неправильные почта или пароль'));
            return;
          }

          req.user = user;

          const id = user._id.toString();
          const token = getJwtToken(id);

          res.send({ message: 'Успешная авторизация', token });
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      if (error.name === 'UnauthorizedError') {
        next(new UnauthorizedError('Недействительный токен'));
      } else {
        next(error);
      }
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }

      req.user = user;
      res.send({ user });
    })
    .catch((error) => next(error));
};

const getUserInformation = (req, res, next) => {
  const userId = req.user.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }

      res.send({ data: user });
    })
    .catch((error) => next(error));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    if (err) {
      next((err) => next(err));
      return;
    }

    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        const { password, ...userData } = user.toObject();
        res.send({ user: userData });
      })
      .catch((error) => {
        if (error.code === 11000) {
          const conflictError = new ConflictError('Пользователь с таким email уже существует');
          next(conflictError);
        } else if (error.name === 'ValidationError') {
          const badRequestError = new BadRequestError('Переданы некорректные данные пользователя');
          next(badRequestError);
        } else {
          next(error);
        }
      });
  });
};

const updateUsersProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user.id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные обновления профиля'));
      } else {
        next(error);
      }
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
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.status(200).send({ avatar: user.avatar });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные обновления аватара'));
      } else {
        next(error);
      }
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
