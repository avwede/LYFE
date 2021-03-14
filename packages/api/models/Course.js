const mongoose = require('mongoose');
const locationSchema = require('./Location');
const { Schema, model } = mongoose;

const courseSchema = new Schema({
  subject: {
    type: String,
    required: [true, 'Course subject is required.'],
  },
  courseNumber: {
    type: Number,
    required: [true, 'Course number is required.'],
  },
  classNumber: {
    type: Number,
    required: [true, 'Class number is required.'],
  },
  section: {
    type: String,
    required: [true, 'Course section is required.'],
  },
  name: {
    type: String,
    required: [true, 'Course name is required.'],
  },
  description: String,
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReminderType',
    required: [true, 'Professor is required.'],
  },
  location: locationSchema,
  day: {
    type: [String],
    required: [true, 'Meeting day(s) is required.'],
  },
  start: {
    type: Date,
    required: [true, 'Start date is required.'],
  },
  end: {
    type: Date,
    required: [true, 'End date is required.'],
  },
});

module.exports = model('Course', courseSchema);
