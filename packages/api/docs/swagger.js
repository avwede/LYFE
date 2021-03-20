require('dotenv').config();

const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerJSDocOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'LYFE REST API',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'users',
        description: 'Create and manage users and user sessions.',
      }
    ],
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerJSDocOptions);

module.exports = {
  swagger: (server) => {
    server.use(
      '/api/docs',
      swaggerUI.serve,
      swaggerUI.setup(swaggerSpec)
    );
  },
};
