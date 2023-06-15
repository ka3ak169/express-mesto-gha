const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRouter = require('./routers/users');
const cardRouter = require('./routers/cards');

const {
  login,
  createUser,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();
// Обработка JSON-данных
app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.json());

// Обработка URL-кодированных данных
app.use(express.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

// Подключение к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(userRouter);
app.use(cardRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
