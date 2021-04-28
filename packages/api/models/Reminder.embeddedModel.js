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
 *        - startDate
 *      properties:
 *        name:
 *          type: string
 *          example: COP4331
 *        description:
 *          type: string
 *        type:
 *          $ref: '#/components/schemas/ReminderType'
 *        location:
 *          $ref: '#/components/schemas/Location'
 *        startDate:
 *          type: string
 *          format: date-time
 *        endDate:
 *          type: string
 *          format: date-time
 *        repeat:
 *          type: boolean
 *        dailyPattern:
 *          type: array
 *          items:
 *            type: string
 *            enum: [Sun, Mon, Tues, Wed, Thur, Fri, Sat]
 *            example: [Mon, Wed]
 *          summary: The days of the week that this reminder should repeat. Ex. [Mon, Wed, Fri]
 *        weeklyPattern:
 *          type: integer
 *          example: 1
 *          summary: The number of weeks that this reminder should repeat. Ex. Repeats every 2 weeks
 *          
 */
const reminderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required for Reminder.'],
  },
  description: {
    type: String,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReminderType',
  },
  location: locationSchema,
  startDate: {
    type: Date,
    required: [true, 'Start date is required for Reminder.'],
  },
  endDate: {
    type: Date,
  },
  repeat: Boolean,
  dailyPattern: {
    type: [String],
    enum: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
    default: undefined,
    required: [
      function () {
        return this.repeat;
      },
      'Daily pattern is required when Reminder repeats.',
    ],
  },
  weeklyPattern: {
    type: Number,
    min: [1, 'Weekly pattern for Reminder must be greater than 0.'],
    required: [
      function () {
        return this.repeat;
      },
      'Weekly pattern is required when Reminder repeats.',
    ],
  },
});

module.exports = reminderSchema;
