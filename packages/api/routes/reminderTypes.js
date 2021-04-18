const router = require('express').Router();
const ReminderType = require('../models/ReminderType');
const { partialUpdate } = require('../util/queries');
const { sendResponse, sendError } = require('../util/responses');
const { authenticateJWT } = require('../middleware/routerMiddleware');

/**
 * @openapi
 * 
 * paths:
 *  /api/reminder-types:
 *    get:
 *      security:
 *        - BearerAuth: []
 *      tags: [reminders]
 *      summary: Get reminder types.
 *      description:  Get all reminder types for the user contained in the required JSON Web Token. 
 *        This action can only be performed by an authenticated user.
 *      operationId: getReminderTypes
 *      responses:
 *        200:
 *          description: List of reminder types successfully retrieved.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/ReminderType'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.tokenPayload.id;

  ReminderType.find({ user: userId })
    .then(results => {
      sendResponse(res, 200, results);
    })
    .catch(err => {
      console.log(err);
      sendError(res, err, err.message);
    });
});

/**
 * @openapi
 * 
 * paths:
 *  /api/reminder-types/{reminderTypeId}:
 *    get:
 *      security:
 *        - BearerAuth: []
 *      tags: [reminders]
 *      summary: Get reminder type by id.
 *      description:  Get a single reminder type for the user contained in the required JSON Web Token.
 *        This action can only be performed by an authenticated user.
 *      operationId: getReminderType
 *      parameters:
 *        - in: path
 *          name: reminderTypeId
 *          required: true
 *          description: The Object Id of the reminder type to be retrieved.
 *          schema:
 *            type: string
 *            format: objectId
 *          example: 6058319d6aedde248dbad720
 *      responses:
 *        200:
 *          description: Reminder Type successfully retrieved.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ReminderType'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        403:
 *          $ref: '#/components/responses/403Forbidden'
 *        404:
 *          description: Not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error: 
 *                    type: string
 *                    example: Reminder Type with id does not exist.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.get('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.tokenPayload.id;
  const reminderType = await ReminderType.findById(id);

  if (reminderType) {
    if (reminderType.user == userId)
      sendResponse(res, 200, reminderType);
    else
      sendError(res, 403, 'This user is not authorized to perform this action.');
  } else {
    sendError(res, 404, `Reminder Type with id ${id} does not exist.`);
  }
});

/**
 * @openapi
 * 
 * paths:
 *  /api/reminder-types:
 *    post:
 *      security:
 *        - BearerAuth: []
 *      tags: [reminders]
 *      summary: Create reminder type.
 *      description: Create a new reminder type for the user contained in the required JSON Web Token. 
 *        This action can only be performed by an authenticated user.
 *      operationId: createReminderType
 *      requestBody:
 *        description: ReminderType
 *        required: true
 *        content:
 *          application/json:
 *            title: Reminder Type
 *            type: object
 *            required:
 *              - type
 *            properties:
 *              type:
 *                type: string
 *                example: Class
 *              color:
 *                type: string
 *                example: '#001C5C'
 *      responses:
 *        201:
 *          description: New reminder type successfully created.
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
  const newReminderType = req.body;

  newReminderType['user'] = userId;

  ReminderType.create(newReminderType)
    .then(reminderType => {
      sendResponse(res, 201, reminderType);
    })
    .catch(err => {
      sendError(res, err, 'The reminder type could not be created.');
    });
});

/**
 * @openapi
 * 
 * paths:
 *  /api/reminder-types/{reminderTypeId}:
 *    put:
 *      security:
 *        - BearerAuth: []
 *      tags: [reminders]
 *      summary: Update a reminder type.
 *      description: Update a reminder type for the user contained in the required JSON Web Token. 
 *        This action can only be performed by an authenticated user.
 *      operationId: updateReminderType
 *      parameters:
 *        - in: path
 *          name: reminderTypeId
 *          required: true
 *          description: The Object Id of the reminder type to be updated.
 *          schema:
 *            type: string
 *            format: objectId
 *          example: 6058319d6aedde248dbad720
 *      requestBody:
 *        description: ReminderType
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReminderType'
 *      responses:
 *        200:
 *          description: Reminder type successfully updated.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ReminderType'
 *        400:
 *          $ref: '#/components/responses/400BadRequest'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        403:
 *          $ref: '#/components/responses/403Forbidden'
 *        404:
 *          description: Not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error: 
 *                    type: string
 *                    example: Reminder Type with id does not exist.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.put('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  const userId = req.tokenPayload.id;
  const reminderType = await ReminderType.findById(id);

  if (reminderType) {
    if (reminderType.user == userId) {
      const updatedReminderType = partialUpdate(reminderType, updatedFields);
      reminderType.save()
        .then(() => {
          sendResponse(res, 200, updatedReminderType);
        })
        .catch(err => {
          sendError(res, err, err.message);
        });
    }
    else {
      sendError(res, 403, 'This user is not authorized to perform this action.');
    }
  } else {
    sendError(res, 404, `Reminder Type with id ${id} does not exist.`);
  }
});

/**
 * @openapi
 * 
 * paths:
 *  /api/reminder-types/{reminderTypeId}:
 *    delete:
 *      security:
 *        - BearerAuth: []
 *      tags: [reminders]
 *      summary: Delete a reminder type.
 *      description: Delete a reminder type by id for the user contained in the required JSON Web 
 *        Token. This action can only be performed by an authenticated user.
 *      operationId: deleteReminder
 *      parameters:
 *        - in: path
 *          name: reminderTypeId
 *          required: true
 *          description: The Object Id of the reminder type to be deleted.
 *          schema:
 *            type: string
 *            format: objectId
 *          example: 6058319d6aedde248dbad720
 *      responses:
 *        204:
 *          description: Reminder type successfully deleted.
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        403:
 *          $ref: '#/components/responses/403Forbidden'
 *        404:
 *          description: Not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error: 
 *                    type: string
 *                    example: Reminder Type with id does not exist.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.tokenPayload.id;
  const reminderType = await ReminderType.findById(id);

  if (reminderType) {
    if (reminderType.user == userId) {
      deleteReminderType(id, res);
    } else {
      sendError(res, 403, 'This user is not authorized to perform this action.');
    }
  } else {
    sendError(res, 404, `Reminder Type with id ${id} does not exist.`);
  }
});

/**
 * Delete the remainder type with the given id.
 * 
 * @param {String} id Reminder type object id.
 * @param {Object} resp Express response object.
 */
const deleteReminderType = (id, res) => {
  ReminderType.findByIdAndRemove({ _id: id })
    .then(() => {
      sendResponse(res, 204, {});
    })
    .catch(err => {
      sendError(res, err, `The reminder type with id ${id} could not be removed.`);
    });
};

module.exports = {
  reminderTypeRouter: router,
};