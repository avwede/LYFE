const mongoose = require('mongoose');
const locationSchema = require('./Location.embeddedModel');

/**
 * @openapi
 * 
 * components:
 *  schemas:
 *    Reminder:
 *      title: Reminder
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          example: Doctor's Appointment
 *        description:
 *          type: string
 *        type:
 *          type: string
 *          format: objectId
 *          example: 5b1ed13e8cea93c6ba72b1da
 *        location:
 *          $ref: '#/components/schemas/Location'
 *        datetime:
 *          type: array
 *          items:
 *            type: string
 *            format: date
 *        repeat:
 *          type: boolean
 */
const reminderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required for Reminder.'],
  },
  description: String,
  type: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ReminderType' 
  },
  location: locationSchema,
  // How to model? Can either be a single date like March 15, 2021 or days of the week like MWF
  datetime: [Date],
  repeat: Boolean,
});

module.exports = reminderSchema;
