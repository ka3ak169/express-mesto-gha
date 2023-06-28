/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { NotFoundError } = require('./utils/NotFoundError');
require('dotenv').config();
const userRouter = require('./routers/users');
const cardRouter = require('./routers/cards');
const { regAvatar } = require('./utils/constants');
const corsMiddleware = require('./middlewares/corsMiddleware');

const {
  login,
  createUser,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(corsMiddleware);

// Обработка JSON-данных
app.use(express.json());

app.use(cookieParser());

// Обработка URL-кодированных данных
app.use(express.urlencoded({ extended: true }));

const validationSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regAvatar).uri({ allowRelative: true }),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

app.post('/signin', celebrate(validationSchema), login);
app.post('/signup', celebrate(validationSchema), createUser);

// Подключение к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(userRouter);
app.use(cardRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
