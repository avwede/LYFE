const mongoose = require('mongoose');
const reviewSchema = require('./Review');
const { Schema, model } = mongoose;

const professorSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
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
      message: '{VALUE} is not a valid email address',
    },
  },
  office: locationSchema,
  rating: Number,
  difficulty: Number,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  reviews: [reviewSchema],
});

module.exports = model('Professor', professorSchema);
