const router = require('express').Router();
//const Contact = require('./EmergencyContact.embeddedModel');
const Contact = require('../models/User');
const { sendResponse, sendError } = require('../util/responses');
const { generateJWT } = require('../middleware/routerMiddleware');
// add contact, edit contact, delete contact

/**
 * @openapi
 * 
 * paths:
 *  /api/users/add:
 *    post:
 *      tags: [users]
 *      description: Creates a new emergency contact and returns a signed JSON Web Token.
 *      operationId: createEmergencyContact
 *      requestBody:
 *        description: Contact to create.
 *        content: 
 *          application/json:
 *            schema: 
 *              $ref: '#/components/schemas/EmergencyContact'
 *        required: true
 *      responses:
 *        201:
 *          description: New Emergency Contact created.
 */

 router.post('/add', (req, res) => {
     const newContact = req.body;
    Contact.updateOne({"$push": { "emergenyContacts": newContact}})
    .catch((err) => {
        sendError(res, err, 'The contact could not be created.');
      });
  });

  router.post('/edit', (req, res) => {
    const newContact = req.body;
   Contact.updateOne({"$set": { "emergenyContacts": newContact}})
   .catch((err) => {
       sendError(res, err, 'The contact could not be created.');
     });
 });

 router.post('/delete', (req, res) => {
    const newContact = req.body;
   Contact.updateOne({"$pull": { "emergenyContacts": newContact}})
   .catch((err) => {
       sendError(res, err, 'The contact could not be created.');
     });
 });

  module.exports = {
    contactsRouter: router,
  }