const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  UNAUTHORIZED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR,
} = require('../utils/constants');
const { getGwtToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const login = (req, res, next) => {
  const { email, password } = req.body;

  // Проверка наличия email и пароля в запросе
  if (!email || !password) {
    return next({ status: UNAUTHORIZED, message: 'Неправильные почта или пароль' });
  }

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next({ status: UNAUTHORIZED, message: 'Неправильные почта или пароль' });
      }

      // Проверка совпадения пароля
      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return next({ status: UNAUTHORIZED, message: 'Неправильные почта или пароль' });
          }

          // Добавление данных пользователя в req
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
        .catch(() => next({ status: INTERNAL_SERVER_ERROR, message: 'Произошла ошибка' }));
    })
    .catch(() => next({ status: INTERNAL_SERVER_ERROR, message: 'Произошла ошибка' }));
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next({ status: INTERNAL_SERVER_ERROR, message: 'Произошла ошибка' }));
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next({ status: NOT_FOUND, message: 'Пользователь с таким id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next({ status: BAD_REQUEST, message: 'Некорректный формат ID пользователя' });
      }
      return next({ status: INTERNAL_SERVER_ERROR, message: 'Произошла ошибка' });
    });
};

const getUserInformation = (req, res, next) => {
  const userId = req.user.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next({ status: NOT_FOUND, message: 'Пользователь не найден' });
      }

      return res.send({ data: user });
    })
    .catch((err) => next({ status: INTERNAL_SERVER_ERROR, message: 'Произошла ошибка', error: err }));
};

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    // Проверка наличия и валидация email и password
    if (!email || !password) {
      throw { status: BAD_REQUEST, message: 'Email и пароль должны быть указаны' };
    }

    // Валидация пароля
    if (password.length < 6) {
      throw { status: BAD_REQUEST, message: 'Минимальная длина пароля - 6 символов' };
    }

    // Поиск пользователя по email
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      throw { status: BAD_REQUEST, message: 'Пользователь с таким email уже существует' };
    }

    // Хэширование пароля
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Создание пользователя
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    const userData = { ...newUser._doc, password: undefined };
    return res.status(200).send({ data: userData });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next({ status: BAD_REQUEST, message: 'Переданы некорректные данные пользователя' });
    } else {
      next({ status: INTERNAL_SERVER_ERROR, message: 'Произошла ошибка' });
    }
  }
};

const updateUsersProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next({ status: BAD_REQUEST, message: 'Переданы некорректные данные обновления профиля' });
      } else {
        next({ status: INTERNAL_SERVER_ERROR, message: 'Произошла ошибка' });
      }
    });
};

const updateUsersAvatar = (req, res, next) => {
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
        return next({ status: NOT_FOUND, message: 'Пользователь не найден' });
      }
      return res.status(200).send({ avatar: user.avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next({ status: BAD_REQUEST, message: 'Переданы некорректные данные обновления аватара' });
      }
      return next({ status: INTERNAL_SERVER_ERROR, message: 'Произошла ошибка' });
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
