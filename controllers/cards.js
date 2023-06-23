/* eslint-disable no-param-reassign */
const Card = require('../models/card');

const { BadRequestError } = require('../utils/BadRequestError');
const { ForbiddenError } = require('../utils/ForbiddenError');
const { NotFoundError } = require('../utils/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((error) => next(error));
};

const postCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные карточки'));
      } else {
        next(error);
      }
    });
};

const deleteCards = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user.id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Такой карточки не существует'));
        return;
      }

      if (card.owner && card.owner.toString() !== userId) {
        next(new ForbiddenError('Доступ запрещен'));
        return;
      }

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
        next(new NotFoundError('Карточка с указанным id не найдена'));
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный формат ID карточки'));
      } else {
        next(err);
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
        next(new NotFoundError('Карточка с указанным id не найдена'));
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный формат ID карточки'));
      } else {
        next(err);
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
