const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {
  getUsers,
  getUserById,
  getUserInformation,
  updateUsersProfile,
  updateUsersAvatar,
} = require('../controllers/users').default;

router.get('/users', authMiddleware, getUsers);

router.patch('/users/me', authMiddleware, updateUsersProfile);

router.get('/users/me', authMiddleware, getUserInformation);

router.get('/users/:userId', authMiddleware, getUserById);

router.patch('/users/me/avatar', authMiddleware, updateUsersAvatar);

module.exports = router;
