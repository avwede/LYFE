// school.js

const router = require('express').Router();
const Course = require('../models/Course');
const { sendResponse, sendError } = require('../util/responses');
const { generateJWT } = require('../middleware/routerMiddleware');

/**
 * @openapi
 * 
 * paths:
 *  /api/courses:
 *    post:
 *      tags: [users]
 *      description: Adds a course to the users account.
 *      operationId: addCourse
 *      requestBody:
 *        description: Add course.
 *        content: 
 *          application/json:
 *            schema: 
 *              $ref: '#/components/schemas/User'
 *        required: true
 *      responses:
 *        201:
 *          description: New course added.
 */

 router.post('/addCourse', (req, res) => {
    const newCourse = req.body;
  
    Contact.updateOne({"$push": { "courses": newCourse}})
    .catch((err) => {
        sendError(res, err, 'The course could not be added.');
      });
  });

  router.post('/editCourse', (req, res) => {
    Course.findByIdAndUpdate({ _id }, req, function(err, result){
        if (err){
          sendError(res, '401', 'Could not edit course.');
        }
        else {
          sendResponse(res, 200, result);
        }
      })
  });
  
  router.post('/deleteCourse', (req, res) => {
    Course.findByIdAndDelete({ _id }, req, function(err, result){
      if (err){
        sendError(res, '401', 'Could not delete course.');
      }
      else {
        sendResponse(res, 200, result);
      }
    })
  });


module.exports = {
  coursesRouter: router,
}