const movies = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const PermissionError = require('../errors/permission-err');
const BadRequestError = require('../errors/bad-request-err');

function findMovies(req, res, next) {
  movies.find({ owner: req.user })
    .then((result) => res.status(200).send(result))
    .catch(next);
}

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user,
  })
    .then((result) => res.status(200).send({ data: result }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании карточки фильма'));
      } else {
        next(err);
      }
    });
}

function deleteMovie(req, res, next) {
  movies.findById(req.params.movieId)
    .then((result) => {
      if (result === null) {
        throw new NotFoundError('Запрашиваемая карточка фильма не найдена');
      }
      if (req.user !== result.owner._id.toString()) {
        throw new PermissionError('Недостаточно прав доступа');
      }
      movies.findByIdAndRemove(req.params.movieId)
        .then((movie) => {
          res.status(200).send(movie);
        })
        .catch(next);
    })
    .catch(next);
}

module.exports = {
  findMovies, createMovie, deleteMovie,
};
