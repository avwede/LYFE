const router = require('express').Router();
const emergencyContactSchema = require('../models/EmergencyContact.embeddedModel');
const contactUser = require('../models/User');
const { sendResponse, sendError } = require('../util/responses');
const { generateJWT, authenticateJWT } = require('../middleware/routerMiddleware');
// add contact, edit contact, delete contact

/**
 * @openapi
 * 
 * paths:
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