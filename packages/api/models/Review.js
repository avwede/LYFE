const mongoose = require('mongoose');
const courseSchema = require('./Course');
const { Schema, model } = mongoose;

const reviewSchema = new Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required.'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required.'],
  },
  difficulty: {
    type: Number,
    required: [true, 'Difficulty is required.'],
  },
  review: {
    type: String,
    required: [true, 'Review is required.'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required.'],
  },
});

module.exports = model('Review', reviewSchema);
