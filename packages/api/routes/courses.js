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
 *      tags: [courses]
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
  
    courseUser.findByIdAndUpdate(id, {"$push": { "courses": newCourse}}, {new: true, runValidators : true}, function(err, result){
    
    if (err)
    {
      sendError(res, err, 'The course could not be created.');
    }
    else
    {
      sendResponse(res, 201, {"response": "Course was created."});
      //res.send(result)
    }
    
    })
  });

/**
 * @openapi
 * 
 * paths:
 *  /api/courses/editCourse:
 *    post:
 *      tags: [courses]
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
    const courseId = req.params.id;
    console.log(newCourse);
    courseUser.findById(id, function(err, result){
      if(err)
      {
        res.send(err)
      }
      else
      {
        result.updateCourses(courseId, newCourse)
          .then(user => res.send(user))
          .catch((err) => {
            sendError(res, err, 'The course could not be edited.');
          });
      }
  })
});

/**
 * @openapi
 * 
 * paths:
 *  /api/courses/deleteCourse:
 *    post:
 *      tags: [courses]
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

  router.post('/deleteCourse/:id', authenticateJWT, (req, res) => {
    const deleteId = req.params.id;
    //console.log(req.body);
    //console.log(req.tokenPayload);
    const {id} = req.tokenPayload;
    courseUser.findByIdAndUpdate(id, {"$pull": { "courses": {"_id": deleteId}}}, {new:true}, function(err, result){
      if (err)
      {
          res.send(err)
      }
      else
      {
        sendResponse(res, 201, {"response": "Course was deleted."});
      }
    })
  });

module.exports = {
  coursesRouter: router,
}