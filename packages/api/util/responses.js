/**
 * Format and send an HTTP response.
 *
 * @param {Object} res Express response object.
 * @param {Integer} status HTTP status code.
 * @param {Object} data JSON body.
 */
const sendResponse = (res, status, data) => {
  if (status === 204)
    return res.status(status).end();

  res.status(status);
  res.json(data);
};

/**
 * @openapi
 * 
 * components:
 *  responses:
 *    400BadRequest:
 *      description: Bad request.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *                example: "Validation failed: {Additional details}"
 *    401Unauthorized:
 *      description: Unauthorized.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *                example: Access denied. This request requires user authentication.
 *    403Forbidden:
 *      description: Forbidden.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *                example: This user is not authorized to perform this action.
 *    404NotFound:
 *      description: Not found.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *                example: The document with the given ID does not exist.
 *    500InternalServerError:
 *      description: Internal server error.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *                example: This action could not be completed.
 */

/**
 * Format and send an error HTTP response.
 *
 * @param {Object} res Express response object.
 * @param {Object|Integer} err Error object or HTTP status code.
 * @param {String} message User friendly message to send on response object.
 */
const sendError = (res, err, message) => {
  const statusCode = getStatusCode(err);
  const json = getErrorJson(err, message);

  res.status(statusCode);
  res.json(json);
};

/**
 * Get and return the correct HTTP status code.
 *
 * @param {Object|Integer} err Error object or HTTP status code.
 * @returns {Integer} The HTTP status code.
 */
const getStatusCode = (err) => {
  let statusCode = err;

  if (err.name === 'ValidationError' || err.code === 11000) statusCode = 400;
  if (err.name === 'CastError') statusCode = 404;

  return statusCode;
};

/**
 * Construct JSON body for HTTP error response.
 *
 * @param {Object|Integer} err Error object or HTTP status code.
 * @param {String} msg User friendly message to send on response object.
 * @returns {Object} JSON body.
 */
const getErrorJson = (err, msg) => {
  let errMsg = msg;

  if (err.name === 'ValidationError') errMsg = err.message;

  if (err.name === 'CastError')
    errMsg = 'The document with the given ID does not exist.';

  if (err.code === 11000) {
    errMsg = '';

    for (let key in err.keyValue)
      errMsg += `Duplicate Key: ${key} is already taken.`;
  }
    
  return { error: errMsg };
};

module.exports = {
  sendResponse,
  sendError,
};
