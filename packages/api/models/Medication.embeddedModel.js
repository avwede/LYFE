const mongoose = require('mongoose');
const reminderSchema = require('./Reminder.embeddedModel');

/**
 * @openapi
 * 
 * components:
 *  schemas:
 *    Medication:
 *      title: Medication
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          example: Naproxen
 *        dosage:
 *          type: string
 *          example: 1 tablet (500mg)
 *        frequency:
 *          type: string
 *          example: Twice a day
 *        reminder: 
 *          $ref: '#/components/schemas/Reminder'     
 */
const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required for Medication.'],
  },
  dosage: {
    type: String,
  },
  frequency: {
    type: String,
  },
  reminder: reminderSchema,
});

module.exports = medicationSchema;