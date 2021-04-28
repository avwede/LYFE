require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const { NODE_ENV } = process.env;

module.exports = {
  serverMiddleware: (server) => {
    server.use(cors());
    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());
    
    // In production serve client build as static files.
    if (NODE_ENV === 'production') {
      server.use(express.static(path.resolve(__dirname, '../../client/build')));
    }
  },
};