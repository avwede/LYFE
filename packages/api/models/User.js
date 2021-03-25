const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const emergencyContactSchema = require('./EmergencyContact.embeddedModel');
const reminderSchema = require('./Reminder.embeddedModel');
const courseSchema = require('./Course');
const saltRounds = 12;

/**
 * @openapi
 * 
 * components:
 *  schemas:
 *    User:
 *      title: User
 *      type: object
 *      required:
 *        - firstName
 *        - lastName
 *        - email
 *        - password
 *      properties:
 *        firstName:
 *          type: string
 *          example: John
 *        lastName:
 *          type: string
 *          example: Smith
 *        email:
 *          type: string
 *          format: email
 *        password:
 *          type: string
 *          format: password
 *          example: Password123#
 *        dateOfBirth:
 *          type: string
 *          format: date
 *        allergies:
 *          type: array
 *          items:
 *            type: string
 *          example: ['Peanuts']
 *        emergencyContact:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/EmergencyContact'
 *        reminders:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Reminder'
 *        courses:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Courses'
 */

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required for User.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required for User'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email address is required for User'],
    validate: {
      validator: (val) =>
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(
          val
        ),
      message: '{VALUE} is not a valid email address.',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required for User.'],
    minlength: [8, 'Password must be at least 8 characters.'],
    validate: {
      validator: (val) =>
        /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[!@#$%&]).{8,})\S$/.test(
          val
        ),
      message:
        'Password must contain 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character: !, @, #, $, %, &.',
    },
  },
  dateOfBirth: Date,
  allergies: [String],
  emergencyContacts: [emergencyContactSchema],
  reminders: [reminderSchema],
  courses: [courseSchema],
});

// Hash user password before saving to database.
userSchema.pre('save', function hashPassword(next) {
  bcrypt.hash(this.password, saltRounds, (err, hash) => {
    if (err) next(err);
    this.password = hash;
    next();
  });
});

// Validate user password.
userSchema.methods.isValidPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.updateContacts = function(id, updatedContact){
  const index = this.emergencyContacts.findIndex(obj => obj._id == id);
  console.log(index);
  this.emergencyContacts[index] = updatedContact;
  return this.save();
}

module.exports = mongoose.model('User', userSchema);