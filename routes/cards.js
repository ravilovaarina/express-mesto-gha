const cardRouter = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.post('', createCard);
cardRouter.delete('/:cardId/likes', dislikeCard);
cardRouter.put('/:cardId/likes', likeCard);

module.exports = cardRouter;
