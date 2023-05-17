const router = require('express').Router();

const {
  getUsers, getUsersById, postUsers, updateUsersProfile, updateUsersAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUsersById);

router.post('/users', postUsers);

router.patch('/users/me', updateUsersProfile);

router.patch('/users/avatar', updateUsersAvatar);

module.exports = router;
