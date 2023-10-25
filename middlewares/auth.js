const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/unathorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new UnathorizedError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    next(new UnathorizedError('Необходима авторизация'));
  }
  req.user = payload._id;
  next();
};
