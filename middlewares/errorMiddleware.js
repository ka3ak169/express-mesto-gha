/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
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
    res.status(status).send({ message });
  } else if (err.code === 11000) {
    // Обработка ошибки дублирования email
    res.status(409).send({ message: 'Пользователь с таким email уже существует' });
  } else {
    console.log(err);
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = errorHandler;
