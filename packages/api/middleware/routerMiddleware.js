require('dotenv').config();

const jwt = require('jsonwebtoken');
const { sendError } = require('../util/responses');
const { JWT_SECRET } = process.env;

/**
 *  Authenticate the JWT; Verify that it is valid.
 * 
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next The next middleware function in the request-response cycle.
 */
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace(/^Bearer /, '')
    : '';

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      sendError(
        res,
        '401',
        'Access denied. This request requires user authentication.'
      );
    } else {
      req.tokenPayload = decoded;
      next();
    }
  });
};

module.exports = {
  authenticateJWT,
}