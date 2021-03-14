const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const locationSchema = new Schema({
  type: {
    type: String,
    enum: ['Address', 'Link'],
    required: [true, 'Type is required.'],
  },
  // How to model? Can be a physical location or a link (like a Zoom link)
  location: String,
});

module.exports = model('Location', locationSchema);
