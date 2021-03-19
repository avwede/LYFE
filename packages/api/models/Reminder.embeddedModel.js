const mongoose = require('mongoose');
const locationSchema = require('./Location.embeddedModel');

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

module.exports = mongoose.model('Reminder', reminderSchema);
