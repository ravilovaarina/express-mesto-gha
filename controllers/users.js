const User = require('../models/user');
const NotFoundError = require('../errors/Not-found-err');
const ValidationError = require('../errors/Bad-request-err');

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(...user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar,
  } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true }, { runValidators: true })
    .then((user) => res.send({
      _id: user._id,
      avatar: user.avatar,
      name,
      about,
    }))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true }, { runValidators: true })
    .then((user) => res.send({
      _id: user._id,
      avatar,
      name: user.name,
      about: user.about,
    }))
    .catch(next);
};
