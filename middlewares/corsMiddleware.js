/* eslint-disable consistent-return */
/* eslint-disable max-len */
const { allowedCors } = require('../utils/constants');

const corsMiddleware = (req, res, next) => {
  try {
    const { origin } = req.headers; // Сохраняем источник запроса в переменную origin

    // Проверяем, что источник запроса есть среди разрешённых
    if (allowedCors.includes(origin)) {
      // Устанавливаем заголовок, который разрешает браузеру запросы с этого источника
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      // Если источник запроса не найден среди разрешённых, пропускаем обработку запроса дальше без изменений заголовка ответа
      res.header('Access-Control-Allow-Origin', '');
    }

    // Устанавливаем заголовки Access-Control-Allow-Methods и Access-Control-Allow-Headers
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Проверяем, является ли запрос предварительным запросом (OPTIONS)
    if (req.method === 'OPTIONS') {
      // Возвращаем ответ и завершаем обработку запроса для предварительного запроса
      return res.end();
    }

    // Передаем управление следующей middleware
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = corsMiddleware;
