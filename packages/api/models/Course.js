const { urlencoded } = require('express');
const mongoose = require('mongoose');
const locationSchema = require('./Location');

/**
 * @openapi
 * 
 * components:
 *  schemas:
 *    Courses:
 *      title: Courses
 *      type: array
 *      required:
 *        - courseCode
 *        - professor
 *        - link
 *        - location
 *        - day
 *        - start
 *        - end
 *      properties: 
 *        courseCode:
 *          type: string
 *          example: COP 4331
 *        professor:
 *          type: string
 *          example: Professor Szumlanski
 *        link:
 *          type: URL
 *          example: https://ucf.zoom.us/j/91549966557
 *        location:
 *          type: String
 *          example: HEC 110
 *        day:
 *          type: [String]
 *          example: [Monday, Wednesday, Friday]
 *        start:
 *          type: Date
 *          example: 11:00:00
 *        end:
 *          type: Date
 *          example: 12:15:00
 */

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: Number,
    required: [true, 'Course code is required for Course.'],
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReminderType',
    required: [true, 'Professor is required for Course.'],
  },
  link: {
    type: URL,
    required: [true, 'Zoom link is required for Course.'],
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
