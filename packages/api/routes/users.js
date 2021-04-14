/**
 * @todo: complete openapi specs for login
 * @todo: Email Verification: if unverified user logs in, remind them to verify, do not issue JWT
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
 *                    type: string
 *                    example: Requested email verification. Check email for verification link.
 *        400:
 *          $ref: '#/components/responses/400BadRequest'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.post('/register', (req, res) => {
  const newUser = req.body;

  User.create(newUser)
    .then(user => {
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
 *                    type: string
 *                    example: Requested email verification. Check email for verification link.
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
        sendVerificationEmail(updatedUser, updatedUser.verificationToken, res);
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

  if (hasTokenCredentials(token, password)) {
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
 *  /api/users/reset:
 *    post:
 *      tags: [users]
 *      summary: Request password reset.
 *      description: If email exists, generate and email the user a password reset token.
 *      operationId: recoverPassword
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
 *          description: Sent password reset email.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Requested password reset. Check email for password reset link.
 *        401:
 *          description: Unauthorized.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Email is not associated with any registered account.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.post('/reset', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    user.generatePasswordResetToken()
      .then(updatedUser => {
        sendPasswordResetEmail(updatedUser, updatedUser.passwordResetToken, res);
      })
      .catch(err => {
        sendError(res, 500, 'Server failed to send password reset email.');
      });
  } else {
    sendError(res, 401, 'Email is not associated with any registered account.');
  }
});

/**
 * @openapi
 * 
 * paths:
 *  /api/users/reset/{token}:
 *    post:
 *      tags: [users]
 *      summary: Reset password.
 *      description: If token and password are valid, reset the user's password.
 *      operationId: resetPassword
 *      parameters:
 *        - in: path
 *          name: token
 *          required: true
 *          description: Password reset token.
 *          schema:
 *            type: string
 *          example: 0105274e7e458208977c28bfdf11ddf05b5e0ab54b60cc70666736a030a153b0
 *      requestBody:
 *        description: User's new password.
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
 *          description: Password has been updated.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: This user's password has been updated.
 *        400:
 *          $ref: '#/components/responses/400BadRequest'
 *        401:
 *          description: Unauthorized.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Password reset token is invalid or has expired.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.post('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (hasTokenCredentials(token, password)) {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpiration: { $gt: Date.now() },
    });

    User.validate({ password }, ['password'])
      .then(() => {
        resetPassword(user, password, res);
      })
      .catch((err) => {
        sendError(res, err, err.message);
      });
  } else {
    sendError(res, 400, 'Token and new password are required.');
  }
});

/**
 * @openapi
 * 
 * paths:
 *  /api/users/reset/{token}:
 *    get:
 *      tags: [users]
 *      summary: Validate password reset token.
 *      description: Verify that the password reset token belongs to a user and has not expired.
 *      operationId: validateResetToken
 *      parameters:
 *        - in: path
 *          name: token
 *          required: true
 *          description: Password reset token.
 *          schema:
 *            type: string
 *          example: 0105274e7e458208977c28bfdf11ddf05b5e0ab54b60cc70666736a030a153b0
 *      responses:
 *        200:
 *          description: Get status of password reset token.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  validToken:
 *                    type: boolean
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.get('/reset/:token', (req, res) => {
  const { token } = req.params;

  User.findOne({
    passwordResetToken: token,
    passwordResetExpiration: { $gt: Date.now() },
  })
    .then(user => {
      sendResponse(res, 200, { validToken: user != null });
    })
    .catch(err => {
      sendError(res, err, err.message);
    });
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
 *      description: Delete a user by id. This action can only be performed by an authenticated 
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
 *        204:
 *          description: User successfully deleted.
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        403:
 *          $ref: '#/components/responses/403Forbidden'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.delete('/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const userId = req.tokenPayload.id;

  if (userId === id) {
    User.findByIdAndRemove({ _id: id })
      .then(({ _id }) => {
        sendResponse(res, 204, {});
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
 * @returns {Boolean} Whether or not both the email and password are present.
 */
const hasLoginCredentials = (email, password) => {
  return email && password; 
};

/**
 * Verify that both a token and password are present.
 * 
 * @param {String} token A token.
 * @param {String} password The user's password.
 * @returns {Boolean} Whether or not both the token and password are present.
 */
const hasTokenCredentials = (token, password) => {
  return token && password;
};

/**
 * Check that this user can request a new verification email.
 * 
 * @param {Document} user Mongoose user document.
 * @param {Object} res Express response object.
 * @returns {Boolean} Whether or not the user can request a verification email.
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
 * @returns {Undefined} Return used eto end function early.
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
 * Update the user's password.
 * 
 * @param {Document} user Mongoose user document.
 * @param {String} password The user's new password.
 * @param {Object} res Express response object.
 */
const resetPassword = (user, password, res) => {
  user.resetPassword(password)
    .then(updatedUser => {
      sendResponse(res, 200, {
        message: "This user's password has been updated.",
      });
      sendPasswordUpdateEmail(updatedUser);
    })
    .catch(err => {
      sendError(res, err, err.message);
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
        message: 'Requested email verification. Check email for verification link.',
      });
    })
    .catch(err => {
      sendError(res, '500', 'Server failed to send verification email.');
    });
};

/**
 * Construct a password reset email and request that it be sent through the mailer sendMail helper.
 * 
 * @param {Document} user Mongoose user document.
 * @param {String} token The password reset token.
 * @param {Object} res Express response object.
 */
const sendPasswordResetEmail = (user, token, res) => {
  const passwordResetLink = `${APP_URL}/verify/${token}`;
  const emailBody = `<p>Hi ${user.firstName} ${user.lastName},</p><br>
                        <p>We received a request to reset your password. Please create a new password by clicking this link:</p>
                        <strong><a href="${passwordResetLink}" alt="Reset My Password">Reset My Password</a></strong>
                        <p>This request will expire in 1 hour. If you cannot click on the link, copy and paste the following URL into a new tab in your browser:</p>
                        <p>${passwordResetLink}</p><br>
                        <p>The LYFE Team</p>`;

  sendEmail(user.email, 'Password Reset', emailBody)
    .then((result) => {
      sendResponse(res, 200, {
        message:
          'Requested password reset. Check email for password reset link.',
      });
    })
    .catch((err) => {
      sendError(res, 500, 'Server failed to send password reset email.');
    });
};

/**
 * Construct a password reset confirmation email and request that it be sent through the mailer
 * sendMail helper.
 * 
 * @param {Document} user Mongoose user document.
 */
const sendPasswordUpdateEmail = (user) => {
  const emailBody = `<p>Hi ${user.firstName} ${user.lastName},</p><br>
                        <p>Your password was successfully changed.</p><br>
                        <p>The LYFE Team</p>`;
  
  sendEmail(user.email, 'Password Reset Confirmation', emailBody);
};

module.exports = {
  userRouter: router,
}