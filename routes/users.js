const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);

router.get('/users', getUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserById);
// router.get('/users/:_id', getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().pattern(/^https?:\/\/[\w\-\.\/~:\?\#\[\]@!$&'\(\)\*\+,;=]+[\-\.\/~:\?\#\[\]@!$&'\(\)\*\+,;=]{1}[\w\-\.\/~:\?\#\[\]@!$&'\(\)\*\+,;=]+[#\/]?$/),
  }),
}), updateAvatar);

module.exports = router;
