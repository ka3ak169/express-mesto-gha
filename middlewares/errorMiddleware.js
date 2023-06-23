/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

const { BadRequestError } = require('../utils/BadRequestError');
const { NotFoundError } = require('../utils/NotFoundError');
const { UnauthorizedError } = require('../utils/UnauthorizedError');
const { ConflictError } = require('../utils/ConflictError');
const { ForbiddenError } = require('../utils/ForbiddenError');

const errorMiddleware = (err, req, res, next) => {
  console.log(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'На сервере произошла ошибка';

  if (err instanceof BadRequestError) {
    statusCode = err.statusCode || statusCode;
    message = err.message || 'Некорректный запрос';
  } else if (err instanceof UnauthorizedError) {
    statusCode = err.statusCode || statusCode;
    message = err.message || 'Необходима авторизация';
  } else if (err instanceof ForbiddenError) {
    statusCode = err.statusCode || statusCode;
    message = err.message || 'Доступ запрещен';
  } else if (err instanceof NotFoundError) {
    statusCode = err.statusCode || statusCode;
    message = err.message || 'Пользователь не найден';
  } else if (err instanceof ConflictError) {
    statusCode = err.statusCode || statusCode;
    message = err.message || 'Конфликт данных';
  }

  res.status(statusCode).send({ message });
};

module.exports = errorMiddleware;
