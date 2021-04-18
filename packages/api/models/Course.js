const { urlencoded } = require('express');
const mongoose = require('mongoose');
const locationSchema = require('./Location.embeddedModel');

/**
 * @openapi
 * 
 * components:
 *  schemas:
 *    Courses:
 *      title: Courses
 *      type: object
 *      required:
 *        - courseCode
 *        - professor
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
 *        location:
 *          type: object
 *          $ref: '#/components/schemas/Location'
 *        day:
 *          type: [String]
 *          example: [Monday, Wednesday, Friday]
 *        start:
 *          type: Date
 *          example: 2013-04-03T12:56:26.009Z
 *        end:
 *          type: Date
 *          example: 2013-04-03T12:56:26.009Z
 */

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Course code is required for Course.'],
  },
  professor: {
    type: String,
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

module.exports = courseSchema;
