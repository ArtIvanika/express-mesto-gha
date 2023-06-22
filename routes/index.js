const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const NotFoundError = require('../errors/NotFoundError');

router.use(userRoutes);
router.use(cardRoutes);
router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
