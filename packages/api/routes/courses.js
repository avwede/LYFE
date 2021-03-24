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
  
    Course.create(newCourse)
      .then(({ _id }) => {
        const token = generateJWT({ id: _id });
        sendResponse(res, 201, { token });
      })
      .catch((err) => {
        sendError(res, err, 'The course could not be created.');
      });
  });

  router.post('/editCourse', (req, res) => {

  });
  
  router.post('/deleteCourse', (req, res) => {

  });


module.exports = {
  userRouter: router,
}