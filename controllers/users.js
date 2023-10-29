const User = require('../models/user');
const {
  ERROR_500,
  ERROR_400,
  CODE_200,
  ERROR_404,
} = require('../utils/codes');

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        return res
          .status(ERROR_404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR_400)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_500).send({ message: 'Что-то пошло не так' }));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar,
  } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        return res
          .status(ERROR_404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(CODE_200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({ message: 'Некорректные данные' });
      }
      if (err.name === 'CastError') {
        return res
          .status(ERROR_404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(CODE_200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};
