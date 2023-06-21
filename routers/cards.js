/* eslint-disable no-useless-escape */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const authMiddleware = require('../middlewares/authMiddleware');

const {
  getCards,
  postCards,
  deleteCards,
  addCardLike,
  deleteCardLike,
} = require('../controllers/cards');

const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/),
  }),
});

router.get('/cards', authMiddleware, getCards);

router.post('/cards', authMiddleware, cardValidation, postCards);

router.delete('/cards/:cardId', authMiddleware, deleteCards);

router.put('/cards/:cardId/likes', authMiddleware, addCardLike);

router.delete('/cards/:cardId/likes', authMiddleware, deleteCardLike);

module.exports = router;
