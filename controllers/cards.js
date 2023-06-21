/* eslint-disable no-param-reassign */
const Card = require('../models/card');
const {
  BAD_REQUEST, NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((error) => {
      error.statusCode = INTERNAL_SERVER_ERROR;
      error.message = 'Произошла ошибка';
      next(error);
    });
};

const postCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        error.statusCode = BAD_REQUEST;
        error.message = 'Переданы некорректные данные карточки';
      } else {
        error.statusCode = INTERNAL_SERVER_ERROR;
        error.message = 'Произошла ошибка';
      }
      next(error);
    });
};

const deleteCards = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user.id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        const error = new Error('Такой карточки не существует');
        error.statusCode = NOT_FOUND;
        next(error); // Передача ошибки обработчику ошибок
        return;
      }

      // Проверка, является ли текущий пользователь владельцем карточки
      if (card.owner && card.owner.toString() !== userId) {
        const error = new Error('Доступ запрещен');
        error.statusCode = FORBIDDEN;
        next(error); // Передача ошибки обработчику ошибок
        return;
      }

      // Удаление карточки
      Card.findByIdAndRemove(cardId)
        .then((deletedCard) => res.send(deletedCard))
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
};

const addCardLike = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const error = new Error('Карточка с указанным id не найдена');
        error.statusCode = NOT_FOUND;
        next(error); // Передача ошибки обработчику ошибок
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new Error('Некорректный формат ID карточки');
        error.statusCode = BAD_REQUEST;
        next(error);
      } else {
        const error = new Error('Произошла ошибка');
        error.statusCode = INTERNAL_SERVER_ERROR;
        next(error);
      }
    });
};

const deleteCardLike = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const error = new Error('Карточка с таким id не найдена');
        error.statusCode = NOT_FOUND;
        next(error); // Передача ошибки обработчику ошибок
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new Error('Некорректный формат ID карточки');
        error.statusCode = BAD_REQUEST;
        next(error);
      } else {
        const error = new Error('Произошла ошибка');
        error.statusCode = INTERNAL_SERVER_ERROR;
        next(error);
      }
    });
};

module.exports = {
  getCards,
  postCards,
  deleteCards,
  addCardLike,
  deleteCardLike,
};
