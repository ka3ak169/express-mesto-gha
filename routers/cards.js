const router = require('express').Router();

const {
  getCards, postCards, deleteCards, addCardLike, deleteCardLike,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', postCards);

router.delete('/cards/:cardId', deleteCards);

router.put('/cards/:cardId/likes', addCardLike);

router.delete('/cards/:cardId/likes', deleteCardLike);

module.exports = router;
