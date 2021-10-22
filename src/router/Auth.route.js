const express = require('express');
const router = express.Router();
const httpError = require('http-errors');
const User = require('../models/user.model');
const { authSchema } = require('../helpers/validation_schema');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../helpers/jwt_helper');

router.post('/login', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) throw httpError.NotFound('User is not register');
    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch)
      throw httpError.Unauthorized('Username/password is not authorized');
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    user.id;
    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true)
      return next(httpError.BadRequest('Invalid User/Password'));
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    // const { email, password } = req.body;
    // if (!email || !password) throw httpError.BadRequest();
    const validateData = await authSchema.validateAsync(req.body);

    const doesExist = await User.findOne({ email: validateData.email });

    if (doesExist)
      throw httpError.Conflict(
        `&{ validateData.email } is email already register`
      );
    const user = new User(validateData);

    const saveUser = await user.save();
    const accessToken = await signAccessToken(saveUser.id);
    const refreshToken = await signRefreshToken(saveUser.id);

    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

router.post('/refresh_token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw httpError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);

    const newAccessToken = await signAccessToken(userId);
    const newRefreshToken = await signRefreshToken(userId);

    res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
});
router.delete('/logout', async (req, res, next) => {});

module.exports = router;
