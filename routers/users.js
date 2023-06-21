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
    userId: Joi.string().required().hex(),
  },
});

router.get('/users', authMiddleware, getUsers);

router.patch('/users/me', authMiddleware, updateUsersProfile);

router.get('/users/me', authMiddleware, getUserInformation);

router.get('/users/:userId', authMiddleware, userValidation, getUserById);

router.patch('/users/me/avatar', authMiddleware, updateUsersAvatar);

module.exports = router;
