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
 *  /api/contacts/addContact:
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

 router.post('/addContact', authenticateJWT, (req, res) => {
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
   *  /api/contacts/editContact:
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

  router.post('/editContact/:id', authenticateJWT, (req, res) => {
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

 /**
 * @openapi
 * 
 * paths:
 *  /api/contacts/deleteContact:
 *    post:
 *      tags: [users]
 *      description: Deletes an emergency contact and returns a signed JSON Web Token.
 *      operationId: deleteEmergencyContact
 *      requestBody:
 *        description: Contact to delete.
 *        content: 
 *          application/json:
 *            schema: 
 *              $ref: '#/components/schemas/EmergencyContact'
 *        required: true
 *      responses:
 *        201:
 *          description: Emergency Contact deleted.
 */

  router.post('/deleteContact/:id', authenticateJWT, (req, res) => {
    const deleteId = req.params.id;
    //console.log(req.body);
    //console.log(req.tokenPayload);
    const {id} = req.tokenPayload;
    contactUser.findByIdAndUpdate(id, {"$pull": { "emergencyContacts": {"_id": deleteId}}}, {new:true}, function(err, result){
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

  module.exports = {
    contactsRouter: router,
  }