const User = require('../models/user');

module.exports.getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    return res.send(user);
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    return res.send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(404)
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
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { name, about });
    return res.send(updatedUser);
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
    const updatedAvatar = await User.findByIdAndUpdate(req.user._id, { avatar });
    return res.send(updatedAvatar);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные в метод обновления аватар',
      });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};
