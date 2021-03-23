const router = require('express').Router();
const Contact = require('./EmergencyContact.embeddedModel');
const { sendResponse, sendError } = require('../util/responses');
const { generateJWT } = require('../middleware/routerMiddleware');
// add contact, edit contact, delete contact

/**
 * @openapi
 * 
 * paths:
 *  /api/users/emergencycontacts:
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

 router.post('/add', (req, res) => {
    const newContact = req.body;
  
    Contact.create(newContact)
      .then(({ _id }) => {
        const token = generateJWT({ id: _id });
        sendResponse(res, 201, { token });
      })
      .catch((err) => {
        sendError(res, err, 'The user could not be created.');
      });
  });