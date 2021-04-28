const mongoose = require('mongoose');
const emergencyContactSchema = require('./EmergencyContact.embeddedModel');
const medicationSchema = require('./Medication.embeddedModel');

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    Health:
 *      title: Health
 *      type: object
 *      properties:
 *        dateOfBirth:
 *          type: string
 *          format: date
 *        height:
 *          type: integer
 *          example: 70
 *          summary: The height in inches.
 *        weight:
 *          type: integer
 *          example: 200
 *          summary: The weight in lbs.
 *        gender:
 *          type: string,
 *          enum: [Male, Female, Non-Binary, Prefer not to say]
 *          example: Male
 *        bloodType:
 *          type:  string,
 *          enum: [A+, A-, AB+, AB-, B+, B-, O+, O-, Unknown]
 *          example: B+
 *        allergies:
 *          type: array
 *          items:
 *            type: string
 *          example: ['Peanuts']
 *        healthConditions:
 *          type: array
 *          items:
 *            type: string
 *          example: ['Asthma', 'High Blood Pressure']
 *        medications:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Medication'
 *        additionalInformation:
 *          type: string
 *        emergencyContacts:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/EmergencyContact'
 */
const healthSchema = new mongoose.Schema({
  dateOfBirth: Date,
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Non-Binary', 'Prefer not to say'],
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-', 'Unknown'],
  },
  allergies: [String],
  healthConditions: [String],
  medications: [medicationSchema],
  additionalInformation: {
    type: String,
  },
  emergencyContacts: [emergencyContactSchema],
});

module.exports = healthSchema;
