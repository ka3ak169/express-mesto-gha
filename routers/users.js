/* eslint-disable no-useless-escape */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const authMiddleware = require('../middlewares/authMiddleware');
const { regAvatar } = require('../utils/constants');

const {
  getUsers,
  getUserById,
  getUserInformation,
  updateUsersProfile,
  updateUsersAvatar,
} = require('../controllers/users');

const userValidation = celebrate({
  params: {
    userId: Joi.string().length(24).hex().required(),
  },
});

const updateNameAndAboutValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regAvatar),
  }),
});

router.get('/users', authMiddleware, getUsers);

router.patch('/users/me', authMiddleware, updateNameAndAboutValidation, updateUsersProfile);

router.get('/users/me', authMiddleware, getUserInformation);

router.get('/users/:userId', authMiddleware, userValidation, getUserById);

router.patch('/users/me/avatar', authMiddleware, updateAvatarValidation, updateUsersAvatar);

module.exports = router;
