const jwt = require('jsonwebtoken');

const authPayload = (req, res, next) => {
  // Получение токена из заголовков запроса
  const token = req.headers.authorization;

  // Проверка наличия токена
  if (!token) {
    return res.status(401).send({ message: 'Требуется токен авторизации' });
  }

  try {
    // Верификация токена и извлечение пейлоада
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Добавление пейлоада токена в объект запроса
    req.user = payload;

    // Вызов следующего обработчика
    next();
  } catch (error) {
    // Обработка ошибки верификации токена
    return res.status(401).send({ message: 'Неверный токен авторизации' });
  }
};

module.exports = authPayload;