const CardModel = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const card = await CardModel.find({});
    return res.send(card);
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = new CardModel({ name, link, owner });
    return res.status(201).send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные в метод создания карточки',
      });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await CardModel.findByIdAndRemove(cardId);
    return res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).send({
        message: 'Запрашиваемая карточка для удаления не найдена',
      });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};
module.exports.likeCard = async (req, res) => {
  try {
    const like = CardModel.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return res.send(like);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).send({
        message: 'Запрашиваемая карточка для добавления лайка не найдена',
      });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};
module.exports.dislikeCard = async (req, res) => {
  try {
    const dislike = CardModel.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    return res.send(dislike);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).send({
        message: 'Запрашиваемая карточка для удаления лайка не найдена',
      });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};
