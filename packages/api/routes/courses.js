const router = require('express').Router();
const User = require('../models/User');
const courseUser = require('../models/User');
const { sendResponse, sendError } = require('../util/responses');
const { generateJWT, authenticateJWT } = require('../middleware/routerMiddleware');

/**
 * @openapi
 * 
 * paths:
 *  /api/courses:
 *    get:
 *      security:
 *        - BearerAuth: []
 *      tags: [courses]
 *      summary: Get all courses.
 *      description:  Get all courses for the user contained in the required JSON Web Token. This 
 *        action can only be performed by an authenticated user.
 *      operationId: getCourses
 *      responses:
 *        200:
 *          description: List of courses successfully retrieved.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Courses'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */
 router.get('/', authenticateJWT, (req, res) => {
  const userId = req.tokenPayload.id;

  User.findById(userId, 'courses')
    .then(results => {
      sendResponse(res, 200, results.courses);
    })
    .catch(err => {
      sendError(res, err, err.message);
    });
});


/**
 * @openapi
 * 
 * paths:
 *  /api/courses:
 *    post:
 *      security:
 *        - BearerAuth: []
 *      tags: [courses]
 *      summary: Add a course.
 *      description:  Add a course to the user contained in the required JSON Web Token. This 
 *        action can only be performed by an authenticated user.
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
 *          description: Updated list of courses belonging to user.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Courses'
 *        400:
 *          $ref: '#/components/responses/400BadRequest'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */

 router.post('/', authenticateJWT, async (req, res) => {
  const userId = req.tokenPayload.id;
  const newCourse = req.body;
  const user = await User.findById(userId);

  if (user) {
    user.courses.push(newCourse);
    user
      .save()
      .then((updatedUser) => {
        sendResponse(res, 201, updatedUser.courses);
      })
      .catch((err) => {
        sendError(res, err, err.message);
      });
  } else {
    sendError(res, 500, 'Server failed to fetch this user.');
  }
});

/**
 * @openapi
 * 
 * paths:
 *  /api/courses/{courseId}:
 *    put:
 *      security:
 *        - BearerAuth: []
 *      tags: [courses]
 *      summary: Update a course.
 *      description: Update a course for the user contained in the required JSON Web Token. This 
 *        action can only be performed by an authenticated user.
 *      operationId: updateCourse
 *      parameters:
 *        - in: path
 *          name: courseId
 *          required: true
 *          description: The Object Id of the course to be updated.
 *          schema:
 *            type: string
 *            format: objectId
 *          example: 6058319d6aedde248dbad720
 *      requestBody:
 *        description: Course
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Courses'
 *      responses:
 *        200:
 *          description: Updated list of courses belonging to user.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Courses'
 *        400:
 *          $ref: '#/components/responses/400BadRequest'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        404:
 *          description: Not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error: 
 *                    type: string
 *                    example: Course with id does not exist.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */

 router.put('/:id', authenticateJWT, (req, res) => {
    const newCourse = req.body;
    const {id} = req.tokenPayload;
    const courseId = req.params.id;

    courseUser.findById(id, function(err, result){
      if(err)
      {
        sendError(res, err, err.message);
      }
      else
      {
        result.updateCourses(courseId, newCourse)
          .then(user => sendResponse(res, 200, user.courses))
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
 *  /api/courses/{courseId}:
 *    delete:
 *      security:
 *        - BearerAuth: []
 *      tags: [courses]
 *      summary: Delete a course.
 *      description: Delete a course by id for the user contained in the required JSON Web Token.
 *        This action can only be performed by an authenticated user.
 *      operationId: deleteCourse
 *      parameters:
 *        - in: path
 *          name: courseId
 *          required: true
 *          description: The Object Id of the course to be deleted.
 *          schema:
 *            type: string
 *            format: objectId
 *          example: 6058319d6aedde248dbad720
 *      responses:
 *        200:
 *          description: Updated list of courses belonging to user.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Courses'
 *        401:
 *          $ref: '#/components/responses/401Unauthorized'
 *        404:
 *          description: Not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error: 
 *                    type: string
 *                    example: Course with id does not exist.
 *        500:
 *          $ref: '#/components/responses/500InternalServerError'
 */

  router.delete('/:id', authenticateJWT, (req, res) => {
    const deleteId = req.params.id;
    const {id} = req.tokenPayload;
    courseUser.findByIdAndUpdate(id, {"$pull": { "courses": {"_id": deleteId}}}, {new:true}, function(err, result){
      if (err)
      {
          sendError(res, err, err.message);
      }
      else
      {
        sendResponse(res, 200, result.courses);
      }
    })
  });

module.exports = {
  coursesRouter: router,
}