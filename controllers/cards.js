const CardModel = require('../models/card');
const ForbiddenError = require('../errors/Forbidden-err');
const NotFoundError = require('../errors/Not-found-err');
const ValidationError = require('../errors/Bad-request-err');

module.exports.getCards = async (req, res, next) => {
  CardModel.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  CardModel.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const removeCard = () => {
    CardModel.findByIdAndRemove(req.params.cardId)
      .then((card) => res.send(card))
      .catch(next);
  };

  CardModel.findById(req.params.cardId)
    .then((card) => {
      if (!card) next(new NotFoundError('Карточки не существует'));
      if (req.user._id === card.owner.toString()) {
        return removeCard();
      }
      return next(new ForbiddenError('Попытка удалить чужую карточку'));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(
          new NotFoundError(
            'Запрашиваемая карточка для добавления лайка не найдена',
          ),
        );
      }
      return res.send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Запрашиваемая карточка для удаления лайка не найдена',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Некорректный id карточки',
        });
      }
      return res.status(500).send({ message: err.message });
    });
};
