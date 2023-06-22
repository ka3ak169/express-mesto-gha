/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
// /* eslint-disable no-unused-vars */
// const errorHandler = (err, req, res, next) => {
//   console.log(err);

//   let statusCode = 500;
//   let message = 'На сервере произошла ошибка';

//   if (err.statusCode === 400) {
//     statusCode = 400;
//     message = err.message || 'Некорректный запрос';
//   } else if (err.statusCode === 401) {
//     statusCode = 401;
//     message = err.message || 'Необходима авторизация';
//   } else if (err.statusCode === 403) {
//     statusCode = 403;
//     message = err.message || 'Доступ запрещен';
//   } else if (err.statusCode === 404) {
//     statusCode = 404;
//     message = err.message || 'Пользователь не найден';
//   } else if (err.statusCode === 409) {
//     statusCode = 409;
//     message = err.message || 'Конфликт данных';
//   }

//   res.status(statusCode).send({ message });
// };

// module.exports = errorHandler;

const {
  BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError, InternalServerError,
} = require('../utils/errors');

const errorMiddleware = (err, req, res, next) => {
  console.log(err);

  let statusCode = 500;
  let message = 'На сервере произошла ошибка';

  if (err instanceof BadRequestError) {
    statusCode = err.statusCode;
    message = err.message || 'Некорректный запрос';
  } else if (err instanceof UnauthorizedError) {
    statusCode = err.statusCode;
    message = err.message || 'Необходима авторизация';
  } else if (err instanceof ForbiddenError) {
    statusCode = err.statusCode;
    message = err.message || 'Доступ запрещен';
  } else if (err instanceof NotFoundError) {
    statusCode = err.statusCode;
    message = err.message || 'Пользователь не найден';
  } else if (err instanceof ConflictError) {
    statusCode = err.statusCode;
    message = err.message || 'Конфликт данных';
  } else if (err instanceof InternalServerError) {
    statusCode = err.statusCode;
    message = err.message || 'Внутренняя ошибка сервера';
  }

  res.status(statusCode).send({ message });
};

module.exports = errorMiddleware;
