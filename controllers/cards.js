const Card = require('../models/card');
const {STATUS_OK,
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT} = require('../utils/status')

const getCards = (req, res) => {
  Card.find({})
    .then(card => res.send({ data: card }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT_DATA).send({
          message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию' });
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные' });
        return;
      }
       res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию' });
    });
};

const putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
         res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
         return
        }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT_DATA).send({
          message: 'Переданы некорректные данные для постановки лайка' });
          return;
        }
       res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию' });

      });
};

const deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT_DATA).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
        return;
      }
       res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию' });
      });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putCardLike,
  deleteCardLike,
};