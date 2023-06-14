const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR } = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const postCards = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCards = (req, res) => {
  const { cardId } = req.params;
  console.log(req.params);
  const userId = req.user._id;


  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Такой карточки не существует' });
      }

      // Проверка, является ли текущий пользователь владельцем карточки
      if (card.owner.toString() !== userId) {
        return res.status(FORBIDDEN).send({ message: 'Доступ запрещен' });
      }

      // Удаление карточки
      Card.findByIdAndRemove(cardId)
        .then((deletedCard) => res.send(deletedCard))
        .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный формат ID карточки' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const addCardLike = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный формат ID карточки' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const deleteCardLike = (req, res) => {
  const { cardId } = req.params;
  console.log(cardId);

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный формат ID карточки' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  postCards,
  deleteCards,
  addCardLike,
  deleteCardLike,
};
