const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя обязательно для заполнения'],
    minlength: [2, 'Минимальная длина имени - 2 символа'],
    maxlength: [30, 'Максимальная длина имени - 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'Информация о пользователе обязательна для заполнения'],
    minlength: [2, 'Минимальная длина информации о пользователе - 2 символа'],
    maxlength: [30, 'Максимальная длина информации о пользователе - 30 символов'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Некорректный формат ссылки на аватар',
    },
  },
  email: {
    type: String,
    required: [true, 'Email обязателен для заполнения'],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Некорректный формат email',
    },
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен для заполнения'],
    minlength: [6, 'Минимальная длина пароля - 6 символов'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
