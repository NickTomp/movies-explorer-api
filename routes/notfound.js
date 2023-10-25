const notFoundRouter = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

/* Обработка несуществующего пути */
notFoundRouter.use('/', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});
module.exports = notFoundRouter;
