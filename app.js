const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const errorMiddleware = require('./middlewares/errorMiddleware');
require('dotenv').config();
const userRouter = require('./routers/users');
const cardRouter = require('./routers/cards');

// const { errors } = require('celebrate');

const {
  login,
  createUser,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();
// Обработка JSON-данных
app.use(express.json());

app.use(cookieParser());

// Обработка URL-кодированных данных
app.use(express.urlencoded({ extended: true }));

const validationSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^[A-Za-z0-9\-._~:/?#[\]@$&'()*+,;=%]+$/).uri({ allowRelative: true }),
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

// app.use((req, res, next) => {
//   res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });

//   next();
// });

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  if (err && err.isJoi) {
    console.log('Ошибка валидации:', err.details);

    const {
      // eslint-disable-next-line no-unused-vars
      statusCode, error, message, validation,
    } = err;

    res.status(400).json({ error: 'Ошибка валидации', details: err.details });
  } else {
    // Передаем остальные ошибки в errorMiddleware
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
