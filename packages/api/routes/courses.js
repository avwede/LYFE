// school.js

const router = require('express').Router();
const Course = require('../models/Course');
const courseUser = require('../models/User');
const { sendResponse, sendError } = require('../util/responses');
const { generateJWT, authenticateJWT } = require('../middleware/routerMiddleware');


/**
 * @openapi
 * 
 * paths:
 *  /api/courses/addCourse:
 *    post:
 *      tags: [users]
 *      description: Adds a course to the users account.
 *      operationId: addCourse
 *      requestBody:
 *        description: Add course.
 *        content: 
 *          application/json:
 *            schema: 
 *              $ref: '#/components/schemas/Courses'
 *        required: true
 *      responses:
 *        201:
 *          description: New course added.
 */

 router.post('/addCourse', authenticateJWT, (req, res) => {
    const newCourse = req.body;
    const {id} = req.tokenPayload;
  
    courseUser.findByIdAndUpdate(id, {"$push": { "courses": newCourse}}, {new: true}, function(err, result){
    
    if (err)
    {
      res.send(err)
    }
    else
    {
      res.send(result)
    }
    
    })
  });

/**
 * @openapi
 * 
 * paths:
 *  /api/courses/editCourse:
 *    post:
 *      tags: [users]
 *      description: Edits a course within the users account.
 *      operationId: editCourse
 *      requestBody:
 *        description: Edit course.
 *        content: 
 *          application/json:
 *            schema: 
 *              $ref: '#/components/schemas/Courses'
 *        required: true
 *      responses:
 *        201:
 *          description: Course edited.
 */

 router.post('/editCourse/:id', authenticateJWT, (req, res) => {
    const newCourse = req.body;
    const {id} = req.tokenPayload;
    const coursetId = req.params.id;

    courseUser.findById(id, function(err, result){
      if(err)
      {
        res.send(err)
      }
      else
      {
        result.findByIdAndUpdate(courseId, {"$set": { "courses": editCourse}}, {new: true}, function(err, result){
          if (err)
          {
            res.send(err)
          }
          else
          {
            res.send(result)
          }
        })
      }
  })
});

/**
 * @openapi
 * 
 * paths:
 *  /api/courses/deleteCourse:
 *    post:
 *      tags: [users]
 *      description: Deletes a course to the users account.
 *      operationId: deleteCourse
 *      requestBody:
 *        description: Delete course.
 *        content: 
 *          application/json:
 *            schema: 
 *              $ref: '#/components/schemas/Courses'
 *        required: true
 *      responses:
 *        201:
 *          description: Course deleted.
 */

router.post('/deleteCourse', authenticateJWT, (req, res) => {
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