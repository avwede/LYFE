/**
 * @todo: complete openapi specs for login
 */
require('dotenv').config();

const router = require('express').Router();
const User = require('../models/User');
const { sendResponse, sendError } = require('../util/responses');
const { authenticateJWT } = require('../middleware/routerMiddleware');
const { sendEmail } = require('../util/mailer');
const { APP_URL } = process.env;

/**
 * @openapi
 * 
 * paths:
 *  /api/users/register:
 *    post:
 *      tags: [users]
 *      summary: Create a new user.
 *      description: Creates a new unverified user and triggers email verification.
 *      operationId: createUser
 *      requestBody:
 *        description: User to create.
 *        required: true
 *        content: 
 *          application/json:
 *            schema: 
 *              title: Unverified User
 *              type: object
 *              required:
 *                - firstName
 *                - lastName
 *                - email
 *                - password
 *              properties:
 *                firstName:
 *                  type: string
 *                  example: John
 *                lastName:
 *                  type: string
 *                  example: Smith
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                  format: password
 *                  example: Password123#
 *      responses:
 *        200:
 *          description: New user created and verification email requested.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: String
 *                    example: Requested verification email. Check email for verification code.
 *        400:
 *          $ref: '#/components/responses/400BadRequest'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.post('/register', (req, res) => {
  const newUser = req.body;

  User.create(newUser)
    .then((user) => {
      user.generateVerificationToken()
        .then(updatedUser => {
          sendVerificationEmail(user, updatedUser.verificationToken, res);
        })
        .catch(err => {
          sendError(res, '500', 'User registered but verification token could not be generated.');
        });
    })
    .catch((err) => {
      sendError(res, err, 'The user could not be created.');
    });
});

/**
 * @openapi
 * 
 * paths:
 *  /api/users/verify/resend:
 *    post:
 *      tags: [users]
 *      summary: Resend verification email.
 *      description: Request another verification email be sent to this user.
 *      operationId: resendVerificationEmail
 *      requestBody:
 *        description: User's email address.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              title: Email Address
 *              type: object
 *              required:
 *                - email
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *      responses:
 *        200:
 *          description: Resent verification email.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: String
 *                    example: Requested verification email. Check email for verification code.
 *        400:
 *          description: Bad request.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: String
 *                    example: This user is already verified.
 *        401:
 *          description: Unauthorized.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: String
 *                    example: Email is not associated with any registered account.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.post('/verify/resend', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  
  if (isVerifiable(user, res)) {
    user.generateVerificationToken()
      .then(updatedUser => {
        sendVerificationEmail(user, updatedUser.verificationToken, res);
      })
      .catch(err => {
        sendError(res, '500', 'Server failed to send verification email.');
      });
  }
});

/**
 * @openapi
 * 
 * paths:
 *  /api/users/verify/{token}:
 *    post:
 *      tags: [users]
 *      summary: Verify email.
 *      description: Verify this user's email address.
 *      operationId: verifyEmail
 *      parameters:
 *        - in: path
 *          name: token
 *          required: true
 *          description: Email verification token.
 *          schema:
 *            type: string
 *          example: 0105274e7e458208977c28bfdf11ddf05b5e0ab54b60cc70666736a030a153b0
 *      requestBody:
 *        description: User's password.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              title: Password
 *              type: object
 *              required:
 *                - password
 *              properties:
 *                password:
 *                  type: string
 *                  example: Password123#
 *      responses:
 *        200:
 *          description: User verified.
 *          content: 
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token: 
 *                    type: string
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNWM1ZmNkYTdjYzQ0MzE2NTE2NjAwNiIsImlhdCI6MTYxNzI2MDY2OSwiZXhwIjoxNjE3MjY0MjY5fQ.GTR5Lzeeo-T2fb0AA0pISZ05z36NtAgPGFeMYliBHQA
 *        400:
 *          description: Bad request.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: This user is already verified.
 *        401:
 *          description: Unauthorized.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Token and/or password is not associated with any registered account.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.post('/verify/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (hasVerificationCredentials(token, password)) {
    const user = await User.findOne({ verificationToken: token });

    if (user)
      verifyUser(user, password, res);
    else 
      sendError(res, '401', 'Token and/or password is not associated with any registered account.');
  } else {
    sendError(res, '400', 'Token and password are required.');
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (hasLoginCredentials(email, password)) {
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
 * @param {String} email The user's email address. 
 * @param {String} password The user's password.
 * @returns 
 */
const hasLoginCredentials = (email, password) => {
  return email && password; 
};

/**
 * Verify that both a token and password are present.
 * 
 * @param {String} token A verification token.
 * @param {String} password The user's password.
 * @returns 
 */
const hasVerificationCredentials = (token, password) => {
  return token && password;
};

/**
 * Check that this user can request a new verification email.
 * 
 * @param {Document} user Mongoose user document.
 * @param {Object} res Express response object.
 */
const isVerifiable = (user, res) => {
  let verifiable = true;

  if (!user) {
    sendError(res, '401', `Email is not associated with any registered account.`);
    verifiable = false;
  } else if (user.verified) {
    sendError(res, '400', 'This user is already verified.');
    verifiable = false;
  }

  return verifiable;
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
 * Check that the user can update their verification status. If so call function to set status to
 * true.
 * 
 * @param {Document} user Mongoose user document.
 * @param {String} password The user's password.
 * @param {Object} res Express response object.
 * @returns 
 */
const verifyUser = async (user, password, res) => {
  const result = await user.isValidPassword(password);
  
  if (!result)
    return sendError(res, '401', 'Invalid password.');

  if (user.verified)
    return sendError(res, '400', 'This user is already verified');

  setVerificationStatus(user, true, res);
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
      
      const token = user.generateJWT();
      sendResponse(res, '201', { token });
    });
};

/**
 * 
 * @param {Document} user Mongoose user document.
 * @param {Boolean} status Verification status.
 * @param {Object} res Express response object.
 */
const setVerificationStatus = (user, status, res) => {
  user.verified = status;
  user.save()
    .then(updatedUser => {
      const token = updatedUser.generateJWT();
      sendResponse(res, 200, { token });
    })
    .catch(err => {
      sendError(res, err, err.message);
    });
};

/**
 * Construct a verification email and request that it be sent through the mailer sendMail helper.
 * 
 * @param {Document} user Mongoose user document.
 * @param {String} token The verification token.
 * @param {Object} res Express response object.
 */
const sendVerificationEmail = (user, token, res) => {
  const verificationLink = `${APP_URL}/verify/${token}`;
  const emailBody = `<p>Hi ${user.firstName} ${user.lastName},</p><br>
                        <p>Please verify your email address by clicking the link below.</p>
                        <strong><a href="${verificationLink}" alt="Verify My Email">Verify My Email</a></strong>
                        <p>If you cannot click on the link, copy and paste the following URL into a new tab in your browser:</p>
                        <p>${verificationLink}</p><br>
                        <p>The LYFE Team</p>`;

  sendEmail(user.email, 'Please Verify Your Email', emailBody)
    .then(result => {
      sendResponse(res, 200, {
        message: 'Requested verification email. Check email for verification code.',
      });
    })
    .catch(err => {
      sendError(res, '500', 'Server failed to send verification email.');
    });
};

module.exports = {
  userRouter: router,
}