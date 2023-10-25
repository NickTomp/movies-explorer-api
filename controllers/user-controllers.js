const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');
const DuplicateError = require('../errors/duplicate-err');
const UnathorizedError = require('../errors/unathorized-err');
const BadRequestError = require('../errors/bad-request-err');
const user = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

function findMe(req, res, next) {
  user.findById(req.user)
    .then((resultUser) => {
      if (resultUser === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.status(200).send(resultUser);
    })
    .catch(next);
}
function updateUser(req, res, next) {
  const { name, about } = req.body;
  user.findByIdAndUpdate(req.user, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((resultUser) => res.status(200).send({ data: resultUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при обновлении информации о пользователе'));
      } else {
        next(err);
      }
    });
}

function createUser(req, res, next) {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name, email, password: hash,
    }))
    .then((resultUser) => res.status(200).send({
      name: resultUser.name,
      email: resultUser.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new DuplicateError('Такой пользователь уже существует'));
      } else {
        next(err);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  user.findOne({ email }).select('+password')
    .then((resultUser) => {
      if (!resultUser) {
        return Promise.reject(new UnathorizedError('Неверный логин или пароль'))
          .catch(next);
      }
      bcrypt.compare(password, resultUser.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnathorizedError('Неверный логин или пароль'))
              .catch(next);
          }
          const token = jwt.sign({ _id: resultUser._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          }).send({ message: 'login successful' });
          return true;
        });
      return true;
    })
    .catch(next);
}
function logout(req, res) {
  res.clearCookie('jwt').send({ message: 'session destroyed' });
}
module.exports = {
  createUser, updateUser, login, logout, findMe,
};
