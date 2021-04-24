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
 *          example: Classroom Building 2 Room 101
 *        
 */
const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Classroom Location', 'Zoom Link'],
    required: [true, 'Type is required for Location.'],
  },
  // How to model? Can be a physical location or a link (like a Zoom link)
  location: String,
});

module.exports = locationSchema;
