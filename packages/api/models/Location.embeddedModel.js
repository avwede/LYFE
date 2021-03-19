const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Address', 'Link'],
    required: [true, 'Type is required for Location.'],
  },
  // How to model? Can be a physical location or a link (like a Zoom link)
  location: String,
});

module.exports = mongoose.model('Location', locationSchema);
