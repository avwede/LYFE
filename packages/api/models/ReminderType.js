const mongoose = require('mongoose');

/**
 * @openapi
 * 
 * components:
 *  schemas:
 *    ReminderType:
 *      title: ReminderType
 *      type: object
 *      required:
 *        - type
 *        - user
 *      properties:
 *        type:
 *          type: string
 *          example: Class
 *        color:
 *          type: string
 *          example: '#001C5C'
 *        user:
 *          type: string
 *          format: objectId
 *          example: 5b1ed13e8cea93c6ba72b1da
 */
const reminderTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Type is required for Reminder Type.'],
  },
  color: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User Id is required for Reminder Type.'],
  },
});

module.exports = mongoose.model('ReminderType', reminderTypeSchema);
