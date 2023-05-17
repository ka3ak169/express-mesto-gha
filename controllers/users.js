const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }))
};

const getUsersById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if(!user) {
        return res.status(404).send({ message: 'Пользователь с таким id не найден' })
      } else {
        res.send(user)
      }
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }))
};

const postUsers = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(400).send({ message: 'Переданы некорректные данные пользователя' }));
};

const updateUsersProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false // если пользователь не найден, он будет создан
    },
  )
    .then(user => res.send({ data: user }))
    .catch(err => res.status(400).send({ message: 'Переданы некорректные данные обновления профиля' }));
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
    .then(avatar => res.send({ data: avatar }))
    .catch(err => res.status(400).send({ message: 'Переданы некорректные данные обновления аватара' }));
};

module.exports = {
  getUsers,
  getUsersById,
  postUsers,
  updateUsersProfile,
  updateUsersAvatar,
};
