require('dotenv').config();

const mongoose = require('mongoose');
const server = require('express')();
const setupMiddleware = require('./middleware/serverMiddleware').serverMiddleware;
const setupRoutes = require('./routes/routes').routes;
const setupDocs = require('./docs/swagger').swagger;
const { MONGODB_URI, PORT } = process.env;

// Apply server level middleware.
setupMiddleware(server);

// Setup api documentation.
setupDocs(server);

// Setup api routes.
setupRoutes(server);


// Setup database connection.
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`\n*** Connected to database ${MONGODB_URI} ***\n`);
    server.listen(PORT, () => {
      console.log(`\n*** Server listening on port ${PORT} ***\n`);
    });
  })
  .catch((err) => {
    console.log('\n*** Error connecting to database ***\n', err);
  });