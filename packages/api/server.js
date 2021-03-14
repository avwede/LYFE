require('dotenv').config();

const express = require('express');
const path = require('path');
const server = express();
const { PORT, NODE_ENV } = process.env;

// In production routes outside of the api are redirected to client.
if (NODE_ENV == 'production') {
  server.use(express.static('../client/build'));
  server.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../client/build', 'index.html')
    );
    console.log(path.resolve(__dirname, '../client/build', 'index.html'));
  });
} else {
  server.get('*', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send('{"message": "In production this action will result in a redirect to the client."}');
  });
}

server.listen(PORT, () => {
  console.log(`\n*** Server listening on port ${PORT} ***\n`);
});