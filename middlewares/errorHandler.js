const errorHandler = (err, req, res, next) => {
  console.error(err); // Логируем ошибку для отладки

  // Определяем статус и сообщение в зависимости от ошибки
  let statusCode = 500;
  let message = 'На сервере произошла ошибка';

  if (err.statusCode) {
    // Если у ошибки уже есть статус, используем его
    statusCode = err.statusCode;
    message = err.message;
  }

  // Отправляем ответ с соответствующим статусом и сообщением об ошибке
  res.status(statusCode).json({ message });
};

module.exports = errorHandler;