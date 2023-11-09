const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { reg } = require('../utils/isLink');
const {
  getUsers,
  getUserById,
  updateAvatar,
  updateProfile,
  getMe,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(reg).required(),
  }),
}), updateAvatar);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
userRouter.get('/users/me', getMe);

module.exports = userRouter;
