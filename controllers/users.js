const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequest = require('../errors/BadRequest'); // 400
const ConflictingRequest = require('../errors/ConflictingRequest'); // 409

// const {
//   STATUS_OK,
//   ERROR_INCORRECT_DATA, 400
//   ERROR_NOT_FOUND, 404
//   ERROR_DEFAULT,  500
// } = require('../errors/status');

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорретный Id'));
        return;
      }
      // return
      next(err);
    });
};

// const getUserById = (req, res) => {
//   const userId = req.params._id;

//   User.findById(userId)
//     .orFail(new Error('NotValidId'))
//     .then((user) => res.send({ data: user }))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(ERROR_INCORRECT_DATA)
//  .send({ message: 'Переданы некорректные данные при создании пользователя.' });
//       } else if (err.message === 'NotValidId') {
//         res.status(ERROR_NOT_FOUND)
//  .send({ message: 'Пользователь по указанному _id не найден.' });
//         return;
//       }
//       res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
//     });
// };

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
//         res.status(ERROR_INCORRECT_DATA)
//         .send({ message: 'Переданы некорректные данные при создании пользователя.' });
//       } else if (err.name === 'NotValidId') {
//         res.status(ERROR_NOT_FOUND)
//         .send({ message: 'Пользователь по указанному _id не найден.' });
//         return;
//       }
//       res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
//     });
// };

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          const { _id } = user;
          res.status(201).send({
            name, about, avatar, email, _id,
          // data: user
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequest('Переданы некорректные данные'));
          }
          if (err.code === 11000) {
            return next(new ConflictingRequest('Пользователь с такой почтой уже существует'));
          }
          return next(err);
        });
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
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
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     next(BadRequest('Переданы некорректные данные'));
  //   } else if (err.message === 'NotFound') {
  //     next(new NotFoundError('Пользователь с указанным _id не найден'));
  //   } else next(err);
  // });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
