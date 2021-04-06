const router = require('express').Router();
<<<<<<< HEAD
const Contact = require('./EmergencyContact.embeddedModel');
const { sendResponse, sendError } = require('../util/responses');
const { generateJWT } = require('../middleware/routerMiddleware');
=======
const emergencyContactSchema = require('../models/EmergencyContact.embeddedModel');
const contactUser = require('../models/User');
const { sendResponse, sendError } = require('../util/responses');
const { generateJWT, authenticateJWT } = require('../middleware/routerMiddleware');
>>>>>>> 960b6fb30cdc945633f05c47cc2006128786d75a
// add contact, edit contact, delete contact

/**
 * @openapi
 * 
 * paths:
<<<<<<< HEAD
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
=======
 *  /api/contacts/add:
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

 router.post('/add', authenticateJWT, (req, res) => {
     const newContact = req.body;
     //console.log(req.body);
     //console.log(req.tokenPayload);
     const {id} = req.tokenPayload;
     contactUser.findByIdAndUpdate(id, {"$push": { "emergencyContacts": newContact}}, {new:true}, function(err, result){
    
    if (err)
     {
       res.send(err)
     }
    else
    {
      res.send(result)
    }
  })
  });

  /**
   * @openapi
   * 
   * paths:
   *  /api/contacts/edit:
   *    post:
   *      tags: [users]
   *      description: Edits an emergency contact and returns a signed JSON Web Token.
   *      operationId: editEmergencyContact
   *      requestBody:
   *        description: Contact to edit.
   *        content: 
   *          application/json:
   *            schema: 
   *              $ref: '#/components/schemas/EmergencyContact'
   *        required: true
   *      responses:
   *        201:
   *          description: Emergency Contact edited.
   */

  router.post('/edit/:id', authenticateJWT, (req, res) => {
    const editContact = req.body;
    console.log(req.body);
    console.log(req.params);
    const {id} = req.tokenPayload;
    const contactId = req.params.id;
    contactUser.findById(id, function(err, result){
      if(err)
      {
        res.send(err)
      }
      else
      {
        result.updateContacts(contactId, editContact)
          .then(user => res.send(user))
      }
    })
 });
/*
 router.post('/delete', (req, res) => {
    const newContact = req.body;
    emergencyContactSchema.updateOne({"$pull": { "emergenyContacts": newContact}})
   .catch((err) => {
       sendError(res, err, 'The contact could not be created.');
     });
 });*/

  module.exports = {
    contactsRouter: router,
  }
>>>>>>> 960b6fb30cdc945633f05c47cc2006128786d75a
