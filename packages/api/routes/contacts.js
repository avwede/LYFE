const router = require('express').Router();
const { sendResponse, sendError } = require('../util/responses');
const contactUser = require('../models/User');
const { generateJWT, authenticateJWT } = require('../middleware/routerMiddleware');
// add contact, edit contact, delete contact

/**
 * @openapi
 * 
 * paths:
 *  /api/contacts/addContact:
 *    post:
 *      tags: [contacts]
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
     const {id} = req.tokenPayload;
     console.log(newContact);
     console.log(id);

     contactUser.findByIdAndUpdate(id, {"$push": { "emergencyContacts": newContact}}, {new: true, runValidators : true}, function(err, result){
    
    if (err)
    {
       sendError(res, err, 'The contact could not be created.');
    }
    else
    {
      sendResponse(res, 201, {"response": "Contact was created."});
    }
    
  })
  });

  /**
   * @openapi
   * 
   * paths:
   *  /api/contacts/editContact:
   *    post:
   *      tags: [contacts]
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
          .catch((err) => {
            sendError(res, err, err.message);
          });
      }
    })
 });

 /**
 * @openapi
 * 
 * paths:
 *  /api/contacts/deleteContact:
 *    post:
 *      tags: [contacts]
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
        sendError(res, err, 'The contact could not be deleted.');
      }
      else
      {
        sendResponse(res, 201, {"response": "Contact was deleted."});
      }
    })
  });

  module.exports = {
    contactsRouter: router,
  }
