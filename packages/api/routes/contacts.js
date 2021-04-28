const router = require('express').Router();
const { sendResponse, sendError } = require('../util/responses');
const contactUser = require('../models/User');
const { authenticateJWT } = require('../middleware/routerMiddleware');
const User = require('../models/User');

/**
 * @openapi
 * 
 * paths:
 *  /api/contacts:
 *    get:
 *      security:
 *        - BearerAuth: []
 *      tags: [contacts]
 *      summary: Get all emergency contacts.
 *      description:  Get all emergency contacts for the user contained in the required JSON Web Token. This 
 *        action can only be performed by an authenticated user.
 *      operationId: getContacts
 *      responses:
 *        200:
 *          description: List of emergency contacts successfully retrieved.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/EmergencyContact'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
 router.get('/', authenticateJWT, (req, res) => {
  const userId = req.tokenPayload.id;

  User.findById(userId, 'emergencyContacts')
    .then(results => {
      sendResponse(res, 200, results.emergencyContacts);
    })
    .catch(err => {
      sendError(res, err, err.message);
    });
});

/**
 * @openapi
 * 
 * paths:
 *  /api/contacts:
 *    post:
 *      security:
 *        - BearerAuth: []
 *      tags: [contacts]
 *      summary: Add an emergency contact.
 *      description:  Add an emergency contact to the user contained in the required JSON Web Token. This 
 *        action can only be performed by an authenticated user.
 *      operationId: addContact
 *      requestBody:
 *        description: Add contact.
 *        content: 
 *          application/json:
 *            schema: 
 *              $ref: '#/components/schemas/EmergencyContact'
 *        required: true
 *      responses:
 *        201:
 *          description: Updated list of contacts belonging to user.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/EmergencyContact'
 *        400:
 *          $ref: '#/components/responses/400BadRequest'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */

 router.post('/', authenticateJWT, async (req, res) => {
  const userId = req.tokenPayload.id;
  const newContact = req.body;
  const user = await User.findById(userId);

  if (user) {
    user.emergencyContacts.push(newContact);
    user
      .save()
      .then((updatedUser) => {
        sendResponse(res, 201, updatedUser.emergencyContacts);
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
 *  /api/contact/{contactId}:
 *    put:
 *      security:
 *        - BearerAuth: []
 *      tags: [contacts]
 *      summary: Update a contact.
 *      description: Update a contact for the user contained in the required JSON Web Token. This 
 *        action can only be performed by an authenticated user.
 *      operationId: updateContact
 *      parameters:
 *        - in: path
 *          name: contactId
 *          required: true
 *          description: The Object Id of the contact to be updated.
 *          schema:
 *            type: string
 *            format: objectId
 *          example: 6058319d6aedde248dbad720
 *      requestBody:
 *        description: Contact
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EmergencyContact'
 *      responses:
 *        200:
 *          description: Updated list of contacts belonging to user.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/EmergencyContact'
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
 *                    example: Contact with id does not exist.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */

 router.put('/:id', authenticateJWT, (req, res) => {
    const newContact = req.body;
    const {id} = req.tokenPayload;
    const contactId = req.params.id;

    contactUser.findById(id, function(err, result){
      if(err)
      {
        sendError(res, err, err.message);
      }
      else
      {
        result.updateContacts(contactId, newContact)
          .then(user => sendResponse(res, 200, user.emergencyContacts))
          .catch((err) => {
            sendError(res, err, 'The emergency contact could not be edited.');
          });
      }
  })
});

/**
 * @openapi
 * 
 * paths:
 *  /api/contacts/{contactId}:
 *    delete:
 *      security:
 *        - BearerAuth: []
 *      tags: [contacts]
 *      summary: Delete a contact.
 *      description: Delete a contact by id for the user contained in the required JSON Web Token.
 *        This action can only be performed by an authenticated user.
 *      operationId: deleteContact
 *      parameters:
 *        - in: path
 *          name: contactId
 *          required: true
 *          description: The Object Id of the contact to be deleted.
 *          schema:
 *            type: string
 *            format: objectId
 *          example: 6058319d6aedde248dbad720
 *      responses:
 *        200:
 *          description: Updated list of emergency contacts belonging to user.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/EmergencyContact'
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
 *                    example: Contact with id does not exist.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */

  router.delete('/:id', authenticateJWT, (req, res) => {
    const deleteId = req.params.id;
    const {id} = req.tokenPayload;
    contactUser.findByIdAndUpdate(id, {"$pull": { "emergencyContacts": {"_id": deleteId}}}, {new:true}, function(err, result){
      if (err)
      {
          sendError(res, err, err.message);
      }
      else
      {
        sendResponse(res, 200, result.emergencyContacts);
      }
    })
  });

module.exports = {
  contactsRouter: router,
}