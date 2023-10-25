require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');
const errorsHandler = require('./middlewares/errors-handler');
const {
  createUser, login, logout,
} = require('./controllers/user-controllers');
const auth = require('./middlewares/auth');

const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');

const { PORT = 3000, NODE_ENV, DB_ADDRESS } = process.env;

const app = express();
mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : 'mongodb://0.0.0.0:27017/moviesdb');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(cors);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/movies', movieRouter);
app.post('/signout', logout);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
