/**
 * Generate API Gateway response
 */
const response = (statusCode, body, headers = {}) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Credentials': true,
      ...headers,
    },
    body: JSON.stringify(body),
  };
};

const successResponse = (data) => response(200, data);

const errorResponse = (statusCode, message) =>
  response(statusCode, { error: message });

const badRequestResponse = (message) => errorResponse(400, message);

const notFoundResponse = (message = 'Resource not found') =>
  errorResponse(404, message);

const serverErrorResponse = (message = 'Internal server error') =>
  errorResponse(500, message);

module.exports = {
  response,
  successResponse,
  errorResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
};
