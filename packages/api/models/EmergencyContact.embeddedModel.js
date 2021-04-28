const mongoose = require('mongoose');

/**
 * @openapi
 * 
 * components:
 *  schemas:
 *    EmergencyContact:
 *      title: Emergency Contact
 *      type: object
 *      required:
 *        - firstName
 *        - lastName
 *        - phoneNumber
 *        - email
 *        - relation
 *      properties:
 *        firstName:
 *          type: string
 *          example: John
 *        lastName:
 *          type: string
 *          example: Smith
 *        phoneNumber:
 *          type: string
 *          example: 123-123-7878
 *        email:
 *          type: string
 *          format: email
 *        relation:
 *          type: string
 *          example: Dad
 */
const emergencyContactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required for Emergency Contact.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required for Emergency Contact.'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required for Emergency Contact.'],
  },
  email: {
    type: String,
    validate: {
      validator: (val) =>
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(
          val
        ),
      message: '{VALUE} is not a valid email address.',
    },
    required: [true, 'Email is required for Emergency Contact.'],
  },
  relation: {
    type: String,
    required: [true, 'Relation is required for Emergency Contact.'],
  },
});

module.exports = emergencyContactSchema;
