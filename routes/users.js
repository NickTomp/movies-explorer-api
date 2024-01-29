const userRouter = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const {
  updateUser, findMe,
} = require('../controllers/user-controllers');

/* Поиск  авторизованного пользователя */
userRouter.get('/me', (req, res, next) => {
  findMe(req, res, next);
});
/* Обновление информации о пользователе */
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), (req, res, next) => {
  updateUser(req, res, next);
});
userRouter.get('/me', (req, res, next) => {
  findMe(req, res, next);
});
userRouter.use(errors());

module.exports = userRouter;
