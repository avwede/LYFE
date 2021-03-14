const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reminderTypeSchema = new Schema({
  type: String,
  color: String
});

module.exports = model('ReminderType', reminderTypeSchema);
