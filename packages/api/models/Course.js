const mongoose = require('mongoose');
const locationSchema = require('./Location');

const courseSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required for Course.'],
  },
  courseNumber: {
    type: Number,
    required: [true, 'Course number is required for Course.'],
  },
  classNumber: {
    type: Number,
    required: [true, 'Class number is required for Course.'],
  },
  section: {
    type: String,
    required: [true, 'Section is required for Course.'],
  },
  name: {
    type: String,
    required: [true, 'Name is required for Course.'],
  },
  description: String,
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReminderType',
    required: [true, 'Professor is required for Course.'],
  },
  location: locationSchema,
  day: {
    type: [String],
    required: [true, 'Meeting day(s) is required for Course.'],
  },
  start: {
    type: Date,
    required: [true, 'Start date is required for Course.'],
  },
  end: {
    type: Date,
    required: [true, 'End date is required for Course.'],
  },
});

module.exports = mongoose.model('Course', courseSchema);
