// errorMiddleware.js

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.log('345');
  console.log(err);
  // Определение текста и статуса для различных типов ошибок
  const errorMessages = {
    BadRequestError: { status: 400, message: 'Некорректный запрос' },
    UnauthorizedError: { status: 401, message: 'Необходима авторизация' },
    ForbiddenError: { status: 403, message: 'Доступ запрещен' },
    NotFoundError: { status: 404, message: 'Ресурс не найден' },
    ConflictError: { status: 409, message: 'Конфликт данных' },
  };

  // Получение информации об ошибке
  const { name } = err;

  if (name in errorMessages) {
    const { status, message } = errorMessages[name];
    res.status(status).json({ message });
  } else {
    console.log(err);
    // Если для ошибки нет определенного текста и статуса
    res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = errorHandler;
