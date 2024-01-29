const movieRouter = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const { urlRegex } = require('../constants/urlRegex');
const {
  findMovies, createMovie, deleteMovie,
} = require('../controllers/movie-controllers');

/* Поиск всех карточек */
movieRouter.get('/', (req, res, next) => {
  findMovies(req, res, next);
});
/* Создание карточки */
movieRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegex),
    trailerLink: Joi.string().required().pattern(urlRegex),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(urlRegex),
    movieId: Joi.number().required(),
  }),
}), (req, res, next) => {
  createMovie(req, res, next);
});
/* Удаление конкретной карточки */
movieRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), (req, res, next) => {
  deleteMovie(req, res, next);
});
movieRouter.use(errors());

module.exports = movieRouter;
