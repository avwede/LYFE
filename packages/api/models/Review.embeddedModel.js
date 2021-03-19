const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required for Review.'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required for Review.'],
  },
  difficulty: {
    type: Number,
    required: [true, 'Difficulty is required for Review.'],
  },
  review: {
    type: String,
    required: [true, 'Review is required for Review.'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required for Review.'],
  },
});

module.exports = mongoose.model('Review', reviewSchema);
