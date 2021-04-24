const mongoose = require('mongoose');

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    Location:
 *      title: Location
 *      type: object
 *      required:
 *        - type
 *      properties:
 *        type:
 *          type: string
 *          enum: [Classroom Location, Zoom Link]
 *        location:
 *          type: string
 *          example: Classroom Location 2 Room 101
 *
 */
const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Classroom Location', 'Zoom Link'],
    required: [true, 'Type is required for Location.'],
  },
  location: String,
});

module.exports = locationSchema;