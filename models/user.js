const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => Joi.string().uri().validate(value).error === undefined,
      message: 'Некорректный формат ссылки на аватар',
    },
  },
  email: {
    type: String,
    required: [true, 'Email обязателен для заполнения'],
    unique: true,
    validate: {
      validator: (value) => Joi.string().email().validate(value).error === undefined,
      message: 'Некорректный формат email',
    },
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен для заполнения'],
    minlength: 6,
    select: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
