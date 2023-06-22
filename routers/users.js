/* eslint-disable no-useless-escape */
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
    avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|([a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]\.)+[a-zA-Z]{2,6})(:[0-9]{1,5})?(\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?$/),
  }),
});

router.get('/users', authMiddleware, getUsers);

router.patch('/users/me', authMiddleware, updateNameAndAboutValidation, updateUsersProfile);

router.get('/users/me', authMiddleware, getUserInformation);

router.get('/users/:userId', authMiddleware, userValidation, getUserById);

router.patch('/users/me/avatar', authMiddleware, updateAvatarValidation, updateUsersAvatar);

module.exports = router;
