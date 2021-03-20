/**
 * @todo PUT '/' - update user, return updated user data
 * @todo DELETE '/' - delete user
 * @todo authenticate update and delete routes
 */

const router = require('express').Router();
const User = require('../models/User');
const { sendResponse, sendError } = require('../util/responses');
const { generateJWT } = require('../middleware/routerMiddleware');

/**
 * @openapi
 * 
 * paths:
 *  /api/users/register:
 *    post:
 *      tags: [users]
 *      description: Creates a new user and returns a signed JSON Web Token.
 *      operationId: createUser
 *      requestBody:
 *        description: User to create.
 *        content: 
 *          application/json:
 *            schema: 
 *              $ref: '#/components/schemas/User'
 *        required: true
 *      responses:
 *        201:
 *          description: New user created.
 */
router.post('/register', (req, res) => {
  const newUser = req.body;

  User.create(newUser)
    .then(({ _id, firstName, lastName }) => {
      const token = generateJWT({ id: _id });
      sendResponse(res, 201, { token });
    })
    .catch((err) => {
      sendError(res, err, 'The user could not be created.');
    });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (hasCredentials(email, password)) {
    findUser(req, res);
  } else {
    sendError(res, '400', 'Email and password are required.');
  }
});

/**
 * Verify that both an email and password are present.
 * 
 * @param {Strin} email The user's email address. 
 * @param {String} password The user's password.
 * @returns 
 */
const hasCredentials = (email, password) => {
  return email && password; 
};

/**
 * Find the matching user based on the email address. If the user does not exist, send a bad 
 * request response. Otherwise, validate the password.
 * 
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
const findUser = (req, res) => {
  const { email, password } = req.body;
  
  User.findOne({ email })
    .then((user) => {
      if (user) {
        validatePassword(user, password, res);
      } else {
        sendError(res, '401', 'Email and/or password is incorrect.');
      }
    })
    .catch((err) => {
      sendError(res, err, err.message);
    });
};

/**
 * Validate the password. Verify that it matches the password saved for this user. If it matches,
 * generate and return a JWT. Otherwise, send a bad request response.
 * 
 * @param {Document} user Mongoose user document.
 * @param {String} password The user's password.
 * @param {Object} res Express response object.
 */
const validatePassword = (user, password, res) => {
  user.isValidPassword(password)
    .then((result) => {
      if (!result)
        return sendError(res, '401', 'Email and/or password is incorrect.');
      
      const token = generateJWT({ id: user._id });
      sendResponse(res, 201, { token });
    });
};

module.exports = {
  userRouter: router,
}