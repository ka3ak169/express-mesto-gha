/* eslint-disable consistent-return */
/* eslint-disable max-len */
const { allowedCors } = require('../utils/constants');

const corsMiddleware = (req, res, next) => {
  try {
    const { origin } = req.headers; // Сохраняем источник запроса в переменную origin

    if (allowedCors.includes(origin)) {
      // Устанавливаем заголовок, который разрешает браузеру запросы с этого источника
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      // Если источник запроса не найден среди разрешенных, пропускаем обработку запроса дальше без изменений заголовка ответа
      res.header('Access-Control-Allow-Origin', '');
    }

    const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

    const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

    if (method === 'OPTIONS') {
      // Если это предварительный запрос, добавляем нужные заголовки

      // Устанавливаем заголовок, который разрешает браузеру запросы любых типов (по умолчанию)
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);

      const requestHeaders = req.headers['access-control-request-headers'];

      // Разрешаем кросс-доменные запросы с этими заголовками
      res.header('Access-Control-Allow-Headers', requestHeaders);

      // Завершаем обработку запроса и возвращаем результат клиенту
      return res.end();
    }

    // Если не предварительный запрос, передаем управление следующей middleware
    next();
  } catch (error) {
    // Передаем ошибку дальше
    next(error);
  }
};

module.exports = corsMiddleware;
