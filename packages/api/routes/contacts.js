const router = require('express').Router();
const { sendResponse, sendError } = require('../util/responses');
const contactUser = require('../models/User');
const { generateJWT, authenticateJWT } = require('../middleware/routerMiddleware');
const User = require('../models/User');
// add contact, edit contact, delete contact

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




// /**
//  * @openapi
//  * 
//  * paths:
//  *  /api/contacts/addContact:
//  *    post:
//  *      tags: [contacts]
//  *      description: Creates a new emergency contact and returns a signed JSON Web Token.
//  *      operationId: createEmergencyContact
//  *      requestBody:
//  *        description: Contact to create.
//  *        content: 
//  *          application/json:
//  *            schema: 
//  *              $ref: '#/components/schemas/EmergencyContact'
//  *        required: true
//  *      responses:
//  *        201:
//  *          description: New Emergency Contact created.
//  */


//  router.post('/addContact', authenticateJWT, (req, res) => {
//      const newContact = req.body;
//      const {id} = req.tokenPayload;
//      console.log(newContact);
//      console.log(id);

//      contactUser.findByIdAndUpdate(id, {"$push": { "emergencyContacts": newContact}}, {new: true, runValidators : true}, function(err, result){
    
//     if (err)
//     {
//        sendError(res, err, 'The contact could not be created.');
//     }
//     else
//     {
//       sendResponse(res, 201, {"response": "Contact was created."});
//     }
    
//   })
//   });

//   /**
//    * @openapi
//    * 
//    * paths:
//    *  /api/contacts/editContact:
//    *    post:
//    *      tags: [contacts]
//    *      description: Edits an emergency contact and returns a signed JSON Web Token.
//    *      operationId: editEmergencyContact
//    *      requestBody:
//    *        description: Contact to edit.
//    *        content: 
//    *          application/json:
//    *            schema: 
//    *              $ref: '#/components/schemas/EmergencyContact'
//    *        required: true
//    *      responses:
//    *        201:
//    *          description: Emergency Contact edited.
//    */

//   router.post('/editContact/:id', authenticateJWT, (req, res) => {
//     const editContact = req.body;
//     console.log(req.body);
//     console.log(req.params);
//     const {id} = req.tokenPayload;
//     const contactId = req.params.id;
//     contactUser.findById(id, function(err, result){
//       if(err)
//       {
//         res.send(err)
//       }
//       else
//       {
//         result.updateContacts(contactId, editContact)
//           .then(user => res.send(user))
//           .catch((err) => {
//             sendError(res, err, err.message);
//           });
//       }
//     })
//  });

//  /**
//  * @openapi
//  * 
//  * paths:
//  *  /api/contacts/deleteContact:
//  *    post:
//  *      tags: [contacts]
//  *      description: Deletes an emergency contact and returns a signed JSON Web Token.
//  *      operationId: deleteEmergencyContact
//  *      requestBody:
//  *        description: Contact to delete.
//  *        content: 
//  *          application/json:
//  *            schema: 
//  *              $ref: '#/components/schemas/EmergencyContact'
//  *        required: true
//  *      responses:
//  *        201:
//  *          description: Emergency Contact deleted.
//  */

//   router.post('/deleteContact/:id', authenticateJWT, (req, res) => {
//     const deleteId = req.params.id;
//     //console.log(req.body);
//     //console.log(req.tokenPayload);
//     const {id} = req.tokenPayload;
//     contactUser.findByIdAndUpdate(id, {"$pull": { "emergencyContacts": {"_id": deleteId}}}, {new:true}, function(err, result){
//       if (err)
//       {
//         sendError(res, err, 'The contact could not be deleted.');
//       }
//       else
//       {
//         sendResponse(res, 201, {"response": "Contact was deleted."});
//       }
//     })
//   });

//   module.exports = {
//     contactsRouter: router,
//   }
