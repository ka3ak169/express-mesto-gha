const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  if (!userId || !isValidObjectId(userId)) {
    return res.status(400).send({ message: 'Некорректный формат ID пользователя' });
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с таким id не найден' });
      }
      res.send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const postUsers = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
  }

  if (name.length < 2 || name.length > 30) {
    return res.status(400).send({ message: 'Поле "name" должно содержать от 2 до 30 символов' });
  }

  if (about.length < 2 || about.length > 30) {
    return res.status(400).send({ message: 'Поле "about" должно содержать от 2 до 30 символов' });
  }

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
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
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные обновления профиля' }));
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
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.send({ data: user.avatar });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getUsers,
  getUserById,
  postUsers,
  updateUsersProfile,
  updateUsersAvatar,
};
