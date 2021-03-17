const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const emergencyContactSchema = require('./EmergencyContact');
const reminderSchema = require('./Reminder');
const saltRounds = 12;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email address is required.'],
    validate: {
      validator: (val) =>
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(
          val
        ),
      message: '{VALUE} is not a valid email address',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: (val) =>
        /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[!@#$%&]).{8,})\S$/.test(
          val
        ),
      message:
        'Password must contain 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character: !, @, #, $, %, &',
    },
  },
  dateOfBirth: Date,
  allergies: [String],
  emergencyContacts: [emergencyContactSchema],
  reminders: [reminderSchema],
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
});

// Hash user password before saving to database.
userSchema.pre('save', function hashPassword(next) {
  bcrypt.hash(this.password, saltRounds, (err, hash) => {
    if (err) next(err);
    this.password = hash;
    next();
  });
});

module.exports = mongoose.model('User', userSchema);