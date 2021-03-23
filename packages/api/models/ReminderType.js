const mongoose = require('mongoose');

const reminderTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Type is required for Reminder Type.'],
  },
  color: String,
});

module.exports = mongoose.model('ReminderType', reminderTypeSchema);
