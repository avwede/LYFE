/**
 * @todo: complete openapi specs for login
 */

const router = require('express').Router();
const User = require('../models/User');
const { sendResponse, sendError } = require('../util/responses');
const { generateJWT, authenticateJWT } = require('../middleware/routerMiddleware');

/**
 * @openapi
 * 
 * paths:
 *  /api/users/register:
 *    post:
 *      tags: [users]
 *      summary: Create a new user.
 *      description: Creates a new user and returns a signed JSON Web Token.
 *      operationId: createUser
 *      requestBody:
 *        description: User to create.
 *        required: true
 *        content: 
 *          application/json:
 *            schema: 
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        201:
 *          description: New user created.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                    format: jsonWebToken
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNTgzMTlkNmFlZGRlMjQ4ZGJhZDcyMCIsImlhdCI6MTYxNjY1ODIwMSwiZXhwIjoxNjE2NjYxODAxfQ.xicZukmEjma0owGMY06ZFrsaemtHOkop8BSPC2arB3k
 *        400:
 *          $ref: '#/components/responses/400BadRequest'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.post('/register', (req, res) => {
  const newUser = req.body;

  User.create(newUser)
    .then(({ _id }) => {
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
 * @openapi
 * 
 * paths:
 *  /api/users/{userId}:
 *    delete:
 *      security:
 *        - BearerAuth: []
 *      tags: [users]
 *      summary: Delete a user.
 *      description: Deletes a user by id. This action can only be performed by an authenticated 
 *        user and users may only delete their own account.
 *      operationId: deleteUser
 *      parameters:
 *        - in: path
 *          name: userId
 *          required: true
 *          description: The user id assigned by the database.
 *          schema:
 *            type: string
 *            format: objectId
 *          example: 6058319d6aedde248dbad720
 *      responses:
 *        200:
 *          description: User deleted successfully.
 *          content: 
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  _id: 
 *                    type: string
 *                    format: objectId
 *                    example: 6058319d6aedde248dbad720
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        403:
 *          $ref: '#/components/responses/403Forbidden'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.delete('/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const thisUser = req.tokenPayload.id;

  if (thisUser === id) {
    User.findByIdAndRemove({ _id: id })
      .then(({ _id }) => {
        sendResponse(res, '200', { _id: _id });
      })
      .catch((err) => {
        sendError(res, err, `The user with id ${id} could not be removed.`);
      });
  } else {
    sendError(res, '403', 'This user is not authorized to perform this action.');
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