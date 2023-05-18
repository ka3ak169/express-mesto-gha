const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routers/users');
const cardRouter = require('./routers/cards');

const { PORT = 3000 } = process.env;

const app = express();
// Обработка JSON-данных
app.use(express.json());

// Обработка URL-кодированных данных
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '645c33230c414a5e03df7f5e',
  };

  next();
});

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
  // console.log(`App listening on port ${PORT}`);
  console.log('started!!!');
});
