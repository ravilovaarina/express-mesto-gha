const User = require('../models/user');

module.exports.getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    if (user) {
      return res.send(user);
    }
    return res.status(404).send({ message: 'Пользователь не найден' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(400)
        .send({ message: 'Некорректный id пользователя' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user) {
      return res.send(user);
    }
    return res.status(404).send({ message: 'Пользователь не найден' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(400)
        .send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    return res.status(201).send(await newUser.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные в метод создания пользователя',
      });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    // eslint-disable-next-line max-len
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true });
    return res.send({
      _id: updatedUser._id, avatar: updatedUser.avatar, name, about,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные в метод обновления профиля',
      });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    // eslint-disable-next-line max-len
    const updatedAvatar = await User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true });
    return res.send({
      _id: updatedAvatar._id, avatar, name: updatedAvatar.name, about: updatedAvatar.about,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные в метод обновления аватар',
      });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};
