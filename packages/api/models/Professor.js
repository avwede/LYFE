const mongoose = require('mongoose');
const reviewSchema = require('./Review');

const professorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required for Professor.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required for Professor.'],
  },
  department: String,
  email: {
    type: String,
    unique: true,
    validate: {
      validator: (val) =>
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(
          val
        ),
      message: '{VALUE} is not a valid email address.',
    },
  },
  office: locationSchema,
  rating: Number,
  difficulty: Number,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  reviews: [reviewSchema],
});

module.exports = mongoose.model('Professor', professorSchema);
