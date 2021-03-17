// routes

const express = require('express');
const router = express.Router();
const schema = reqiure('schema.js');

router.get('/schema.js', function(req, res)){
    schema.find(function())
}