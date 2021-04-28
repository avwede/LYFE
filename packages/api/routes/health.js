const router = require('express').Router();
const User = require('../models/User');
const { partialUpdate } = require('../util/queries');
const { sendResponse, sendError } = require('../util/responses');
const { authenticateJWT } = require('../middleware/routerMiddleware');

/**
 * @openapi
 * 
 * paths:
 *  /api/health:
 *    get:
 *      security:
 *        - BearerAuth: []
 *      tags: [health]
 *      summary: Get health profile.
 *      description:  Get health profile for the user contained in the required JSON Web Token. This 
 *        action can only be performed by an authenticated user.
 *      operationId: getHealthProfile
 *      responses:
 *        200:
 *          description: Health profile successfully retrieved.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Health'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.tokenPayload.id;

  User.findById(userId, 'health')
    .then((results) => {
      sendResponse(res, 200, results.health ? results.health : {});
    })
    .catch((err) => {
      sendError(res, err, err.message);
    });
});

/**
 * @openapi
 * 
 * paths:
 *  /api/health:
 *    post:
 *      security:
 *        - BearerAuth: []
 *      tags: [health]
 *      summary: Create health profile.
 *      description: Create a health profile for the user contained in the required JSON Web Token. 
 *        This action can only be performed by an authenticated user.
 *      operationId: createHealthProfile
 *      requestBody:
 *        description: Health Profile
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Health'
 *      responses:
 *        201:
 *          description: New health profile successfully created.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Health'
 *        400:
 *          $ref: '#/components/responses/400BadRequest'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.post('/', authenticateJWT, async (req, res) => {
  const userId = req.tokenPayload.id;
  const newHealthProfile = req.body;
  const user = await User.findById(userId);

  if (user) {
    user.health = newHealthProfile;
    user.save()
      .then(updatedUser => {
        sendResponse(res, 201, updatedUser.health);
      })
      .catch(err => {
        sendError(res, err, err.message);
      });
  } else {
    sendError(res, 500, 'Server failed to fetch this user.');
  }
});

/**
 * @openapi
 * 
 * paths:
 *  /api/health:
 *    put:
 *      security:
 *        - BearerAuth: []
 *      tags: [health]
 *      summary: Update health profile.
 *      description: Update the health profile for the user contained in the required JSON Web Token. 
 *        This action can only be performed by an authenticated user.
 *      operationId: updateHealthProfile
 *      requestBody:
 *        description: Health Profile
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Health'
 *      responses:
 *        200:
 *          description: Health profile successfully updated.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Health'
 *        400:
 *          $ref: '#/components/responses/400BadRequest'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.put('/', authenticateJWT, async (req, res) => {
  const updatedFields = req.body;
  const userId = req.tokenPayload.id;
  const user = await User.findById(userId);

  if (user) {
    let updatedHealth = {};

    if (user.health)
      updatedHealth = partialUpdate(user.health, updatedFields);

    user.save()
      .then(() => {
        sendResponse(res, 200, updatedHealth);
      })
      .catch((err) => {
        sendError(res, err, err.message);
      });
  } else {
    sendError(res, 500, 'Server failed to fetch this user.');
  }
});

/**
 * @openapi
 * 
 * paths:
 *  /api/health:
 *    delete:
 *      security:
 *        - BearerAuth: []
 *      tags: [health]
 *      summary: Delete health profile.
 *      description: Delete the health profile for the user contained in the required JSON Web Token.
 *        This action can only be performed by an authenticated user.
 *      operationId: deleteHealthProfile
 *      responses:
 *        204:
 *          description: Health profile successfully deleted.
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.delete('/', authenticateJWT, async (req, res) => {
  const userId = req.tokenPayload.id;
  const user = await User.findById(userId);

  if (user) {
    user.health.remove();

    user.save()
      .then(() => {
        sendResponse(res, 204, {});
      })
      .catch((err) => {
        sendError(res, err, err.message);
      });
  } else {
    sendError(res, 500, 'Server failed to fetch this user.');
  }
});

module.exports = {
  healthRouter: router,
};