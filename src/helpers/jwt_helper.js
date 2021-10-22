const jwt = require('jsonwebtoken');
const httpError = require('http-errors');

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const option = {
        expiresIn: '20s',
        audience: userId,
      };
      jwt.sign(payload, secret, option, (err, token) => {
        if (err) {
          console.log(error);
          reject(httpError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers['authorization']) return next(httpError.Unauthorized());
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
      if (error) {
        const message =
          error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
        return next(httpError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const option = {
        expiresIn: '1y',
      };
      jwt.sign(payload, secret, option, (err, token) => {
        if (err) {
          console.log(error);
          reject(httpError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(httpError.Unauthorized());
          const userId = payload.aud;
          resolve(userId);
        }
      );
    });
  },
};
