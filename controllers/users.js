const User = require('../models/user');
const {
  STATUS_OK,
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../utils/status');

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)

    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });

        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT_DATA).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
};

// // попробовать orFail но тест выдает ошибку "Код ответа равен 404"
// const getUserById = (req, res) => {
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail(new Error('NotValidId'))
//     .then((user) => {
//       res.send({ data: user });
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные при создании пользователя.' });
//       } else if (err.name === 'NotValidId') {
//         res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
//         return;
//       }
//       res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
//     });
// };

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT_DATA).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT_DATA).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT_DATA).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
