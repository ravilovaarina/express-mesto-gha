const CardModel = require('../models/card');
const {
  ERROR_500,
  ERROR_400,
  CODE_200,
  ERROR_404,
} = require('../utils/codes');

module.exports.getCards = async (req, res) => {
  CardModel.find({})
    .then((card) => res.send(card))
    .catch(() => res.status(ERROR_500).send({ message: 'Что-то пошло не так' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  CardModel.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  CardModel.findByIdAndRemove(cardId)
    .then((card) => {
      if (card === null) {
        return res.status(ERROR_404).send({ message: 'Карточки не найдена' });
      }
      return res.status(CODE_200).send({ data: card, message: 'DELETE' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({ message: 'Карточки не найдена' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.likeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res.status(ERROR_404).send({ message: 'Карточки не найдена' });
      }
      return res.status(CODE_200).send({ data: card, message: 'LIKE' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({ message: 'Карточки не найдена' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.dislikeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res.status(ERROR_404).send({ message: 'Карточки не найдена' });
      }
      return res.status(CODE_200).send({ data: card, message: 'DISLIKE' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({ message: 'Карточки не найдена' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};
