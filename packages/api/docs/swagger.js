require('dotenv').config();

const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const { APP_URL, NODE_ENV, PORT } = process.env;

const servers = [
  {
    url: APP_URL,
    description: 'Production server',
  },
];

if (NODE_ENV === 'development') {
  servers.unshift({
    url: `http://localhost:${PORT}`,
    description: 'Development server',
  });
}

const swaggerJSDocOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'LYFE REST API',
      version: '1.0.0',
    },
    servers: servers,
    tags: [
      {
        name: 'users',
        description: 'Create and manage users and user sessions.',
      },
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
