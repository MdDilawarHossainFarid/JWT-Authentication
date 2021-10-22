const express = require('express');

const morgan = require('morgan');
const httpError = require('http-errors');
const AuthRoute = require('./router/Auth.route');
const { urlencoded } = require('express');
require('./helpers/init_mongodb');
const { verifyAccessToken } = require('./helpers/jwt_helper');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', verifyAccessToken, async (req, res, next) => {
  res.send('welcome home page');
});

app.use('/auth', AuthRoute);

app.use(async (req, res, next) => {
  next(httpError.NotFound());
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});

module.exports = app;
