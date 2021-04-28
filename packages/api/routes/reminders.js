const router = require('express').Router();
const User = require('../models/User');
const { partialUpdate } = require('../util/queries');
const { sendResponse, sendError } = require('../util/responses');
const { authenticateJWT } = require('../middleware/routerMiddleware');

/**
 * @openapi
 * 
 * paths:
 *  /api/reminders:
 *    get:
 *      security:
 *        - BearerAuth: []
 *      tags: [reminders]
 *      summary: Get reminders.
 *      description:  Get all reminders for the user contained in the required JSON Web Token. This 
 *        action can only be performed by an authenticated user.
 *      operationId: getReminders
 *      responses:
 *        200:
 *          description: List of reminders successfully retrieved.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Reminder'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.tokenPayload.id;

  User
    .findById(userId, 'reminders')
    .populate('reminders.type')
    .then(results => {
      sendResponse(res, 200, results.reminders);
    })
    .catch(err => {
      sendError(res, err, err.message);
    });
});

/**
 * @openapi
 * 
 * paths:
 *  /api/reminders/{reminderId}:
 *    get:
 *      security:
 *        - BearerAuth: []
 *      tags: [reminders]
 *      summary: Get reminder by id.
 *      description:  Get a single reminder for the user contained in the required JSON Web Token.
 *        This action can only be performed by an authenticated user.
 *      operationId: getReminder
 *      parameters:
 *        - in: path
 *          name: reminderId
 *          required: true
 *          description: The Object Id of the reminder to be retrieved.
 *          schema:
 *            type: string
 *            format: objectId
 *          example: 6058319d6aedde248dbad720
 *      responses:
 *        200:
 *          description: Reminder successfully retrieved.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Reminder'
 *        404:
 *          description: Not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error: 
 *                    type: string
 *                    example: Reminder with id does not exist.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.get('/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const userId = req.tokenPayload.id;

  User
    .findById(userId)
    .populate('reminders.type')
    .then(user => {
      const reminder = user.reminders.id(id);
      
      if (reminder)
        sendResponse(res, 200, reminder);
      else
        sendError(res, 404, `Reminder with id ${id} does not exist.`);
    })
    .catch(err => {
      sendError(res, err, err.message);
    });
});

/**
 * @openapi
 * 
 * paths:
 *  /api/reminders:
 *    post:
 *      security:
 *        - BearerAuth: []
 *      tags: [reminders]
 *      summary: Create reminder.
 *      description: Create a new reminder for the user contained in the required JSON Web Token. 
 *        This action can only be performed by an authenticated user.
 *      operationId: createReminder
 *      requestBody:
 *        description: Reminder
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Reminder'
 *      responses:
 *        201:
 *          description: List of reminders for this user.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Reminder'
 *        400:
 *          $ref: '#/components/responses/400BadRequest'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.post('/', authenticateJWT, async (req, res) => {
  const userId = req.tokenPayload.id;
  const newReminder = req.body;
  const user = await User.findById(userId);

  if (user) {
    user.reminders.push(newReminder);
    user.save()
      .then(async (updatedUser) => {
        await updatedUser.populate('reminders.type').execPopulate();
        sendResponse(res, 201, updatedUser.reminders);
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
 *  /api/reminders/{reminderId}:
 *    put:
 *      security:
 *        - BearerAuth: []
 *      tags: [reminders]
 *      summary: Update a reminder.
 *      description: Update a reminder for the user contained in the required JSON Web Token. This 
 *        action can only be performed by an authenticated user.
 *      operationId: updateReminder
 *      parameters:
 *        - in: path
 *          name: reminderId
 *          required: true
 *          description: The Object Id of the reminder to be updated.
 *          schema:
 *            type: string
 *            format: objectId
 *          example: 6058319d6aedde248dbad720
 *      requestBody:
 *        description: Reminder
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Reminder'
 *      responses:
 *        200:
 *          description: Updated list of reminders.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Reminder'
 *        400:
 *          $ref: '#/components/responses/400BadRequest'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        404:
 *          description: Not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error: 
 *                    type: string
 *                    example: Reminder with id does not exist.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.put('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  const userId = req.tokenPayload.id;
  const user = await User.findById(userId);

  if (user) {
    const reminder = user.reminders.id(id);

    if (reminder) {
      const updatedReminder = partialUpdate(reminder, updatedFields);
      user.save()
        .then(async (updatedUser) => {
          await updatedUser.populate('reminders.type').execPopulate();
          sendResponse(res, 200, updatedUser.reminders);
        })
        .catch(err => {
          sendError(res, err, err.message);
        });
    } else {
      sendError(res, 404, `Reminder with id ${id} does not exist.`);
    }
  } else {
    sendError(res, 500, 'Server failed to fetch this user.');
  }
});

/**
 * @openapi
 * 
 * paths:
 *  /api/reminders/{reminderId}:
 *    delete:
 *      security:
 *        - BearerAuth: []
 *      tags: [reminders]
 *      summary: Delete a reminder.
 *      description: Delete a reminder by id for the user contained in the required JSON Web Token.
 *        This action can only be performed by an authenticated user.
 *      operationId: deleteReminder
 *      parameters:
 *        - in: path
 *          name: reminderId
 *          required: true
 *          description: The Object Id of the reminder to be deleted.
 *          schema:
 *            type: string
 *            format: objectId
 *          example: 6058319d6aedde248dbad720
 *      responses:
 *        200:
 *          description: Updated list of reminders.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Reminder'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        404:
 *          description: Not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error: 
 *                    type: string
 *                    example: Reminder with id does not exist.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.tokenPayload.id;
  const user = await User.findById(userId);

  if (user) {
    deleteReminder(user, id, res);
  } else {
    sendError(res, 500, 'Server failed to fetch this user.');
  }
});

/**
 * Delete the remainder with the given id from the user document.
 * 
 * @param {Document} user Mongoose user document.
 * @param {String} reminderId Reminder Object Id.
 * @param {Object} resp Express response object.
 */
const deleteReminder = (user, reminderId, res) => {
  const reminder = user.reminders.id(reminderId);

  if (reminder) {
    reminder.remove();

    user.save()
      .then(async () => {
        await user.populate('reminders.type').execPopulate();
        sendResponse(res, 200, user.reminders);
      })
      .catch((err) => {
        sendError(res, err, err.message);
      });
  } else {
    sendError(res, 404, `Reminder with id ${reminderId} does not exist.`);
  }
};

module.exports = {
  reminderRouter: router,
}