const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {
  getCards,
  postCards,
  deleteCards,
  addCardLike,
  deleteCardLike,
} = require('../controllers/cards');

router.get('/cards', authMiddleware, getCards);

router.post('/cards', authMiddleware, postCards);

router.delete('/cards/:cardId', authMiddleware, deleteCards);

router.put('/cards/:cardId/likes', authMiddleware, addCardLike);

router.delete('/cards/:cardId/likes', authMiddleware, deleteCardLike);

module.exports = router;
