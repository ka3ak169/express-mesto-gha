const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getUsers,
  getUserById,
  getUserInformation,
  updateUsersProfile,
  updateUsersAvatar,
} = require('../controllers/users');

router.get('/users', authMiddleware, getUsers);

router.patch('/users/me', authMiddleware, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUsersProfile);

router.get('/users/me', authMiddleware, getUserInformation);

router.get('/users/:userId', authMiddleware, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/users/me/avatar', authMiddleware, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
}), updateUsersAvatar);

module.exports = router;
